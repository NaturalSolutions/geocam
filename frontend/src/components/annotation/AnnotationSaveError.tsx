import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, capitalize } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAnnotationContext } from "../../contexts/annotationContext";
import ButtonCancel from "../common/buttonCancel";

const AnnotationSaveError = () => {
    const { t } = useTranslation();
    const { openSaveErrorDialog, handleCloseSaveErrorDialog } = useAnnotationContext();


    return (
        <Dialog open={openSaveErrorDialog.state}>
            <DialogTitle>
                { capitalize(t("annotations.cannot_save")) }
            </DialogTitle>

            <DialogContent>
                <Typography component={"span"} >
                    { openSaveErrorDialog.text }
                </Typography>
            </DialogContent>

            <DialogActions>
                <ButtonCancel 
                    content={ capitalize(t("annotations.fix_my_data")) } 
                    cancel={ handleCloseSaveErrorDialog } 
                />
            </DialogActions>
        </Dialog>
    )
};

export default AnnotationSaveError;