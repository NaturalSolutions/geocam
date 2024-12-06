import {
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  IconButton,
  ListItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import NotesIcon from "@mui/icons-material/Notes";
import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import CheckIcon from "@mui/icons-material/Check";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CollectionsIcon from "@mui/icons-material/Collections";
import AddIcon from "@mui/icons-material/Add";
import ImportModale from "./importModale";
import { useState } from "react";
import GoAnnotation from "./goAnnotation";
import { useTranslation } from "react-i18next";
import { capitalize } from "@mui/material";
import { useMainContext } from "../contexts/mainContext";
import { ProjectWithDeployment, ProjectsService } from "../client";

const testStatus = (status) => {
  if (status === "Terminé") {
    return (
      <Avatar sx={{ bgcolor: "#8BD3BB" }} aria-label="status">
        <CheckIcon />
      </Avatar>
    );
  }
  if (status === "A annoter") {
    return (
      <Avatar sx={{ bgcolor: "#FF9B9B" }} aria-label="status">
        <HourglassBottomIcon />
      </Avatar>
    );
  }
  if (status === "En cours") {
    return (
      <Avatar sx={{ bgcolor: "#FFB876" }} aria-label="status">
        <HourglassBottomIcon />
      </Avatar>
    );
  }
  if (status === "A venir") {
    return (
      <Avatar sx={{ bgcolor: "#FAEF8D" }} aria-label="status">
        <AccessTimeIcon />
      </Avatar>
    );
  }

  return (
    <Avatar sx={{ bgcolor: "#ed213c" }} aria-label="status">
      <WarningAmberRoundedIcon />
    </Avatar>
  );
};

const IconStyle = { verticalAlign: "middle", minWidth: "40px" };

const ProjectCard = (props) => {
  const { projects } = useMainContext();
  const { t } = useTranslation();
  const [openImport, setOpenImport] = useState(false);

  const project = (): ProjectWithDeployment => {
    return projects.find((p) => p.id == props.selectedProject.id);
  };

  const openImportModale = (id: number) => {
    setOpenImport(true);
  };
  const closeImportModale = () => {
    setOpenImport(false);
  };

  const getLegend = (key: string, number: number) => {
    let keyTranslation = key + "s." + key;
    if (number === 0) {
      return `${capitalize(t("main.zero"))} ${t(keyTranslation)}`;
    }
    if (number === 1) {
      return `${capitalize(t(keyTranslation))}: ${number}`;
    }
    if (number > 1) {
      keyTranslation += "s";
      return `${capitalize(t(keyTranslation))}: ${number}`;
    }
    return;
  };

  return (
    <Card>
      <ImportModale
        open={openImport}
        close={closeImportModale}
        projectIsSet={true}
        projectId={props.selectedProject.id}
      />

      <CardHeader
        avatar={testStatus(props.selectedProject.status)}
        title={
          <Link
            to={`/project/${props.selectedProject.id}`}
            style={{ textDecoration: "none", color: "black", fontSize: "23px" }}
          >
            {props.selectedProject.name}
          </Link>
        }
        subheader={
          props.selectedProject.start_date === null ||
          props.selectedProject.end_date === null
            ? `${t("projects.duration_provided")}`
            : props.selectedProject.start_date +
              " / " +
              props.selectedProject.end_date
        }
      />
      <CardMedia
        component="img"
        height="194"
        image={
          props.selectedProject.url
            ? props.selectedProject.url
            : "https://cdn.pixabay.com/photo/2022/06/25/23/41/ladybug-7284337_960_720.jpg"
        }
      />

      <CardContent>
        <ListItem
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="add"
              onClick={() => openImportModale(props.selectedProject.id)}
            >
              <AddIcon />
            </IconButton>
          }
        >
          <Typography variant="body1" gutterBottom>
            <CollectionsIcon style={{ ...IconStyle }} />
            {getLegend("media", props.selectedProject.media_number)}
          </Typography>
        </ListItem>

        <ListItem>
          <Typography variant="body1" gutterBottom>
            <NaturePeopleIcon style={{ ...IconStyle }} />
            {getLegend("deployment", props.selectedProject.deployment_number)}
          </Typography>
        </ListItem>

        <ListItem>
          <Typography variant="body1" gutterBottom>
            <LocationOnIcon style={{ ...IconStyle }} />
            {getLegend("site", props.selectedProject.site_number)}
          </Typography>
        </ListItem>

        <ListItem>
          <Typography variant="body1" gutterBottom>
            <PhotoCameraIcon style={{ ...IconStyle }} />
            {getLegend("device", props.selectedProject.device_number)}
          </Typography>
        </ListItem>

        <ListItem
          secondaryAction={
            <GoAnnotation
              project_id={props.selectedProject.id}
              nb_media={props.selectedProject.media_number}
              annotation_percentage={
                props.selectedProject.annotation_percentage
              }
              page="home"
            />
          }
        >
          <Typography variant="body1" gutterBottom>
            <NotesIcon style={{ ...IconStyle }} />
            {`${capitalize(t("deployments.annotation"))}: 
                        ${props.selectedProject.annotation_percentage} %`}
          </Typography>
        </ListItem>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
