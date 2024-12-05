import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Grid,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  capitalize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMainContext } from "../../contexts/mainContext";
import { Devices, DevicesService } from "../../client";
import { useTranslation } from "react-i18next";
import ButtonModify from "../common/buttonModify";
import ButtonValidate from "../common/buttonValidate";
import DialogYesNo from "../common/dialogYesNo";
import ThumbnailDeviceComponent from "../ThumbnailDeviceComponent";

const DeviceForm = () => {
  const { t } = useTranslation();
  const { device, updateDeviceMenu } = useMainContext();
  const [deviceData, setDeviceData] = React.useState<Devices>(device());
  const [open, setOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [modified, setModified] = React.useState(false);

  const handleFormChange = (
    params: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let tmp_device_data = { ...deviceData };
    tmp_device_data[params] = e.target.value;
    setDeviceData(tmp_device_data);
  };

  const handleChangeDate = (params: string, d) => {
    let tmp_device_data = { ...deviceData };
    d !== null && (tmp_device_data[params] = d.toISOString().slice(0, 10));
    setDeviceData(tmp_device_data);
  };

  const dialog = () => {
    setOpen(true);
  };

  const handleChange = () => {
    setModified(!modified);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const save = () => {
    deviceData.id &&
      DevicesService.updateDeviceDevicesDeviceIdPut(deviceData?.id, deviceData)
        .then(() => {
          setModified(!modified);
          setOpen(false);
          updateDeviceMenu();
          setSuccess(true);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  return (
    <Grid container spacing={2}>
      <Grid container justifyContent="center" lg={3}>
        <ThumbnailDeviceComponent />
      </Grid>
      <Grid container lg={9} justifyContent="flex-end" alignItems="center">
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
        <form key={deviceData.id}>
          <Stack direction="row">
            <Grid container spacing={3}>
              {modified ? (
                <Grid item lg={12} md={12} xs={12}>
                  <TextField
                    required
                    id="name"
                    name="name"
                    label={capitalize(t("main.name"))}
                    value={deviceData.name}
                    onChange={(e) => handleFormChange("name", e)}
                    fullWidth
                    variant="filled"
                  />
                </Grid>
              ) : (
                <></>
              )}
              <Grid item lg={2.4} md={4} xs={6}>
                <TextField
                  disabled={!modified}
                  label={capitalize(t("devices.model"))}
                  variant="filled"
                  value={deviceData.model}
                  fullWidth
                  onChange={(e) => handleFormChange("model", e)}
                />
              </Grid>
              <Grid item lg={2.4} md={4} xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disabled={!modified}
                    inputFormat="dd/MM/yyyy"
                    label={capitalize(t("devices.purchase_date"))}
                    value={deviceData?.purchase_date || null}
                    onChange={(purchaseDate) => {
                      handleChangeDate("purchase_date", purchaseDate);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="filled" />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item lg={2.4} md={4} xs={6}>
                <TextField
                  disabled={!modified}
                  label={`${capitalize(t("devices.price"))} (€)`}
                  name="price"
                  id="price"
                  inputProps={{ type: "number" }}
                  value={deviceData.price}
                  fullWidth
                  variant="filled"
                  onChange={(e) => handleFormChange("price", e)}
                />
              </Grid>
              <Grid item lg={2.4} md={4} xs={6}>
                <TextField
                  disabled={!modified}
                  label={`${capitalize(t("devices.detection_area"))} (m)`}
                  id="detection_area"
                  inputProps={{ type: "number" }}
                  value={deviceData.detection_area}
                  fullWidth
                  variant="filled"
                  onChange={(e) => handleFormChange("detection_area", e)}
                />
              </Grid>
              <Grid item lg={2.4} md={4} xs={6}>
                <TextField
                  disabled={!modified}
                  label={`${capitalize(t("devices.operating_life"))} (h)`}
                  id="operating_life"
                  inputProps={{ type: "number" }}
                  value={deviceData.operating_life}
                  fullWidth
                  variant="filled"
                  onChange={(e) => handleFormChange("operating_life", e)}
                />
              </Grid>
              <Grid item lg={12} md={12} xs={12}>
                <TextField
                  id="description"
                  name="description"
                  label={capitalize(t("main.description"))}
                  value={deviceData.description}
                  onChange={(e) => handleFormChange("description", e)}
                  variant="filled"
                  disabled={!modified}
                  multiline={true}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Stack>
        </form>

        <Stack direction="row" spacing={3} justifyContent="flex-end">
          <ButtonModify
            content={
              modified ? (
                <>{capitalize(t("main.cancel"))} </>
              ) : (
                <>{capitalize(t("main.modify"))} </>
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
                {capitalize(t("devices.change"))}
              </Typography>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Typography>{capitalize(t("main.ask_save"))}</Typography>
            </DialogContent>
            <Divider />
            <DialogYesNo onYes={save} onNo={handleClose} />
          </Dialog>
        </Stack>
      </Grid>
    </Grid>
  );
};
export default DeviceForm;
