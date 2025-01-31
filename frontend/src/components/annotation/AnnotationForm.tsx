import { Divider, Stack, Tab, Tabs, Typography, capitalize, Checkbox } from "@mui/material";
import AnnotationButtons from "./AnnotationButtons";
import MetadataTab from "./MetadataTab";
import { SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import ObservationTab from "./ObservationTab";
import { useAnnotationContext } from "../../contexts/annotationContext";


export default function AnnotationForm() {
    const { t } = useTranslation();
    const { setAnnotationButtonDisabled } = useAnnotationContext();

    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event: SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setAnnotationButtonDisabled(newValue);
    };
    
    return(
        <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="stretch"
            spacing={2}
            className="stackAnnotations"
        >
            {/* <Typography 
                component="span" 
                variant="h3"
            >
                { capitalize(t("annotations.annotation")) }
            </Typography> */}

            <Tabs
                value={ tabValue }
                aria-label="basic tabs example"
                variant="fullWidth"
                onChange={ handleTabChange }
            >
                <Tab label={ capitalize(t("observations.observations_maybe_plural")) } />
                <Tab label={ capitalize(t("annotations.metadata")) } />
            </Tabs>

            <ObservationTab
                valueTab={ tabValue } 
                index={ 0 }
            />

            <MetadataTab 
                valueTab={ tabValue } 
                index={ 1 } 
            /> 
            
            <Divider />
            
            <AnnotationButtons />
        </Stack >
    )
};