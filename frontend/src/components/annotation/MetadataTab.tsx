import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Alert, capitalize } from "@mui/material";
import TabPanel from "../tabPanel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import frLocale from "date-fns/locale/fr";
import { useAnnotationContext } from "../../contexts/annotationContext";

interface MetadataTabProps {
  valueTab: number;
  index: number;
}

const MetadataTab: FC<MetadataTabProps> = ({ valueTab, index }) => {
  const { t } = useTranslation();
  const { date, setDate } = useAnnotationContext();

  return (
    <TabPanel valueTab={valueTab} index={index}>
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
    </TabPanel>
  );
};
export default MetadataTab;
