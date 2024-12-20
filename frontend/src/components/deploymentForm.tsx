import {
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useMainContext } from "../contexts/mainContext";
import { useParams } from "react-router-dom";
import {
  DeploymentsService,
  DeploymentWithTemplateSequence,
  ProjectWithDeployment,
} from "../client";
import SiteModale from "./siteMenu/siteModale";
import Map from "./Map";
import { useTranslation } from "react-i18next";
import { capitalize } from "@mui/material";
import ButtonModify from "./common/buttonModify";
import ButtonValidate from "./common/buttonValidate";
import ThumbnailDeploymentComponent from "./ThumbnailDeploymentComponent";

const DeploymentForm = (props) => {
  const {
    setCurrentProject,
    currentDeployment,
    setCurrentDeployment,
    deploymentData,
    setDeploymentData,
    updateProjectSheetData,
    sites,
    devices,
    autoTemplates,
    updateAutoTemplates,
    triggerTemplates,
    updateTriggerTemplates,
  } = useMainContext();
  let params = useParams();
  const [tmpDeploymentData, setTmpDeploymentData] =
    useState<DeploymentWithTemplateSequence>({
      id: currentDeployment,
      name: "",
      support: "",
      height: undefined,
      bait: "",
      feature: "",
      site_id: 0,
      device_id: 0,
      project_id: Number(params.projectId),
      description: "",
      start_date: "",
    });
  const { t } = useTranslation();

  const [siteName, setSiteName] = useState<string>("");
  const [deviceName, setDeviceName] = useState<string>("");
  const [isEditable, setIsEditable] = useState(false);

  const [automatic, setAutomatic] = useState({
    isAutomatic: false,
    imageNumber: 0,
    frequency: 0,
  });
  const [trigger, setTrigger] = useState({
    isTrigger: false,
    imageNumber: 0,
    frequency: 0,
  });
  const [position, setPostition] = useState({ lat: 0, lng: 0, name: "" });

  useEffect(() => {
    setCurrentProject(Number(params.projectId));
    setCurrentDeployment(Number(params.deploymentId));
  });

  useEffect(() => {
    if (!props.isNewDeployment) {
      setTmpDeploymentData(deploymentData);

      if (deploymentData && deploymentData.template_sequences?.length > 0) {
        let dataAutomatic = deploymentData.template_sequences.find(
          (t) => t.mode == "automatic"
        );
        dataAutomatic &&
          setAutomatic({
            isAutomatic: true,
            frequency: dataAutomatic.frequency,
            imageNumber: dataAutomatic.number_images,
          });

        let dataTrigger = deploymentData.template_sequences.find(
          (t) => t.mode == "trigger"
        );
        dataTrigger &&
          setTrigger({
            isTrigger: true,
            frequency: dataTrigger.frequency,
            imageNumber: dataTrigger.number_images,
          });
      }
    }

    setCurrentProject(Number(params.projectId));
    setCurrentDeployment(Number(params.deploymentId));
  }, [deploymentData]);

  useEffect(() => {
    if (!props.isNewDeployment) {
      (async () => {
        let pos = sites.find(
          (element) => element.id == deploymentData?.site_id
        );
        await setPostition({
          lat: pos.latitude,
          lng: pos.longitude,
          name: pos.name,
        });
      })();
    }
  }, [deploymentData]);

  useEffect(() => {
    let tmpSite = sites.find((s) => s.id === tmpDeploymentData?.site_id)?.name;
    setSiteName(tmpSite);
  }, [tmpDeploymentData]);

  useEffect(() => {
    let tmpDevice = devices.find(
      (d) => d.id === tmpDeploymentData?.device_id
    )?.name;
    setDeviceName(tmpDevice);
  }, [tmpDeploymentData?.device_id]);

  useEffect(() => {
    let tmpDevice = devices.find(
      (d) => d.id === tmpDeploymentData?.device_id
    )?.name;
    setDeviceName(tmpDevice);
  }, [tmpDeploymentData?.device_id]);

  const handleFormChange = (params: string, value: number | string) => {
    let updated_deployment_data = { ...tmpDeploymentData };
    updated_deployment_data[params] = value;
    setTmpDeploymentData(updated_deployment_data);
  };

  const handleModeChange = (automatic, trigger) => {
    let newSequenceTemplate: any[] = [];

    let autoTemplate;
    let triggerTemplate;

    if (automatic.isAutomatic) {
      autoTemplate = autoTemplates.find(
        (t) =>
          t.number_images == automatic.imageNumber &&
          t.frequency == automatic.frequency
      );

      if (autoTemplate === undefined) {
        newSequenceTemplate.push({
          mode: "automatic",
          number_images: automatic.imageNumber,
          frequency: automatic.frequency,
        });
      }
      if (autoTemplate) {
        newSequenceTemplate.push(autoTemplate);
      }
    }

    if (trigger.isTrigger) {
      triggerTemplate = triggerTemplates.find(
        (t) =>
          t.number_images == trigger.imageNumber &&
          t.frequency == trigger.frequency
      );

      if (triggerTemplate === undefined) {
        newSequenceTemplate.push({
          mode: "trigger",
          number_images: trigger.imageNumber,
          frequency: trigger.frequency,
        });
      }
      if (triggerTemplate) {
        newSequenceTemplate.push(triggerTemplate);
      }
    }

    let updatedTmpDeploymentData = tmpDeploymentData;
    updatedTmpDeploymentData["template_sequences"] = newSequenceTemplate;
    setTmpDeploymentData(updatedTmpDeploymentData);
  };

  const handleEdit = () => {
    if (isEditable) {
      setIsEditable(false);
      setTmpDeploymentData(deploymentData);
    } else setIsEditable(true);
  };

  const handleSave = () => {
    handleModeChange(automatic, trigger);

    if (props.isNewDeployment) {
      // POST
      console.log(tmpDeploymentData);
      DeploymentsService.createDeploymentDeploymentsPost(tmpDeploymentData)
        .then(() => {
          updateProjectSheetData();
          props.handleCloseNewDeployment();
          updateAutoTemplates();
          updateTriggerTemplates();
        })
        .catch((err) => {
          console.log("Error during deployment creation");
          console.log(err);
        });
    } else {
      // PUT
      DeploymentsService.updateDeploymentDeploymentsDeploymentIdPut(
        tmpDeploymentData
      )
        .then(() => {
          setDeploymentData(tmpDeploymentData);
          setCurrentDeployment(Number(params.deploymentId));
          isEditable ? setIsEditable(false) : setIsEditable(true);
          updateAutoTemplates();
          updateTriggerTemplates();
        })
        .catch((err) => {
          console.log("Error during deployment update");
          console.log(err);
        });
    }
  };

  const handleDateChange = (params, d) => {
    let updated_deployment_data = { ...tmpDeploymentData };
    updated_deployment_data[params] = d;
    setTmpDeploymentData(updated_deployment_data);
  };

  const handleCheckChange = (mode: string) => {
    if (mode === "automatic") {
      setAutomatic({ ...automatic, isAutomatic: !automatic.isAutomatic });
    }
    if (mode === "trigger") {
      setTrigger({ ...trigger, isTrigger: !trigger.isTrigger });
    }
  };

  const handleValueMode = (param: string, value: number) => {
    if (param === "autoImgNb") {
      setAutomatic({ ...automatic, imageNumber: value });
      return;
    }
    if (param === "triggerImgNb") {
      setTrigger({ ...trigger, imageNumber: value });
      return;
    }
    if (param === "autoFreq") {
      setAutomatic({ ...automatic, frequency: value });
      return;
    }
    if (param === "triggerFreq") {
      setTrigger({ ...trigger, frequency: value });
      return;
    }
  };

  return (
    <form>
      <Stack direction="column" spacing={5}>
        {deploymentData && position.lng !== 0 ? (
          <Grid
            container
            justifyContent="space-evenly"
            alignItems="center"
            spacing={2}
          >
            <ThumbnailDeploymentComponent />
            <Grid item lg={6} container width={500} height={300}>
              <Map position={position} zoom={3} />
            </Grid>
          </Grid>
        ) : (
          <></>
        )}

        <Paper elevation={0} sx={{ px: 2, py: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {capitalize(t("deployments.subtitle"))}
          </Typography>

          <Grid container spacing={2}>
            {(isEditable || props.isNewDeployment) && (
              <Grid container direction="row" spacing={2} sx={{ px: 2 }}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={props.isNewDeployment ? 6 : 3}
                  lg={props.isNewDeployment ? 6 : 3}
                >
                  <TextField
                    id="name"
                    name="name"
                    label={capitalize(t("deployments.name"))}
                    required
                    defaultValue={tmpDeploymentData?.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    size="small"
                    variant="filled"
                    fullWidth
                  />
                </Grid>
                {isEditable && !props.isNewDeployment && (
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <SiteModale page="deploymentPage" />
                  </Grid>
                )}
              </Grid>
            )}

            <Grid
              item
              xs={12}
              sm={12}
              md={props.isNewDeployment ? 6 : 3}
              lg={props.isNewDeployment ? 6 : 3}
            >
              <TextField
                id="site_id"
                name="site_id"
                label={capitalize(t("sites.site"))}
                select
                value={siteName}
                onChange={(e) =>
                  handleFormChange(
                    "site_id",
                    sites.find((s) => s.name === e.target.value).id
                  )
                }
                size="small"
                variant="filled"
                fullWidth
                required
                disabled={!props.isNewDeployment && !isEditable}
              >
                {sites.map((site) => (
                  <MenuItem key={site.id} value={site.name}>
                    {site.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={props.isNewDeployment ? 6 : 3}
              lg={props.isNewDeployment ? 6 : 3}
            >
              <TextField
                id="device_id"
                name="device_id"
                label={capitalize(t("devices.device"))}
                select
                value={deviceName}
                onChange={(e) =>
                  handleFormChange(
                    "device_id",
                    devices.find((d) => d.name === e.target.value).id
                  )
                }
                size="small"
                variant="filled"
                fullWidth
                required
                disabled={!props.isNewDeployment && !isEditable}
              >
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.name}>
                    {device.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={props.isNewDeployment ? 6 : 3}
              lg={props.isNewDeployment ? 6 : 3}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label={capitalize(t("projects.start_date"))}
                  inputFormat="dd/MM/yyyy"
                  value={tmpDeploymentData?.start_date || null}
                  onChange={(date) => handleDateChange("start_date", date)}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      variant="filled"
                      fullWidth
                      required
                      {...params}
                    />
                  )}
                  disabled={!props.isNewDeployment && !isEditable}
                />
              </LocalizationProvider>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={props.isNewDeployment ? 6 : 3}
              lg={props.isNewDeployment ? 6 : 3}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label={capitalize(t("projects.end_date"))}
                  inputFormat="dd/MM/yyyy"
                  value={tmpDeploymentData?.end_date || null}
                  onChange={(date) => handleDateChange("end_date", date)}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      variant="filled"
                      fullWidth
                      {...params}
                    />
                  )}
                  disabled={!props.isNewDeployment && !isEditable}
                />
              </LocalizationProvider>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={props.isNewDeployment ? 6 : 3}
              lg={props.isNewDeployment ? 6 : 3}
            >
              <TextField
                id="support"
                name="support"
                label={capitalize(t("deployments.hanging"))}
                defaultValue=""
                value={tmpDeploymentData?.support}
                onChange={(e) => handleFormChange("support", e.target.value)}
                size="small"
                variant="filled"
                fullWidth
                disabled={!props.isNewDeployment && !isEditable}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={props.isNewDeployment ? 6 : 3}
              lg={props.isNewDeployment ? 6 : 3}
            >
              <TextField
                id="feature"
                name="feature"
                label={capitalize(t("deployments.features"))}
                defaultValue=""
                value={tmpDeploymentData?.feature}
                onChange={(e) => handleFormChange("feature", e.target.value)}
                size="small"
                variant="filled"
                fullWidth
                disabled={!props.isNewDeployment && !isEditable}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={props.isNewDeployment ? 6 : 3}
              lg={props.isNewDeployment ? 6 : 3}
            >
              <TextField
                id="height"
                label={`${capitalize(t("deployments.height"))}`}
                name="height"
                value={Number(tmpDeploymentData?.height) || ""}
                onChange={(e) =>
                  handleFormChange("height", Number(e.target.value))
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
                inputProps={{
                  type: "number",
                  step: "0.1",
                  min: "0",
                }}
                size="small"
                variant="filled"
                fullWidth
                disabled={!props.isNewDeployment && !isEditable}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={props.isNewDeployment ? 6 : 3}
              lg={props.isNewDeployment ? 6 : 3}
            >
              <TextField
                id="bait"
                name="bait"
                label={capitalize(t("deployments.bait"))}
                defaultValue=""
                value={tmpDeploymentData?.bait}
                onChange={(e) => handleFormChange("bait", e.target.value)}
                size="small"
                variant="filled"
                fullWidth
                disabled={!props.isNewDeployment && !isEditable}
              />
            </Grid>
          </Grid>
        </Paper>

        <Stack
          direction={props.isNewDeployment ? "column" : "row"}
          justifyContent="center"
          spacing={2}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={props.isNewDeployment ? 12 : 6}
            lg={props.isNewDeployment ? 12 : 6}
          >
            <Paper elevation={8} sx={{ px: 2, py: 2 }}>
              <Typography variant="body1">
                {capitalize(t("deployments.auto_mode_settings"))}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormControlLabel
                    control={<Switch checked={automatic.isAutomatic} />}
                    onChange={(e) => handleCheckChange("automatic")}
                    label={capitalize(t("deployments.automatic_trigger"))}
                    disabled={!props.isNewDeployment && !isEditable}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label={`${capitalize(t("deployments.img_nb"))}`}
                    value={Number(automatic.imageNumber) || ""}
                    onChange={(e) =>
                      handleValueMode("autoImgNb", Number(e.target.value))
                    }
                    inputProps={{
                      step: 1,
                      min: 1,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                    size="small"
                    variant="filled"
                    fullWidth
                    disabled={
                      (!props.isNewDeployment && !isEditable) ||
                      !automatic.isAutomatic
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label={`${capitalize(t("deployments.frequency"))}`}
                    value={Number(automatic.frequency) || ""}
                    onChange={(e) =>
                      handleValueMode("autoFreq", Number(e.target.value))
                    }
                    inputProps={{
                      step: 0.05,
                      min: 0.05,
                      max: 1,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                    size="small"
                    variant="filled"
                    fullWidth
                    disabled={
                      (!props.isNewDeployment && !isEditable) ||
                      !automatic.isAutomatic
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={props.isNewDeployment ? 12 : 6}
            lg={props.isNewDeployment ? 12 : 6}
          >
            <Paper elevation={8} sx={{ px: 2, py: 2 }}>
              <Typography variant="body1">
                {capitalize(t("deployments.trigger_mode_settings"))}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormControlLabel
                    control={<Switch checked={trigger.isTrigger} />}
                    onChange={() => handleCheckChange("trigger")}
                    label={capitalize(t("deployments.trigger"))}
                    disabled={!props.isNewDeployment && !isEditable}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label={`${capitalize(t("deployments.img_nb"))}`}
                    value={Number(trigger.imageNumber) || ""}
                    onChange={(e) =>
                      handleValueMode("triggerImgNb", Number(e.target.value))
                    }
                    inputProps={{
                      step: 1,
                      min: 1,
                      type: "number",
                    }}
                    size="small"
                    variant="filled"
                    fullWidth
                    disabled={
                      (!props.isNewDeployment && !isEditable) ||
                      !trigger.isTrigger
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label={`${capitalize(t("deployments.frequency"))}`}
                    value={Number(trigger.frequency) || ""}
                    onChange={(e) =>
                      handleValueMode("triggerFreq", Number(e.target.value))
                    }
                    inputProps={{
                      step: 0.05,
                      min: 0.05,
                      max: 1,
                      type: "number",
                    }}
                    size="small"
                    variant="filled"
                    fullWidth
                    disabled={
                      (!props.isNewDeployment && !isEditable) ||
                      !trigger.isTrigger
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Stack>

        <Paper elevation={0}>
          <TextField
            id="description"
            name="description"
            label={capitalize(t("main.description"))}
            defaultValue=""
            value={tmpDeploymentData?.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
            variant="filled"
            multiline
            rows={4}
            fullWidth
            disabled={!props.isNewDeployment && !isEditable}
          />
        </Paper>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
        >
          {!props.isNewDeployment && (
            <ButtonModify
              content={
                isEditable ? (
                  <>{capitalize(t("main.cancel"))}</>
                ) : (
                  <>{capitalize(t("main.modify"))}</>
                )
              }
              edit={handleEdit}
              variant={isEditable}
            />
          )}
          <ButtonValidate
            content={capitalize(t("main.save"))}
            validate={handleSave}
            disabled={!(props.isNewDeployment || isEditable)}
          />
        </Stack>
      </Stack>
    </form>
  );
};
export default DeploymentForm;
