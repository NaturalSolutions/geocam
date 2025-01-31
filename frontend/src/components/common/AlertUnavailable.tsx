import { useTranslation } from "react-i18next";
import { Alert, capitalize } from "@mui/material";



const AlertUnavailable = () => {
    const { t } = useTranslation();

    return(
        <Alert severity="info">
            { capitalize(t("main.unavailable")) }
        </Alert>
    )
};

export default AlertUnavailable;