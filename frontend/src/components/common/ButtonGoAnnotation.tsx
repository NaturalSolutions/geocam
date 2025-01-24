import { IconButton } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../contexts/mainContext";
import { useAnnotationContext } from "../../contexts/annotationContext";

const ButtonGoAnnotation = (
    props
) => {
    
    const navigate = useNavigate();
    const { currentProject, currentDeployment, setCurrentImage } = useMainContext();
    const { setGridView, setSelectedMedias } = useAnnotationContext();
    
    const handleClickButton = () => {
        navigate(`/project/${ currentProject }/deployment/${ currentDeployment }/medias/${ props.id }`);
        setCurrentImage(props.id);
        setGridView(false);
    };

    return(
        <IconButton
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            aria-label={`info about ${ props.name }`}
            onClick={ handleClickButton }
        >
            <ArrowForwardIcon />
        </IconButton>
)};

export default ButtonGoAnnotation;