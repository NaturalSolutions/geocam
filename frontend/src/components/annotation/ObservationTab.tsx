import { capitalize, FormControlLabel, Switch } from "@mui/material";
import ObservationForm from "./ObservationForm";
import TabPanel from "../tabPanel";
import ButtonStatus from "../common/buttonStatus";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { useTranslation } from "react-i18next";
import { useAnnotationContext } from "../../contexts/annotationContext";
import { Annotation } from "../../client";
import { FC } from "react";

interface ObservationTabProps {
  valueTab: number;
  index: number;
}

const ObservationTab: FC<ObservationTabProps> = ({ valueTab, index }) => {
  const { t } = useTranslation();
  const { date, setDate } = useAnnotationContext();
  const { annotations, annotated, treated, checked, handleCheckChange } =
    useAnnotationContext();

  return (
    <TabPanel valueTab={valueTab} index={index}>
      <span className="info-annotation-ctn">
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
      </span>

      {annotations?.map((annotations: Annotation, index: number) => (
        <ObservationForm
          key={annotations.id}
          index={index + 1}
          observation={annotations}
        />
      ))}
    </TabPanel>
  );
};
export default ObservationTab;
