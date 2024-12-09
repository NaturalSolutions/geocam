import { Stack, capitalize } from "@mui/material";
import ButtonsYesNo from "./common/buttonsYesNo";
import { useTranslation } from "react-i18next";
import ButtonValidate from "./common/buttonValidate";
import ButtonModify from "./common/buttonModify";

const ModifyThumbnail = ({
  handleButtonClick,
  setFile,
  saveNewThumbnail,
  modifyState,
  cancelModify,
  modifyRef,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <input
          ref={modifyRef}
          type="file"
          id="modify"
          name="modify"
          onChange={(e) => {
            if (!modifyState) {
              setFile(e.target.files);
            } else {
              cancelModify();
            }
          }}
          style={{ display: "none" }}
        />
        <label htmlFor="modify">
          <ButtonModify
            content={
              modifyState ? (
                <>{capitalize(t("main.cancel"))}</>
              ) : (
                <>{capitalize(t("main.modify"))}</>
              )
            }
            edit={handleButtonClick}
            variant={modifyState}
          />
        </label>
        <ButtonValidate
          content={capitalize(t("main.save"))}
          validate={saveNewThumbnail}
          disabled={!modifyState}
        />
      </Stack>
    </>
  );
};

export default ModifyThumbnail;
