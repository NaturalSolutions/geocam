import { capitalize, FormControlLabel, Switch, Stack } from "@mui/material";
import ObservationForm from "./ObservationForm";
import TabPanel from "../tabPanel";
import ButtonStatus from "../common/buttonStatus";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { useTranslation } from "react-i18next";
import { useAnnotationContext } from "../../contexts/annotationContext";
import { Annotation } from "../../client";
import { FC } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import frLocale from "date-fns/locale/fr";

interface ObservationTabProps {
  valueTab: number;
  index: number;
}

const ObservationTab: FC<ObservationTabProps> = ({ valueTab, index }) => {
  const { t } = useTranslation();
  const { date, setDate } = useAnnotationContext();
  const { observations, annotated, treated, checked, handleCheckChange } =
    useAnnotationContext();
  console.log(date, typeof date);

  return (
    <TabPanel valueTab={valueTab} index={index}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        style={{ marginBottom: "16px" }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
          <DateTimePicker
            label={capitalize(t("medias.date_time_field"))}
            value={date}
            onChange={(newValue) => setDate(newValue)}
            ampm={false}
            inputFormat="yyyy/MM/dd HH:mm:ss" // Ajout de l'affichage des secondes
            renderInput={(params) => (
              <TextField {...params} sx={{ width: "220px" }} />
            )}
          />
        </LocalizationProvider>
        {treated ? (
          <ButtonStatus
            icon={<CheckCircleRoundedIcon sx={{ color: "#4CAF50" }} />}
            title={capitalize(t("annotations.media_processed_manually"))}
            stylClassButton="valid"
          />
        ) : annotated ? (
          <ButtonStatus
            icon={<HelpRoundedIcon sx={{ color: "#FF9800" }} />}
            title={capitalize(t("observations.not_saved"))}
            stylClassButton="info"
          />
        ) : (
          <ButtonStatus
            icon={<HelpRoundedIcon sx={{ color: "#F44336" }} />}
            title={capitalize(t("annotations.media_not_processed"))}
            stylClassButton="warning"
          />
        )}

        <FormControlLabel
          id="switch-empty-control"
          control={
            <Switch
              id="switch-empty"
              checked={checked}
              onChange={handleCheckChange}
            />
          }
          label={capitalize(t("annotations.empty_media"))}
        />
      </Stack>

      {observations?.map((observation: Annotation, index: number) => (
        <ObservationForm
          key={observation.id}
          index={index + 1}
          observation={observation}
        />
      ))}
    </TabPanel>
  );
};
export default ObservationTab;
