import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {
  Stack,
  Typography,
  Alert,
  AlertTitle,
  capitalize,
} from "@mui/material";
import ProjectDeployments from "./projectDeployments";
import ProjectForm from "./projectForm";
import ProjectInformations from "./projectInformations";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { useMainContext } from "../../contexts/mainContext";
import DeploymentNewModale from "../deployments/DeploymentNewModale";
import ImportModale from "../importModale";
import ProjectModal from "../projectModale";
import Map from "../Map";
import { useTranslation } from "react-i18next";
import ButtonValidate from "../common/buttonValidate";
import ThumbnailProjectComponent from "../ThumbnailProjectComponent";

const ProjectSheet = () => {
  const { projectSheetData, setCurrentProject, sites } = useMainContext();
  const { t } = useTranslation();
  const [openNewDeployment, setOpenNewDeployment] = useState(false);
  const [load, setload] = useState(true);
  const [position, setPostition] = useState<any>([]);
  const [modifyState, setModifyState] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);
  const [thumbnail, setThumbnail] = useState<any>(null);

  const handleOpenNewDeployment = () => {
    setOpenNewDeployment(true);
  };
  const handleCloseNewDeployment = () => {
    setOpenNewDeployment(false);
  };

  const [openImport, setOpenImport] = useState(false);
  const openImportModale = () => {
    setOpenImport(true);
  };
  const closeImportModale = () => {
    setOpenImport(false);
  };

  let params = useParams();

  useEffect(() => {
    (async () => {
      await setCurrentProject(Number(params.projectId));
    })();
  }, []);

  useEffect(() => {
    projectSheetData !== undefined ? setload(false) : setload(true);
  }, [projectSheetData]);

  useEffect(() => {
    if (projectSheetData !== undefined) {
      projectSheetData.deployments.map((data, k) => {
        let pos = sites.find((element) => element.id === data.site_id);
        setPostition((position) => [
          ...position,
          { lat: pos.latitude, lng: pos.longitude, name: pos.name },
        ]);
      });
    }
  }, [load]);

  return load ? (
    <Stack direction="column" spacing={5}></Stack>
  ) : projectSheetData && !load ? (
    <Stack direction="column" spacing={5}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="transparent">
          <Toolbar variant="dense">
            <Grid container>
              <Typography variant="h6" component="div" sx={{ mr: 1 }}>
                {projectSheetData.name}
              </Typography>
            </Grid>

            <ProjectModal />
            <IconButton
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={openImportModale}
            >
              <CloudDownloadIcon />
            </IconButton>
            <ImportModale
              open={openImport}
              close={closeImportModale}
              projectIsSet={true}
            />
          </Toolbar>
        </AppBar>
      </Box>

      <ProjectInformations />
      <Typography variant="h4" color="#000000" component="div">
        {capitalize(t("projects.sheet"))}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Grid lg={2} xs={12}>
          <ThumbnailProjectComponent
            modifyState={modifyState}
            setModifyState={setModifyState}
            setFile={setFile}
            file={file}
          />
        </Grid>
        <Grid lg={10} xs={12}>
          <ProjectForm
            setModifyState={setModifyState}
            file={file}
            setThumbnail={setThumbnail}
          />
        </Grid>
      </Stack>

      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4" color="#000000" component="div">
            {`${capitalize(t("deployments.deployments"))}`} (
            {projectSheetData.deployments.length})
          </Typography>
          <Grid>
            <ButtonValidate
              content={capitalize(t("projects.new_deploy"))}
              validate={handleOpenNewDeployment}
              startIcon="add"
            />
          </Grid>
          <DeploymentNewModale
            openNewDeployment={openNewDeployment}
            handleCloseNewDeployment={handleCloseNewDeployment}
          />
        </Stack>
        <ProjectDeployments />
      </Stack>
      {projectSheetData.deployments.length !== 0 && position.length !== 0 ? (
        <Stack spacing={2} justifyContent="center">
          <Typography variant="h4" color="#000000" component="div">
            {capitalize(t("projects.studies_area"))}
          </Typography>
          <Grid container justifyContent="center" alignItems="center">
            <Grid
              container
              item
              justifyContent="center"
              height={400}
              width={1000}
              spacing={1}
              style={{ backgroundColor: "#D9D9D9" }}
            >
              <Map position={position} zoom={2} />
            </Grid>
          </Grid>
        </Stack>
      ) : (
        <></>
      )}
    </Stack>
  ) : (
    <Alert severity="error">
      <AlertTitle>{capitalize(t("projects.error"))}</AlertTitle>
      <p>{capitalize(t("projects.error_msg"))}</p>
    </Alert>
  );
};
export default ProjectSheet;
