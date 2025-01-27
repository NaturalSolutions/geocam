import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Stack, Typography, capitalize } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  tableCellClasses,
  TableHead,
  TableRow,
} from "@mui/material";
import { useMainContext } from "../../contexts/mainContext";
import DeviceForm from "./deviceForm";
import DeviceModal from "../deviceMenu/deviceModal";
import DeviceData from "./deviceData";
import { useTranslation } from "react-i18next";
import { DeploymentsService } from "../../client";
import { FilesService } from "../../client";
import AlertUnavailable from "../common/AlertUnavailable";
import { DeploymentForDeviceSheet } from "../../types/Deployments";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const DeviceSheet = () => {
  const { device, setCurrentDevice, projects, sites } = useMainContext();
  const { t } = useTranslation();
  const [historyDeployment, setHistoryDeployment] = useState<
    DeploymentForDeviceSheet[]
  >([]);
  let params = useParams();
  useEffect(() => {
    (async () => {
      setCurrentDevice(Number(params.deviceId));
      if (params.deviceId !== undefined) {
        DeploymentsService.readDeviceDeploymentsDeploymentsDeviceDeviceIdGet(
          parseInt(params.deviceId)
        ).then((response) => {
          // liste des déploiements pour un certain dispositif

          let finalRes: DeploymentForDeviceSheet[] = [];

          projects.forEach((project) => {
            project.deployments.forEach((deployment) => {
              response.forEach(async (res) => {
                if (res.project_id === deployment.project_id) {
                  // on cherche le deploiement du dispositif dans la liste de tous les deploiements
                  const nb_medias =
                  await FilesService.getLengthDeploymentFilesFilesDeploymentIdLengthGet(
                    res.id
                  );
                  // const nb_medias =
                  //   await FilesService.readLengthDeploymentsFilesById(res.id);
                  let proj_name = project.name;
                  let siteName = sites.find(
                    (site) => site.id === res.site_id
                  ).name;

                  if (!finalRes.some((elem) => elem.id === res.id)) {
                    const tempRes: DeploymentForDeviceSheet = {
                      name: res.name,
                      start_date: res.start_date,
                      end_date: res.end_date,
                      site_id: res.site_id,
                      device_id: res.device_id,
                      id: res.id,
                      site_name: siteName,
                      project_name: proj_name,
                      nb_images: nb_medias,
                    };

                    finalRes.push(tempRes);
                    console.log(tempRes);
                    setHistoryDeployment(
                      [...historyDeployment].concat(finalRes)
                    );
                  }
                }
              });
            });
          });
        });
      }
    })();
  }, [projects]);

  return device() !== undefined ? (
    <Stack direction="column" spacing={3}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="transparent">
          <Toolbar variant="dense">
            <Grid container>
              <Typography variant="h6" component="div" sx={{ mr: 1 }}>
                {device().name}
              </Typography>
            </Grid>
            <DeviceModal />
            <IconButton
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { color: "#2FA37C" } }}
            >
              <CloudDownloadIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>

      <Stack spacing={2} justifyContent="center">
        <DeviceData />
        <Typography variant="h4" color="#000000" component="div">
          {capitalize(t("devices.sheet"))}
        </Typography>
      </Stack>

      <DeviceForm />
      <Stack spacing={2} justifyContent="center">
        <Typography variant="h4" color="#000000" component="div">
          {capitalize(t("devices.history"))}
        </Typography>
        {historyDeployment.length === 0 ? (
          // <Alert severity="info">
          //   {capitalize(t("devices.historic_message"))}
          // </Alert>
          <AlertUnavailable />
        ) : (
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 500 }}
              size="small"
              aria-label="customized table"
            >
              <TableHead style={{ backgroundColor: "#CCDFD9" }}>
                <TableRow>
                  <StyledTableCell align="center">
                    {capitalize(t("main.project_name"))}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {capitalize(t("projects.site_name"))}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {capitalize(t("main.deployment_name"))}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {capitalize(t("devices.nb_media"))}
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyDeployment.map((item) => {
                  console.log(item);
                  return (
                    <StyledTableRow key={item.id}>
                      <StyledTableCell align="center">
                        {item.project_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.site_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.nb_images}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Stack>
  ) : (
    <div>{capitalize(t("devices.warning"))}</div>
  );
};
export default DeviceSheet;
