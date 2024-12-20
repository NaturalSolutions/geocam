import { useContext, useState } from "react";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImportModale from "./importModale";
import { Link } from "react-router-dom";
import { Button, capitalize, Menu, MenuItem } from "@mui/material";
import LanguageSelector from "./languageSelector";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContextProvider";

const HeadBar = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openImport, setOpenImport] = useState(false);
  const open = Boolean(anchorEl);
  const { logout } = useContext(AuthContext);
  const openImportModale = () => {
    setOpenImport(true);
  };

  const closeImportModale = () => {
    setOpenImport(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  function toAccountKeycloack(): void {
    window.open('/auth/realms/geonature-annotation/account/#/personal-info', '_blank');
  }

  return (
    <AppBar position="static" sx={{ paddingTop: 2, paddingBottom: 1 }}>
      <Toolbar variant="dense">
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Link to={`/`} style={{ textDecoration: "none" }}>
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/assets/ecosecrets_logo_full_light.svg"
                }
                width="135"
                height="30"
              />
            </Link>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="secondary"
            href="https://natural-solutions.gitlab.io/geonature/annotation/user/start/"
            target="_blank"
            sx={{ mr: 4 }}
          >
            {`${capitalize(t("header.user_doc"))}`}
          </Button>
          <IconButton
            onClick={openImportModale}
            sx={{ mr: 4, display: { color: "white" } }}
          >
            <CloudUploadIcon />
          </IconButton>

          <ImportModale open={openImport} close={closeImportModale} />

          <ImportModale open={openImport} close={closeImportModale} />

          <LanguageSelector />

          <IconButton
            aria-label="menu"
            sx={{ mr: 2, display: { color: "white" } }}
            onClick={handleClick}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={toAccountKeycloack}>
              {capitalize(t("main.account"))}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              {capitalize(t("main.logout"))}
            </MenuItem>
          </Menu>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
export default HeadBar;
