import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  Box,
  Collapse,
  IconButton,
  capitalize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMainContext } from "../../contexts/mainContext";
import { FilesService, ProjectSheet, ProjectsService } from "../../client";
import DropzoneComponent from "../dropzoneComponent";
import { useTranslation } from "react-i18next";
import ButtonModify from "../common/buttonModify";
import ButtonValidate from "../common/buttonValidate";
import ButtonCancel from "../common/buttonCancel";
import { useState, useEffect } from "react";

const ProjectForm = ({ setModifyState, file, setThumbnail }) => {
  const { t } = useTranslation();
  const { projectSheetData, updateProjectSheetData } = useMainContext();
  const [projectData, setProjectData] =
    React.useState<ProjectSheet>(projectSheetData);
  const protocoles = ["Protocole A", "Protocole B", "Protocole C"];
  const species = [
    "Loup",
    "Coccinelle",
    "Ours",
    "Chamois",
    "Chevreuil",
    "Cerf",
    "Marmotte",
    "Renard",
    "Aigle",
  ];
  const [startDate, setStartDate] = React.useState<Date | null>(
    projectSheetData.start_date
  );
  const [endDate, setEndDate] = React.useState<Date | null>(
    projectSheetData.end_date
  );
  const [open, setOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [modified, setModified] = React.useState(false);
  const [oldImage, setOldImage] = useState(null);

  const handleFormChange = (
    params: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let tmp_project_data = { ...projectData };
    tmp_project_data[params] = e.target.value;
    setProjectData(tmp_project_data);
  };

  const handleChangeDate = (params: string, d: Date | null) => {
    let tmp_project_data = { ...projectData };
    d !== null && (tmp_project_data[params] = d.toISOString().slice(0, 10));
    setProjectData(tmp_project_data);
  };

  const dialog = () => {
    setOpen(true);
  };

  const handleChange = () => {
    setModified(!modified);
    setModifyState(!modified);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const save = () => {
    setModified(!modified);
    setOpen(false);
    ProjectsService.updateProjectProjectsProjectIdPut(
      projectSheetData.id,
      projectData
    )
      .then(() => {
        updateProjectSheetData();
      })
      .catch((err) => {
        console.log(err);
      });
    setSuccess(true);
  };

  return (
    <Stack>
      <Typography variant="h4" color="#000000" component="div">
        {capitalize(t("projects.sheet"))}
      </Typography>

      <Stack spacing={2} justifyContent="center">
        <Collapse in={success}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSuccess(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>Success</AlertTitle>
            {capitalize(t("main.modifications_saved"))}
          </Alert>
        </Collapse>

        <form key={projectSheetData.id}>
          <Stack direction="row" spacing={15}>
            <Grid container spacing={3}>
              {modified ? (
                <Grid item lg={12} xs={12}>
                  <TextField
                    id="name"
                    name="name"
                    label={capitalize(t("main.name"))}
                    value={projectData.name}
                    onChange={(e) => handleFormChange("name", e)}
                    fullWidth
                    required
                    variant="filled"
                  />
                </Grid>
              ) : (
                <></>
              )}

              {/* <Grid item lg={6} xs={12}>
                                <TextField
                                    disabled={!modified}
                                    select
                                    id="acquisition_framework"
                                    label={capitalize(t("projects.acquisition_framework"))}
                                    variant="filled"
                                    value={projectData['acquisition_framework']}
                                    fullWidth
                                    onChange={(e) => handleFormChange("acquisition_framework", e)}
                                >
                                    {protocoles.map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item lg={6} xs={12}>
                                <TextField
                                    disabled={!modified}
                                    label={capitalize(t("projects.target_species"))}
                                    id="targetedSpecies"
                                    select
                                    value={projectData.targeted_species}
                                    fullWidth
                                    variant="filled"
                                    onChange={(e) => handleFormChange("targeted_species", e)}

                                >
                                    {species.map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid> */}

              <Grid item lg={3} xs={12} className="datePicker">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disabled={!modified}
                    inputFormat="dd/MM/yyyy"
                    label={capitalize(t("projects.start_date"))}
                    value={startDate}
                    onChange={(startDate) => {
                      setStartDate(startDate);
                      handleChangeDate("start_date", startDate);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="filled" />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item lg={3} xs={12} className="datePicker">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disabled={!modified}
                    inputFormat="dd/MM/yyyy"
                    label={capitalize(t("projects.end_date"))}
                    value={endDate}
                    onChange={(endDate) => {
                      setEndDate(endDate);
                      handleChangeDate("end_date", endDate);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="filled" />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item lg={6} xs={12}>
                <TextField
                  id="protocol"
                  name="protocol"
                  label={capitalize(t("projects.protocol_methods"))}
                  variant="filled"
                  value={projectData.protocol}
                  onChange={(e) => handleFormChange("protocol", e)}
                  disabled={!modified}
                  fullWidth
                />
              </Grid>
            </Grid>
            {/* <Grid 
                            container 
                            justifyContent='center' 
                            alignItems='center' 
                        >
                            <DropzoneComponent sentence={`${capitalize(t("main.add_media"))} ${t("main.of")} ${t("projects.project")}`} />
                        </Grid> */}
          </Stack>
        </form>
        <Stack direction="row" spacing={3} justifyContent="flex-end">
          <ButtonModify
            content={
              modified ? (
                <>{capitalize(t("main.cancel"))}</>
              ) : (
                <>{capitalize(t("main.modify"))}</>
              )
            }
            edit={handleChange}
            variant={modified}
          />
          <ButtonValidate
            content={capitalize(t("main.save"))}
            validate={dialog}
            disabled={!modified}
          />

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              <Typography variant="h6">
                {capitalize(t("projects.change_on_project"))}
              </Typography>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Typography>{capitalize(t("main.ask_save"))}</Typography>
            </DialogContent>
            <Divider />
            <DialogActions>
              <ButtonCancel content={t("main.no")} cancel={handleClose} />
              <ButtonValidate content={t("main.yes")} validate={save} />
            </DialogActions>
          </Dialog>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default ProjectForm;
