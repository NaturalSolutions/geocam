import { FC, useEffect, useState } from "react";
import { useMainContext } from "../contexts/mainContext";
import "../css/first.css";

import MediaGallery from "./mediaGallery";
import Dropzone from "react-dropzone";
import { Grid, Stack, Typography, capitalize } from "@mui/material";
import { useParams } from "react-router-dom";
import { FilesService } from "../client";
import FolderZipIcon from '@mui/icons-material/FolderZip';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import { useTranslation } from "react-i18next";
import ButtonsYesNo from "./common/buttonsYesNo";

const ImageList: FC<{}> = () => {
  const { t } = useTranslation()
  const [files, setFiles] = useState<any[]>([]);
  const { projects, updateListFile, setCurrentDeployment, deploymentData } =
    useMainContext();
  let params = useParams();

  useEffect(() => {
    (async () => {
      setCurrentDeployment(Number(params.deploymentId));
    })();
  }, [projects]);

  const save = () => {
    for (const file of files) {
      console.log("file:", file)
      if(file.name.includes("zip")) {
        FilesService
        .uploadZipFilesUploadZipDeploymentIdPost(Number(params.deploymentId), { zipFile: file })
        .then((res) => {
          updateListFile();
        });
      }
      else {
        FilesService
        .uploadFileFilesUploadDeploymentIdPost(Number(params.deploymentId), { file })
        .then((res) => {
          updateListFile();
        });
      }
    }
    clear();
  };

  const clear = () => {
    setFiles([]);
  };

  const loadFile = (f: any) => {
    f.forEach((f) => files.push(f));
    setFiles(files);
  };

  const dropZoneDisplayText = (legend) => {
    if (files.length === 0) {
      return (
        <p>{legend}</p>
      );
    } else {
      return <p>{files.map((f) => f.name).join(", ")}</p>;
    }
  };

  return (
    <>
      {deploymentData ? (
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ mb:2}}>
            {capitalize(t("projects.import_media"))}
          </Typography>
          <Stack spacing={2} direction="row">
            <Dropzone onDrop={loadFile} multiple maxFiles={30}>
              {({ getRootProps, getInputProps }) => (
                <section id="dropzone">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Grid container direction="column" alignItems='center'>
                      <Grid item>
                        <PermMediaIcon fontSize="large" />
                      </Grid>
                      <Grid item>
                        {dropZoneDisplayText(capitalize(t("deployments.drop_files")))}
                      </Grid>
                    </Grid>

                  </div>
                </section>
              )}
            </Dropzone>

            <Dropzone onDrop={loadFile} maxFiles={1}>
              {({ getRootProps, getInputProps }) => (
                <section id="dropzone">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} accept="zip"/>
                    <Grid container direction="column" alignItems='center'>
                      <Grid item>
                        <FolderZipIcon fontSize="large" />
                      </Grid>
                      <Grid item>
                        {dropZoneDisplayText(dropZoneDisplayText(capitalize(t("deployments.drop_files_zip"))))}
                      </Grid>
                    </Grid>
                  </div>
                </section>
              )}
            </Dropzone>
          </Stack>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <ButtonsYesNo 
              onYes={ save } 
              onNo={ clear } 
              yesContent={ capitalize(t("main.save"))} 
              noContent={capitalize(t("main.cancel"))}
            />
          </Stack>
          <MediaGallery />
        </Stack>
      ) : (
        <Stack>
          <p>{capitalize(t("deployments.unknown"))}</p>
        </Stack>
      )}
    </>
  );
};

export default ImageList;
