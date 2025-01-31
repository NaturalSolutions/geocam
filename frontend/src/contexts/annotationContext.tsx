import { capitalize } from "@mui/material";
import { t } from "i18next";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { Annotation, FilesService } from "../client";
import { useMainContext } from "./mainContext";


export const AnnotationContext = createContext({} as any);

export const useAnnotationContext = () => useContext(AnnotationContext);

export function AnnotationContextProvider({ children }) {

    let params = useParams();
    const {
        projects,
        setCurrentDeployment,
        currentImage, setCurrentImage,
        files,
        updateListFile,
        setCurrentProject,
        image
    } = useMainContext();

    const [observations, setObservations] = useState<Annotation[]>([]);
    const [annotated, setAnnotated] = useState<undefined | boolean>(undefined);
    const [treated, setTreated] = useState<undefined | boolean>(undefined);
    const [isMinimalObservation, setIsMinimalObservation] = useState(observations?.length == 0);
    const [checked, setChecked] = useState<boolean>(observations?.length !== 0);
    const [openSaveErrorDialog, setOpenSaveErrorDialog] = useState({state: false, text: ""});
    const [gridView, setGridView] = useState(0); // 0: unique media, 1: grid
    const [selectedMedias, setSelectedMedias] = useState<any[]>([]);
    const [annotationButtonDisabled, setAnnotationButtonDisabled] = useState(false);

    const fieldsMandatory = ["species", "genus", "family", "order", "classe"];
    const [idGroup, setIdGroup] = useState<string>();
    const observationTemplate = { id: uuidv4(), id_annotation: "", id_group: "", classe: "", order: "", family: "", genus: "", species: "", life_stage: "", biological_state: "", comments: "", behaviour: "", sex: "", number: 0 };

    const handleCloseSaveErrorDialog = () => {
        setOpenSaveErrorDialog({state: false, text: ""});
    };

    const updateUrl = (id) => {
        const url = new URL(window.location.toString());
        url.pathname = `/project/${Number(params.projectId)}/deployment/${Number(params.deploymentId)}/medias/${id}`;
        window.history.pushState({}, "", url);
    };

    const previous = () => {
        files.forEach((f, i) => {
            if (f.id === currentImage) {
                let ind = i === 0 ? (i = files.length) : i;
                setCurrentImage(files[ind - 1].id);

                updateUrl(files[ind - 1].id);
            }
        });
    };

    const next = () => {
        files.forEach((f, i) => {
            if (f.id === currentImage) {
                let ind = i === files.length - 1 ? -1 : i;
                setCurrentImage(files[ind + 1].id);
                updateUrl(files[ind + 1].id);
            }
        });
    };

    const lastOrFirstImage = (indice) => {
        if (indice == 'first') {
            setCurrentImage(files[0].id);
            updateUrl(files[0].id);
        }
        if (indice == 'last') {
            setCurrentImage(files[files.length - 1].id);
            updateUrl(files[files.length - 1].id);
        }
    };

    const save = () => {
        let toSave = false;
        // let updateGroup = false;

        if (!gridView) {
            toSave = true;

            // Attention cette image à une observation qui a été faite via un groupe
            // Changer les informations de tout le groupe ?
            // updateGroup = true / false
        };
        if (gridView && selectedMedias.length > 0) {
            toSave = true;
        };

        if (!toSave) {
            setOpenSaveErrorDialog({state: true, text: capitalize(t("annotations.cannot_save_no_media_selected"))});
        };


        if(toSave) {
            if(!gridView) {
                // si pas en gridView
                // /!\ besoin d'adapter la méthode : condition + argiment updateGroup en plus
                FilesService
                    .updateAnnotationsFilesAnnotationFileIdPatch(currentImage, observations)
                    .then(res =>
                        updateListFile()
                    )
                    .catch((err) => {
                        console.log("Error during annotation saving.");
                        console.log(err);
                    });
            };
            if(gridView) {
                selectedMedias.map((item) => {
                    console.log("idGroup:", idGroup);
                    console.log("item:", item);
                    console.log("observation:", observations);
                })
            };
        };
        // si on est en gridView
        // save(selectedMedias, observations)
                        // setIdGroup(uuidv4());
                        // setSelectedMedias([]);


    };

    const saveandnext = () => {
        if (isMinimalObservation) {
            save();
            next();
        }
        else {
            setOpenSaveErrorDialog({state: true, text: capitalize(t("annotations.cannot_save_species"))});
        }
    };

    const handleAddObservation = () => {
        if (isMinimalObservation) {
            setObservations([...observations, observationTemplate]);
        };
        if (checked) {
            setChecked(false);
        };
        setIsMinimalObservation(false);
    };

    const handleDeleteObservation = (id: string) => {
        let i = observations && observations.findIndex((obs) => obs.id === id);
        let tmp_obs = [...observations]
        i !== -1 && tmp_obs.splice(i, 1);
        i !== -1 && setObservations(tmp_obs);
        i === observations.length - 1 && setIsMinimalObservation(true);
    };

    const handleCheckChange = () => {
        if (!checked) {
            setObservations([]);
            setIsMinimalObservation(true);
        };
        if (checked) {
            setObservations([...observations, observationTemplate]);
            setIsMinimalObservation(false);
        };
        setChecked(!checked);
    };

    const handleFormChange = (id: string, params: string, value: string) => {
        let tmp_obs = [...observations]

        tmp_obs.forEach(ob => {
            if (ob.id === id) {

                ob[params] = value;
                if (fieldsMandatory.includes(params) 
                    && ob[params] && 
                    ob["number"] === 0) {
                        setIsMinimalObservation(true);
                        ob["number"] = 1;
                };
            }
        })
        setObservations(tmp_obs);
    };

    useEffect(() => {
        (async () => {
            setCurrentDeployment(Number(params.deploymentId));
            setCurrentImage(params.imageId);
            setCurrentProject(Number(params.projectId));
        })();
    }, [projects]);

    useEffect(() => {
        (async () => {
            image() && setObservations(image().annotations);
            image() && setTreated(image().treated)
        })();
    }, [files, currentImage]);

    useEffect(() => {
        (async () => {
            setChecked(observations?.length === 0);
        })();
    }, [observations]);

    useEffect(() => {
        let fieldToCheck: string[] = [];
        for (var i = 0; i < observations?.length; i++) {
            for (const property in observations[i]) { 
                if (fieldsMandatory.includes(property)) {
                    fieldToCheck.push(observations[i][property])
                }
            }
        };
        const result = fieldToCheck.some(element => {
            if (element !== '') {
                return true
            } else {
                return false
            }
        });
        setAnnotated(result)
    }, [handleCheckChange]);
    
    useEffect(() => {
        if (gridView) {
            setIdGroup(uuidv4());
        };
        if (!gridView) {
          setSelectedMedias([]);
        };
    }, [gridView]);

    return(
        <AnnotationContext.Provider 
            value={{
                observations, setObservations,
                annotated, setAnnotated,
                treated, setTreated,
                isMinimalObservation, setIsMinimalObservation,
                checked, setChecked,
                openSaveErrorDialog, setOpenSaveErrorDialog,
                gridView, setGridView,
                selectedMedias, setSelectedMedias,
                annotationButtonDisabled, setAnnotationButtonDisabled,

                handleCloseSaveErrorDialog,
                updateUrl,
                previous,
                lastOrFirstImage,
                next,
                save,
                saveandnext,
                handleAddObservation,
                handleDeleteObservation,
                handleCheckChange,
                handleFormChange
            }}
        >
            {children}
        </AnnotationContext.Provider>
    );
}

export default AnnotationContextProvider;