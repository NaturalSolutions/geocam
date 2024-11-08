import { useNavigate } from "react-router-dom";
import { Grid, Tooltip, Typography } from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const thumbnailStyle = {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    display: "block",
    width: "100%"
}

const GalleryItem = (
    props
) => {

    let navigate = useNavigate();

    const displayMedia = (id: string) => {
        navigate(`${id}`);
    };

    const displayImage = (item) => {
        if (item.extension.includes("image")) {
          return (
            <img
                src={ `${item.url}` }
                alt={ item.name }
                loading="lazy"
                onClick={ () => displayMedia(item.id) }
                style={ thumbnailStyle }
            />
          )
        }
        else {
            return(
                <video
                    style={ thumbnailStyle }
                    onClick={ () => displayMedia(item.id) }
                >
                    <source 
                        src={ `${item.url}#t=1` } // t value can be ajusted to display a specific start time as video thumbnail
                        type="video/mp4"
                    />
                    { item.name }
                </video>
            )
        }
    };

    const displayName = (name) => {
        return(
            <Tooltip title={ name } placement="bottom" arrow>
                <Typography 
                    noWrap 
                    component={"span"}
                    variant="body2"
                    sx={{ width: "80%" }}
                >
                    { name }
                </Typography>
            </Tooltip>
        )
    }

    const displayThumbnail = (item) => {
        return (
            <>
                { displayImage(item) }
                <Grid 
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    { 
                        Object.keys(item.prediction_deepfaune).length !== 0 &&
                        <CheckCircleOutlineIcon sx={{ color: "#616161E5", width: "10%" }} />
                    }
                    { 
                        item.extension.includes("image") ? 
                        <CameraAltIcon sx={{ color: "#616161E5", width: "10%" }} /> :
                        <VideocamIcon  sx={{ color: "#616161E5", width: "10%" }} />
                    }
                    { displayName(item.name) }
                </Grid>
            </>
        )
    };

    return(
            <div 
                key={ props.index } 
                style={{
                    border: "2px solid",
                    borderRadius: "5px",
                    borderColor: props.item.treated ? "green" : "red"
                }}
            >
                { displayThumbnail(props.item) }
            </div>
    )
};

export default GalleryItem;