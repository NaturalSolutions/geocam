import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { capitalize, Checkbox, FormControlLabel, Grid, List, ListItem, Stack, Switch, Typography } from "@mui/material";
import { useMainContext } from "../../contexts/mainContext";
import { useAnnotationContext } from "../../contexts/annotationContext";
import axios from 'axios';
import { Annotation } from "../../client";


const PredictionArea: FC<{}> = () => {

    const { t } = useTranslation();

    const { image } = useMainContext();
    
    const {
        setObservations,
        observationTemplate,
    } = useAnnotationContext();

    const deepfauneMapFr = [{"taxo":"blaireau", "taxref":194585}, {"taxo":"bouquetin", "taxref":190318}, {"taxo":"cerf", "taxref":190552}, {"taxo":"chamois", "taxref":197289}, {"taxo":"chat", "taxref":192539}, {"taxo":"chevreuil", "taxref":61057}, {"taxo":"chien", "taxref":162663}, {"taxo":"ecureuil", "taxref":186261}, {"taxo":"equide", "taxref":186248}, {"taxo":"lagomorphe", "taxref":186244}, {"taxo":"loup", "taxref":60577}, {"taxo":"lynx", "taxref":194351}, {"taxo":"marmotte", "taxref":194469}, {"taxo":"micromammifere", "taxref":186206}, {"taxo":"mouflon", "taxref":195202}, {"taxo":"mouton", "taxref":199754}, {"taxo":"mustelide", "taxref":186215}, {"taxo":"oiseau", "taxref":185961}, {"taxo":"ours", "taxref":186219}, {"taxo":"renard", "taxref":60585}, {"taxo":"sanglier", "taxref":60981}, {"taxo":"vache", "taxref":199695}];

    const [predCheck, setPredChecked] = useState<boolean>(false);
    const [observation, setObservation] = useState<Annotation>(observationTemplate);

    const predCheckChange = (prediction: string) => {
        if (!predCheck) {
            setPredChecked(true);
            let deepfauneMap = deepfauneMapFr.find((element) => element.taxo == prediction);
            let id_annot = deepfauneMap?.taxref.toString();
            id_annot && getDataById(id_annot);
        };
        if (predCheck) {
            setPredChecked(false);
            setObservations([]);
        };
    };

    async function getDataById (id_annot: string) {
        let data = (await axios.get(`/taxapi/V1/taxons?CD_NOM=${id_annot}`)).data;
        // TODO: should be modified when new taxapi image will be used (request on CD_REF returns unique match)
        // if (data.length > 1) {
        //     console.log("Error: many matches with CD_REF="+id_annot);
        //     return;
        // };
        // data = data[0];
        data = data.find((element) => element.CD_REF == id_annot);

        let classe = data.CLASSE || "";
        let order = data.ORDRE || "";
        let family = data.FAMILLE || "";
        if (data.RANG="GN") {
            setObservation({...observation, id_annotation: id_annot, classe: classe, order: order, family: family, genus: data.LB_NOM, number: 1 });
        };
        if (data.RANG="ES") {
            setObservation({...observation, id_annotation: id_annot, classe: classe, order: order, family: family, genus: data.LB_NOM.split(" ")[0], species: data.LB_NOM, number: 1 });
        };
        
    };

    useEffect(() => {
        setPredChecked(false);
    }, [image()?.id]);

    useEffect(() => {
        setObservations([observation]);
    },[observation]);

    return (
        <>{
            image() && 
            Object.keys(image().prediction_deepfaune).length !== 0 && 
            <List>
                <Typography variant="overline">{ capitalize(t("annotations.prediction")) }</Typography>
                <ListItem>
                    <FormControlLabel 
                        control={ <Checkbox 
                            checked={ predCheck }
                            onChange={ () => predCheckChange(image().prediction_deepfaune.prediction) }
                        /> } 
                        label={"Deepfaune : " + capitalize(image().prediction_deepfaune.prediction) + " (score : " + image().prediction_deepfaune.score.toString() + ")" }
                    />
                </ListItem>
            </List>
        }</>
    );
};

export default PredictionArea;