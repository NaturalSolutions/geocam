import { Button, Stack, capitalize } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAnnotationContext } from "../../contexts/annotationContext";
import ButtonModify from "../common/buttonModify";
import ButtonValidate from "../common/buttonValidate";
import { useState } from "react";
import AlertDialog from "../common/dialogSaveOrQuit";
import { useMainContext } from "../../contexts/mainContext";
import { FilesService } from "../../client";

const AnnotationButtons = () => {
  const { t } = useTranslation();
  const { image } = useMainContext();
  const { saveandnext, handleAddObservation, annotationButtonDisabled } = useAnnotationContext();
  const [confirmationDelete, setConfirmationDelete] = useState<boolean>(false);

  const toggleModalDelete = () => {
    setConfirmationDelete(!confirmationDelete);
  };

  const handleClose = () => {
    setConfirmationDelete(false);
  };

  const deleteMedia = () => {
    FilesService.deleteDeploymentMediaFile(
      get_file_name(image().url),
      image().name
    ).then((res) => {});

    setConfirmationDelete(false);
  };

  const get_file_name = (fileName) => {
    // Cette expression régulière correspond à tous les types d'extensions d'images mentionnés
    const match = fileName.match(/([^\/]+\.(image|png|jpg|jpeg|gif|bmp))/i);
    return match ? match[1] : null;
  };
  return (
    <Stack direction="row" justifyContent="space-between" height="auto">
      <Stack direction="row" justifyContent="flex-start" spacing={2}>
        <ButtonModify
          disabled={ annotationButtonDisabled }
          content={capitalize(t("observations.new"))}
          edit={() => handleAddObservation()}
          startIcon="add"
        />
      </Stack>
      {/* <Stack justifyContent="flex-center">
        <Button variant="contained" color="error" onClick={toggleModalDelete}>
          {capitalize(t("main.delete"))}
        </Button>
        <AlertDialog
          openDialogModal={confirmationDelete}
          handleClose={handleClose}
          title={capitalize(t("annotations.delete"))}
          description={capitalize(t("annotations.delete_desc"))}
          quit={toggleModalDelete}
          save={deleteMedia}
        ></AlertDialog>
      </Stack> */}
      <Stack justifyContent="flex-end">
        <ButtonValidate
          disabled={ annotationButtonDisabled }
          content={capitalize(t("main.save_and_continue"))}
          validate={() => saveandnext()}
        />
      </Stack>
    </Stack>
  );
};

export default AnnotationButtons;
