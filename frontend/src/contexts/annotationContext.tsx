import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Annotation, FilesService } from "../client";
import { useMainContext } from "./mainContext";

export const AnnotationContext = createContext({} as any);

export const useAnnotationContext = () => useContext(AnnotationContext);

export function AnnotationContextProvider({ children }) {
  let params = useParams();
  const {
    projects,
    setCurrentDeployment,
    currentImage,
    setCurrentImage,
    files,
    updateListFile,
    setCurrentProject,
    image,
  } = useMainContext();

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [annotated, setAnnotated] = useState<undefined | boolean>(undefined);
  const [treated, setTreated] = useState<undefined | boolean>(undefined);
  const [isMinimalObservation, setIsMinimalObservation] = useState(
    annotations?.length == 0
  );
  const [checked, setChecked] = useState<boolean>(annotations?.length !== 0);
  const [openSaveErrorDialog, setOpenSaveErrorDialog] = useState(false);
  const fieldsMandatory = ["species", "genus", "family", "order", "classe"];
  const observationTemplate = {
    id: uuidv4(),
    id_annotation: "",
    classe: "",
    order: "",
    family: "",
    genus: "",
    species: "",
    life_stage: "",
    biological_state: "",
    comments: "",
    behaviour: "",
    sex: "",
    number: 0,
  };

  const handleCloseSaveErrorDialog = () => {
    setOpenSaveErrorDialog(false);
  };

  const updateUrl = (id) => {
    const url = new URL(window.location.toString());
    url.pathname = `/project/${Number(params.projectId)}/deployment/${Number(
      params.deploymentId
    )}/medias/${id}`;
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
    if (indice == "first") {
      setCurrentImage(files[0].id);
      updateUrl(files[0].id);
    }
    if (indice == "last") {
      setCurrentImage(files[files.length - 1].id);
      updateUrl(files[files.length - 1].id);
    }
  };

  const save = () => {
    FilesService.updateAnnotationsFilesAnnotationFileIdPatch(currentImage, {
      date,
      annotations,
    })
      .then((res) => updateListFile())
      .catch((err) => {
        console.log("Error during annotation saving.");
        console.log(err);
      });
  };

  const saveandnext = () => {
    if (isMinimalObservation) {
      save();
      next();
    } else {
      setOpenSaveErrorDialog(true);
    }
  };

  const handleAddObservation = () => {
    if (isMinimalObservation) {
      setAnnotations([...annotations, observationTemplate]);
    }
    if (checked) {
      setChecked(false);
    }
    setIsMinimalObservation(false);
  };

  const handleDeleteObservation = (id: string) => {
    let i = annotations && annotations.findIndex((obs) => obs.id === id);
    let tmp_obs = [...annotations];
    i !== -1 && tmp_obs.splice(i, 1);
    i !== -1 && setAnnotations(tmp_obs);
    i === annotations.length - 1 && setIsMinimalObservation(true);
  };

  const handleCheckChange = () => {
    if (!checked) {
      setAnnotations([]);
      setIsMinimalObservation(true);
    }
    if (checked) {
      setAnnotations([...annotations, observationTemplate]);
      setIsMinimalObservation(false);
    }
    setChecked(!checked);
  };

  const handleFormChange = (id: string, params: string, value: string) => {
    let tmp_obs = [...annotations];

    tmp_obs.forEach((ob) => {
      if (ob.id === id) {
        ob[params] = value;
        if (
          fieldsMandatory.includes(params) &&
          ob[params] &&
          ob["number"] === 0
        ) {
          setIsMinimalObservation(true);
          ob["number"] = 1;
        }
      }
    });
    setAnnotations(tmp_obs);
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
      image() && setAnnotations(image().annotations);
      image() && setTreated(image().treated);
      image() && setDate(image().date);
    })();
  }, [files, currentImage]);

  useEffect(() => {
    (async () => {
      setChecked(annotations?.length === 0);
    })();
  }, [annotations]);

  useEffect(() => {
    let fieldToCheck: string[] = [];
    for (var i = 0; i < annotations?.length; i++) {
      for (const property in annotations[i]) {
        if (fieldsMandatory.includes(property)) {
          fieldToCheck.push(annotations[i][property]);
        }
      }
    }
    const result = fieldToCheck.some((element) => {
      if (element !== "") {
        return true;
      } else {
        return false;
      }
    });
    setAnnotated(result);
  }, [handleCheckChange]);

  return (
    <AnnotationContext.Provider
      value={{
        annotations,
        setAnnotations,
        annotated,
        setAnnotated,
        treated,
        setTreated,
        isMinimalObservation,
        setIsMinimalObservation,
        checked,
        setChecked,
        openSaveErrorDialog,
        setOpenSaveErrorDialog,
        date,
        setDate,
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
        handleFormChange,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
}

export default AnnotationContextProvider;
