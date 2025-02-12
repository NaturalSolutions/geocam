import { useState } from "react";
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeploymentNewModale from "../deployments/DeploymentNewModale";
import ImportModale from "../importModale";
import ProjectModal from "../projectModale";
import SiteModale from "../siteMenu/siteModale";

const PageHeadBar = (props) => {
  const [openNew, setOpenNew] = useState(false);
  const handleOpenNew = () => {
    setOpenNew(true);
  };
  const handleCloseNew = () => {
    setOpenNew(false);
  };

  const [openImport, setOpenImport] = useState(false);
  const handleOpenImport = () => {
    setOpenImport(true);
  };
  const handleCloseImport = () => {
    setOpenImport(false);
  };

  const defineImportModale = (type: string) => {
    let projectIsSet = false;
    let deploymentIsSet = false;

    if (type === "project") {
      projectIsSet = true;
      deploymentIsSet = false;
    }
    if (type === "deployment") {
      projectIsSet = true;
      deploymentIsSet = true;
    }

    return (
      <ImportModale
        open={openImport}
        close={handleCloseImport}
        projectIsSet={projectIsSet}
        deploymentIsSet={deploymentIsSet}
      />
    );
  };

  const defineNewModale = (type: string) => {
    if (type === "project") {
      return (
        <ProjectModal
          openNewProject={openNew}
          handleCloseNewProject={handleCloseNew}
        />
      );
    }
    if (type === "deployment") {
      return (
        <DeploymentNewModale
          openNewDeployment={openNew}
          handleCloseNewDeployment={handleCloseNew}
        />
      );
    }
    return;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent">
        <Toolbar variant="dense">
          <Grid container>
            <Typography variant="h6" component="div" sx={{ mr: 1 }}>
              {props.data && props.data.name}
            </Typography>
          </Grid>

          <IconButton
            aria-label="menu"
            color="primary"
            sx={{ mr: 2 }}
            onClick={handleOpenNew}
          >
            <AddCircleIcon />
          </IconButton>

          <IconButton
            onClick={handleOpenImport}
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <CloudDownloadIcon />
          </IconButton>

          {defineNewModale(props.type)}

          {defineImportModale(props.type)}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default PageHeadBar;
