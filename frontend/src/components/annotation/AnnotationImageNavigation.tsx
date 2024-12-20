import { Grid, IconButton, Typography } from "@mui/material";
import { useMainContext } from "../../contexts/mainContext";
import { useAnnotationContext } from "../../contexts/annotationContext";
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';


const AnnotationImageNavigation = () => {

    const { files, currentImage } = useMainContext();
    const { previous, lastOrFirstImage, next } = useAnnotationContext();

    const imageIndex = () => {
        return (files && files.findIndex((f) => f.id === currentImage) + 1);
    }

    return (
        <div className="groupNumber">
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <IconButton onClick={() => lastOrFirstImage("first")}>
                    <FastRewindIcon fontSize="large" />
                </IconButton>

                <IconButton onClick={() => previous()} >
                    <SkipPreviousIcon fontSize="large" />
                </IconButton>

                <IconButton>
                    <Typography 
                        component={"span"} 
                        variant="h6" 
                        style={{ backgroundColor: "#f5f5f5" }}
                    >
                        { imageIndex() + " | " + files.length }
                    </Typography>
                </IconButton>

                <IconButton onClick={() => next()}>
                    < SkipNextIcon fontSize="large" />
                </IconButton>

                <IconButton onClick={() => lastOrFirstImage("last")}>
                    <FastForwardIcon fontSize="large" />
                </IconButton>

                {/* <IconButton >
                    <FullscreenIcon fontSize="large" />
                </IconButton> */}
            </Grid>
        </div>
    );
};

export default AnnotationImageNavigation;