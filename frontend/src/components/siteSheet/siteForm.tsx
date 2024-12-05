import * as React from "react";
import {
  Grid,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  capitalize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMainContext } from "../../contexts/mainContext";
import { Sites, SitesService } from "../../client";
import { useTranslation } from "react-i18next";
import Map from "../Map";
import ButtonValidate from "../common/buttonValidate";
import ButtonModify from "../common/buttonModify";
import ButtonCancel from "../common/buttonCancel";
import ThumbnailSitesComponent from "../ThumbnailSitesComponents";
import { useEffect, useState } from "react";

const SiteForm = () => {
  const { t } = useTranslation();
  const { site, updateSites } = useMainContext();
  const [siteData, setSiteData] = React.useState<Sites>(site());
  const [open, setOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [modified, setModified] = React.useState(false);
  const [position, setPostition] = useState<any>([]);

  const handleFormChange = (
    params: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let tmp_site_data = { ...siteData };
    tmp_site_data[params] = e.target.value;
    setSiteData(tmp_site_data);
  };

  useEffect(() => {
    setPostition([
      { lat: site().latitude, lng: site().longitude, name: site().name },
    ]);
  }, [site]);

  const dialog = () => {
    setOpen(true);
  };

  const handleChange = () => {
    setSuccess(false);
    setModified(!modified);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const save = () => {
    siteData.id &&
      SitesService.updateSiteSitesSiteIdPut(siteData?.id, siteData)
        .then(() => {
          setModified(!modified);
          setOpen(false);
          updateSites();
          setSuccess(true);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item lg={5} md={5} sm={12} xs={12} height={300}>
        <Map position={position} zoom={3} />
      </Grid>
      <Grid item lg={3} md={3} sm={12} xs={12}>
        <ThumbnailSitesComponent />
      </Grid>
      <Grid item lg={4} md={4} sm={12} xs={12}>
        <Stack direction="column" spacing={2}>
          <Grid item>
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
          </Grid>

          <form key={siteData.id}>
            <Grid container spacing={2}>
              {modified && (
                <Grid item lg={12} md={12} xs={12}>
                  <TextField
                    required
                    id="name"
                    name="name"
                    label={capitalize(t("main.name"))}
                    value={siteData.name}
                    onChange={(e) => handleFormChange("name", e)}
                    fullWidth
                    variant="filled"
                  />
                </Grid>
              )}
              <Grid item lg={6} md={6} xs={12}>
                <TextField
                  disabled={!modified}
                  label={capitalize(t("sites.longitude"))}
                  name="longitude"
                  inputProps={{ type: "number" }}
                  value={siteData.longitude}
                  fullWidth
                  variant="filled"
                  onChange={(e) => handleFormChange("longitude", e)}
                />
              </Grid>
              <Grid item lg={6} md={6} xs={12}>
                <TextField
                  disabled={!modified}
                  label={capitalize(t("sites.latitude"))}
                  name="latitude"
                  inputProps={{ type: "number" }}
                  value={siteData.latitude}
                  fullWidth
                  variant="filled"
                  onChange={(e) => handleFormChange("latitude", e)}
                />
              </Grid>
              <Grid item lg={12} md={12} xs={12}>
                <TextField
                  disabled={!modified}
                  label={capitalize(t("main.description"))}
                  id="description"
                  value={siteData.description}
                  fullWidth
                  multiline={true}
                  rows={4}
                  variant="filled"
                  onChange={(e) => handleFormChange("description", e)}
                />
              </Grid>
            </Grid>
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
                  {capitalize(t("sites.save_modifications_site"))}
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
      </Grid>
    </Grid>
  );
};
export default SiteForm;
