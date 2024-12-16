import { capitalize, Grid, MenuItem, TextField, IconButton } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAnnotationContext } from "../../contexts/annotationContext";

const TraitInput = (
    props
) => {
    const { t } = useTranslation();
    const [nomenclatureData, setNomenclatureData] = useState<any>(null);
    const { handleFormChange } = useAnnotationContext();
    
    const onChange = (e) => {
        handleFormChange(props.observation.id, props.type, e.target.value);
    };

    const clear = () => {
        handleFormChange(props.observation.id, props.type, undefined)
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/nomenclapi');
                if (!response.ok) {
                    throw new Error('Error during data loading');
                }
                const data = await response.json();
                setNomenclatureData(data);

                } catch (error) {
                    console.error('Error during nomenclature fetch:', error);
                }
        }
        fetchData();
    }, []);

    return(
        <Grid item lg={6} xs={12}>
            <TextField
                type={ props.type }
                select
                label={ capitalize(t(`taxon.${props.type}`)) } 
                value={ props.observation[props.type] }
                onChange={ onChange }
                size="small"
                variant="filled"
                fullWidth
                InputProps={{
                    endAdornment: 
                    props.observation[props.type] &&
                    <IconButton
                        onClick={ () => { clear() }}
                    >
                        <HighlightOffIcon fontSize="small"/>
                    </IconButton>
                }}
            >             
                {nomenclatureData && nomenclatureData[props.type].map((item) => (
                    <MenuItem key={item.CODE} value={item.LABEL}>
                        {item.LABEL}
                    </MenuItem>
                ))}
            </TextField>
        </Grid>
    )
};
export default TraitInput;