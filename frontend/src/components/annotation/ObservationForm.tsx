import { Grid, IconButton, Stack, TextField, Typography, capitalize } from "@mui/material";
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import { request as __request } from '../../client/core/request';
import { useTranslation } from "react-i18next";
import TaxonomicInput from "./TaxonomicInput";
import { useAnnotationContext } from "../../contexts/annotationContext";
import { FC } from "react";
import { Annotation } from "../../client/models/Annotation";
import NestedList from "../common/collapsableButton";
import TraitInput from "./TraitInput";

interface ObservationFormProps {
    observation: Annotation;
    index: number;
};

const ObservationForm: FC<ObservationFormProps> = ({ 
    observation, index 
}) => {
    const { t } = useTranslation();

    const { 
        handleDeleteObservation,
        handleFormChange
    } = useAnnotationContext();
    
    return (
        <form key={ observation.id }>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
            >
                <Typography component={"span"} variant="h6">
                    { `Observation ${ index }` }
                </Typography>

                <IconButton
                    onClick={() => handleDeleteObservation(observation.id)} >
                    <ClearTwoToneIcon />
                </IconButton>
            </Stack>
            <Grid container spacing={1}>
                <TaxonomicInput 
                    rank="classe" 
                    observation={ observation }
                />

                <TaxonomicInput 
                    rank="order" 
                    observation={ observation }
                />

                <TaxonomicInput 
                    rank="family" 
                    observation={ observation }
                />

                <TaxonomicInput 
                    rank="genus" 
                    observation={ observation }
                />

                <TaxonomicInput 
                    rank="species" 
                    observation={ observation }
                />
                
                <Grid item lg={6} xs={12}>
                    <TextField
                        name="number"
                        label={ capitalize(t("taxon.number")) }
                        size="small"
                        variant="filled"
                        inputProps={{ type: "number" }}
                        value={ observation.number }
                        onChange={
                            (e) => handleFormChange(observation.id, "number", e.target.value)
                        }
                        fullWidth
                    />
                </Grid>
            </Grid>
            <NestedList>
                <Grid container spacing={1}>
                    <TraitInput 
                        type="biological_state"
                        observation={ observation }
                    />
                    <TraitInput 
                        type="sex" 
                        observation={ observation }
                    />
                    <TraitInput 
                        type="behaviour" 
                        observation={ observation }
                    />
                    <TraitInput 
                        type="life_stage" 
                        observation={ observation }
                    />
                    <Grid item lg={12} xs={12}>
                        <TextField
                            id="comments"
                            name="comments"
                            label={ capitalize(t("main.comments")) }
                            size="small"
                            variant="filled"
                            value={ observation.comments}
                            onChange={ (e) => handleFormChange(observation.id, "comments", e.target.value) }
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </NestedList>
        </form>
    )
};
export default ObservationForm;