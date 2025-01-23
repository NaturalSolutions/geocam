
import { Grid, Switch } from "@mui/material";
import PhotoIcon from '@mui/icons-material/Photo';
import GridViewIcon from '@mui/icons-material/GridView';
import { useAnnotationContext } from "../../contexts/annotationContext";
import { useMainContext } from "../../contexts/mainContext";

const GridSwitcher = () => {
    const { image } = useMainContext();
    const { gridView, setGridView, setObservations } = useAnnotationContext(); 

    const handleAnnotationSwitcher = () => {
        if(gridView) {
            setGridView(0);
            setObservations(image().annotations)
        };
        if(!gridView) {
            setGridView(1)
            setObservations([]);
        };
    }; 

    return(
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <PhotoIcon />
            <Switch onClick={ handleAnnotationSwitcher } />
            <GridViewIcon fontSize="large" />
        </Grid>
    )
};

export default GridSwitcher;