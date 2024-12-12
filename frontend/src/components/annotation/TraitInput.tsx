import { capitalize, Grid, MenuItem, TextField, IconButton } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useAnnotationContext } from "../../contexts/annotationContext";

const traitList = {"sex":[{"LABEL":"femelle","CODE":2,"PRÉCISION":null},{"LABEL":"hermaphrodite","CODE":4,"PRÉCISION":null},{"LABEL":"mâle","CODE":3,"PRÉCISION":null},{"LABEL":"mixte","CODE":5,"PRÉCISION":null},{"LABEL":"non déterminable","CODE":1,"PRÉCISION":"Pour le cas où l’on ne peut pas déterminer le sexe (observation trop courte ou trop lointaine par exemple, ou ne fournissant pas suffisamment d'éléments)"}],"life_stage":[{"LABEL":"adulte","CODE":50,"PRÉCISION":null},{"LABEL":"polype","CODE":70,"PRÉCISION":"adulte"},{"LABEL":"méduse","CODE":71,"PRÉCISION":"adulte"},{"LABEL":"éphyra","CODE":72,"PRÉCISION":"adulte"},{"LABEL":"nouveau-né","CODE":90,"PRÉCISION":null},{"LABEL":"au nid","CODE":55,"PRÉCISION":null},{"LABEL":"de l’année","CODE":121,"PRÉCISION":null},{"LABEL":"foetus","CODE":122,"PRÉCISION":null},{"LABEL":"gamétophyte","CODE":110,"PRÉCISION":null},{"LABEL":"hydroïde","CODE":74,"PRÉCISION":null},{"LABEL":"juvénile","CODE":51,"PRÉCISION":"stade juvénile non connu "},{"LABEL":"juvénile I","CODE":81,"PRÉCISION":null},{"LABEL":"juvénile II","CODE":82,"PRÉCISION":null},{"LABEL":"juvénile III","CODE":83,"PRÉCISION":null},{"LABEL":"juvénile IV","CODE":84,"PRÉCISION":null},{"LABEL":"juvénile V","CODE":85,"PRÉCISION":null},{"LABEL":"juvénile VI","CODE":86,"PRÉCISION":null},{"LABEL":"manca","CODE":63,"PRÉCISION":"juvénile"},{"LABEL":"larve","CODE":53,"PRÉCISION":"stade larvaire non connu"},{"LABEL":"larve I (pronymphe)","CODE":64,"PRÉCISION":null},{"LABEL":"larve II","CODE":66,"PRÉCISION":null},{"LABEL":"larve III","CODE":67,"PRÉCISION":null},{"LABEL":"larve IV","CODE":68,"PRÉCISION":null},{"LABEL":"larve V","CODE":69,"PRÉCISION":null},{"LABEL":"prénymphe (prépupe)","CODE":65,"PRÉCISION":"larve"},{"LABEL":"protolarve","CODE":76,"PRÉCISION":"larve"},{"LABEL":"mésolarve","CODE":77,"PRÉCISION":"larve"},{"LABEL":"métalarve","CODE":78,"PRÉCISION":"larve"},{"LABEL":"copepodite I","CODE":100,"PRÉCISION":"larve"},{"LABEL":"copepodite II","CODE":101,"PRÉCISION":"larve"},{"LABEL":"copepodite III","CODE":102,"PRÉCISION":"larve"},{"LABEL":"copepodite IV","CODE":103,"PRÉCISION":"larve"},{"LABEL":"copepodite V","CODE":104,"PRÉCISION":"larve"},{"LABEL":"copepodite VI","CODE":105,"PRÉCISION":"larve"},{"LABEL":"nauplius","CODE":61,"PRÉCISION":"larve"},{"LABEL":"métanaupluis","CODE":91,"PRÉCISION":"larve"},{"LABEL":"zoé","CODE":60,"PRÉCISION":"larve"},{"LABEL":"protozoé","CODE":92,"PRÉCISION":"larve"},{"LABEL":"planula","CODE":73,"PRÉCISION":"larve"},{"LABEL":"macrothallus","CODE":112,"PRÉCISION":null},{"LABEL":"microthallus","CODE":113,"PRÉCISION":null},{"LABEL":"nymphe (chrysalide/pupe)","CODE":57,"PRÉCISION":null},{"LABEL":"oeuf","CODE":52,"PRÉCISION":null},{"LABEL":"post-larve","CODE":54,"PRÉCISION":null},{"LABEL":"megalopa","CODE":62,"PRÉCISION":"post-larve"},{"LABEL":"cypris","CODE":80,"PRÉCISION":"post-larve"},{"LABEL":"sporophyte","CODE":111,"PRÉCISION":null},{"LABEL":"subadulte (subimago)","CODE":56,"PRÉCISION":null}],"behaviour":[{"TYPE":"alimentation","LABEL":null,"CODE":100,"PRECISION":null},{"TYPE":"alimentation","LABEL":"chasse","CODE":101,"PRECISION":null},{"TYPE":"alimentation","LABEL":"recherche de nourriture","CODE":102,"PRECISION":null},{"TYPE":"alimentation","LABEL":"nourrissage des jeunes","CODE":103,"PRECISION":null},{"TYPE":"alimentation","LABEL":"fait des réserves","CODE":104,"PRECISION":null},{"TYPE":"comportement de construction","LABEL":null,"CODE":200,"PRECISION":null},{"TYPE":"comportement de construction","LABEL":"creuse","CODE":201,"PRECISION":null},{"TYPE":"comportement de construction","LABEL":"tisse","CODE":202,"PRECISION":null},{"TYPE":"comportement de construction","LABEL":"entremêle","CODE":203,"PRECISION":null},{"TYPE":"comportement de construction","LABEL":"entrepose","CODE":204,"PRECISION":null},{"TYPE":"comportement de construction","LABEL":"polis","CODE":205,"PRECISION":null},{"TYPE":"comportement de construction","LABEL":"autre mouvement de construction/ingénierie de son environnement","CODE":206,"PRECISION":null},{"TYPE":"déplacement","LABEL":null,"CODE":300,"PRECISION":null},{"TYPE":"déplacement","LABEL":"vol","CODE":301,"PRECISION":null},{"TYPE":"déplacement","LABEL":"envol","CODE":302,"PRECISION":null},{"TYPE":"déplacement","LABEL":"fuite","CODE":303,"PRECISION":null},{"TYPE":"déplacement","LABEL":"nage","CODE":304,"PRECISION":null},{"TYPE":"déplacement","LABEL":"marche/trotte","CODE":305,"PRECISION":null},{"TYPE":"repos","LABEL":null,"CODE":400,"PRECISION":null},{"TYPE":"repos","LABEL":"dortoir","CODE":401,"PRECISION":null},{"TYPE":"repos","LABEL":"halte migratoire","CODE":402,"PRECISION":null},{"TYPE":"repos","LABEL":"réchauffement","CODE":403,"PRECISION":"Réchauffement des reptiles"},{"TYPE":"reproduction","LABEL":null,"CODE":500,"PRECISION":null},{"TYPE":"reproduction","LABEL":"pond","CODE":501,"PRECISION":null},{"TYPE":"reproduction","LABEL":"amplexus","CODE":502,"PRECISION":null},{"TYPE":"reproduction","LABEL":"parade nuptiale","CODE":503,"PRECISION":null},{"TYPE":"reproduction","LABEL":"rut","CODE":504,"PRECISION":null},{"TYPE":"reproduction","LABEL":"couve","CODE":505,"PRECISION":null},{"TYPE":"reproduction","LABEL":"tandem|cœur copulatoire","CODE":506,"PRECISION":null},{"TYPE":"reproduction","LABEL":"accouplement","CODE":507,"PRECISION":null},{"TYPE":"reproduction","LABEL":"mise bas","CODE":508,"PRECISION":null},{"TYPE":"reproduction","LABEL":"swarming","CODE":509,"PRECISION":"Propre au chauve-souris"},{"TYPE":"reproduction","LABEL":"essaimage","CODE":510,"PRECISION":"Propre aux abeilles"},{"TYPE":"territorial","LABEL":null,"CODE":600,"PRECISION":null},{"TYPE":"territorial","LABEL":"marquage du territoire","CODE":601,"PRECISION":null},{"TYPE":"territorial","LABEL":"houspillage","CODE":602,"PRECISION":null},{"TYPE":"territorial","LABEL":"combat","CODE":603,"PRECISION":null},{"TYPE":"territorial","LABEL":"intimidation|agressivité","CODE":604,"PRECISION":null},{"TYPE":"vocalise","LABEL":null,"CODE":700,"PRECISION":null},{"TYPE":"vocalise","LABEL":"chant","CODE":701,"PRECISION":null},{"TYPE":"vocalise","LABEL":"cri","CODE":702,"PRECISION":null},{"TYPE":"vocalise","LABEL":"brame","CODE":703,"PRECISION":null},{"TYPE":"vocalise","LABEL":"signal d’alarme","CODE":704,"PRECISION":null},{"TYPE":"autre","LABEL":null,"CODE":800,"PRECISION":null},{"TYPE":"autre","LABEL":"joue","CODE":801,"PRECISION":null}],"biological_state":[{"LABEL":"blessé","CODE":1,"PRÉCISION":"Par la chasse, la prédation, une chute…"},{"LABEL":"vivant","CODE":2,"PRÉCISION":"Spécimen observé vivant avant la mise en œuvre de la technique de collecte"},{"LABEL":"mort ","CODE":3,"PRÉCISION":"Spécimen observé mort avant la mise en œuvre de la technique de collecte "},{"LABEL":"dégradé","CODE":4,"PRÉCISION":"Pour flore et fonge (cueillette, piétinement, arrachage, fauche, etc.)"}]}



const TraitInput = (
    props
) => {
    const { t } = useTranslation();

    const { handleFormChange } = useAnnotationContext();
    
    const onChange = (e) => {
        handleFormChange(props.observation.id, props.type, e.target.value);
    };

    const clear = () => {
        handleFormChange(props.observation.id, props.type, undefined)
    };
    
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
                {traitList[props.type].map((item) => (
                    <MenuItem key={item.CODE} value={item.LABEL}>
                        {item.LABEL}
                    </MenuItem>
                ))}
            </TextField>
        </Grid>
    )
};
export default TraitInput;