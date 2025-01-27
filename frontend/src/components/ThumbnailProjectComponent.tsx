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
    if (projectSheetData) {
      ProjectsService.fetchProjectThumbnailProjectsFetchProjectThumbnailProjectIdGet(
        projectSheetData?.id
      ).then((res) => {
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
      FilesService.uploadFilesFilesUploadProjectProjectIdPost(
        projectSheetData?.id,
        { file }
      ).then((res) => {
        updateProjectSheetData();
        ProjectsService.fetchProjectThumbnailProjectsFetchProjectThumbnailProjectIdGet(
          projectSheetData?.id
        ).then((res) => {
          setThumbnail(res[0].url);
        });
      });
    }
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
