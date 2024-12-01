import { useEffect, useState } from "react";
import ThumbnailComponent from "./ThumbnailComponent";
import { useMainContext } from "../contexts/mainContext";
import {
  FilesService,
  ProjectWithDeployment,
  ProjectsService,
} from "../client";

const ThumbnailProjectComponent = ({
  setModifyState,
  modifyState,
  setFile,
  file,
}) => {
  const { projectSheetData, updateProjects, updateProjectSheetData } =
    useMainContext();
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    console.log(projectSheetData);
    if (projectSheetData) {
      ProjectsService.readProjectThumbnail(projectSheetData?.id).then((res) => {
        setThumbnail(res[0].url);
        fetch(res[0].url).then((r) => {
          if (r.status != 200) {
            setThumbnail(null);
          }
        });
      });
    }
  }, [projectSheetData]);

  const saveThumbnail = async () => {
    if (projectSheetData) {
      console.log(file);
      FilesService.uploadProjectFile(projectSheetData?.id, { file }).then(
        (res) => {
          updateProjectSheetData();
          ProjectsService.readProjectThumbnail(projectSheetData?.id).then(
            (res) => {
              setThumbnail(res[0].url);
            }
          );
        }
      );
    }
  };
  const clear = () => {
    setFile("");
  };

  const get_file_name = (fileName) => {
    // Cette expression régulière correspond à tous les types d'extensions d'images mentionnés
    const match = fileName.match(/([^\/]+\.(png|jpg|jpeg|gif|bmp))/i);
    return match ? match[1] : null;
  };

  return (
    <ThumbnailComponent
      saveThumbnail={saveThumbnail}
      text="project"
      thumbnail={thumbnail}
      setFile={setFile}
      file={file}
      modifyState={modifyState}
      setModifyState={setModifyState}
    />
  );
};

export default ThumbnailProjectComponent;
