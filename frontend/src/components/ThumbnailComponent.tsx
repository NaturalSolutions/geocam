import { Grid, capitalize, Stack } from "@mui/material";
import DropzoneComponent from "./dropzoneComponent";
import ButtonsYesNo from "./common/buttonsYesNo";
import { useRef, Dispatch } from "react";
import { useTranslation } from "react-i18next";
import Thumbnail from "./Thumbnail";

const ThumbnailComponent: React.FC<{
  text: string;
  saveThumbnail: () => void;
  thumbnail: string | null;
  file: any;
  setFile: any;
  modifyState: boolean;
  setModifyState: Dispatch<React.SetStateAction<boolean>>;
}> = ({
  text,
  saveThumbnail,
  thumbnail,
  file,
  setFile,
  modifyState,
  setModifyState,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<any>(null);

  const loadFile = (f: any) => {
    setFile(f[0]);
  };
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Déclenche un clic sur l'input de type fichier
  };

  const dropZoneDisplayText = (text: string) => {
    if (!file) {
      return (
        <p>{`${capitalize(t("main.add_media"))} ${t("main.of")} ${t(
          `${text}s.${text}`
        )}`}</p>
      );
    } else {
      return <p>{file.name}</p>;
    }
  };

  const clear = () => {
    setFile("");
  };

  const loadNewFile = (f: any) => {
    setFile(f[0]);
    setModifyState(true);
  };

  const cancelModify = () => {
    fileInputRef.current.value = "";
    setModifyState(false);
  };

  return (
    <Stack direction="column">
      {!thumbnail ? (
        <>
          <DropzoneComponent
            onDrop={loadFile}
            sentence={dropZoneDisplayText}
            text={text}
          />
          <div style={{ marginTop: "25px" }}></div>
          <ButtonsYesNo
            onYes={saveThumbnail}
            onNo={clear}
            yesContent={capitalize(t("main.save"))}
            noContent={capitalize(t("main.cancel"))}
          />
        </>
      ) : (
        <>
          {" "}
          <Thumbnail
            item={thumbnail}
            handleButtonClick={handleButtonClick}
            modifyRef={fileInputRef}
            setFile={loadNewFile}
            modifyState={modifyState}
            cancelModify={cancelModify}
          />
        </>
      )}
    </Stack>
  );
};

export default ThumbnailComponent;
