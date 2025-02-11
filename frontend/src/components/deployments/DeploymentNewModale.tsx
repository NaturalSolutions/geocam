import { Dialog, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import DeploymentForm from "./deploymentForm";
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import { useTranslation } from "react-i18next";
import { capitalize } from "@mui/material";

const DeploymentNewModale = (props) => {
    const { t } = useTranslation();

    return(
        <Dialog 
            open={ props.openNewDeployment } 
            onClose={ props.handleCloseNewDeployment }
        >
            <DialogTitle 
                variant="h6" 
                id="scroll-dialog-title"
            >
                <Stack 
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {`${capitalize(t('main.new'))} ${t('deployments.deployment')}`}
                    <IconButton onClick = { props.handleCloseNewDeployment } >
                        <ClearTwoToneIcon/>
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent 
                dividers={ true }
                id="scroll-dialog-description"
            >
                <DeploymentForm 
                    isNewDeployment={ true } 
                    handleCloseNewDeployment={ props.handleCloseNewDeployment } 
                />
            </DialogContent>
        </Dialog>
    )
};
export default DeploymentNewModale;