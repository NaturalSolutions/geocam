import {
  Alert,
  AlertTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  capitalize,
  Grid,
  TableSortLabel,
} from "@mui/material";
import { useMainContext } from "../../contexts/mainContext";
import ClearTwoToneIcon from "@mui/icons-material/ClearTwoTone";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DialogYesNo from "../common/dialogYesNo";
import Map from "../Map";

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

const DevicesTable = () => {
  const {
    deviceMenu,
    projects,
    sites,
    updateDeviceMenu,
    updateSites,
    devices,
    updateDevices,
  } = useMainContext();
  const [position, setPosition] = useState<any>([]);
  const [page, setPage] = useState<number>(0);

  const updateProjectSheetDataFromDevice = () => {
    if (deviceMenu && deviceMenu.length > 0) {
      deviceMenu.map((element) => {
        projects.forEach((project) => {
          project.deployments.map((elem) => {
            if (element.id == elem.device_id && element.status === "Déployé") {
              let pos = sites.find((site) => site.id == elem.site_id);

              setPosition((position) => [
                ...position,
                { lat: pos.latitude, lng: pos.longitude, name: pos.name },
              ]);
            }
          });
        });
      });
    }
  };
  useEffect(() => {
    const skip = Math.abs(page * rowsPerPage);
    updateSites();
    updateDeviceMenu(skip, rowsPerPage);
  }, []);

  useEffect(() => {
    updateProjectSheetDataFromDevice();
    console.log(deviceMenu);
  }, [deviceMenu, sites]);

  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    const skip = Math.abs(newPage * rowsPerPage);
    updateDeviceMenu(skip, rowsPerPage);
  };
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);

    updateDeviceMenu(page, event.target.value);
  };

  return deviceMenu.length !== 0 ? (
    <Stack spacing={2} justifyContent="center">
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          container
          item
          justifyContent="center"
          height={400}
          width={1000}
          spacing={1}
          style={{ backgroundColor: "#D9D9D9" }}
        >
          {<Map position={position} zoom={2} />}
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 500 }}
          size="small"
          aria-label="customized table"
        >
          <TableHead style={{ backgroundColor: "#CCDFD9" }}>
            <TableRow>
              <StyledTableCell align="center">
                {capitalize(t("main.name"))}
              </StyledTableCell>
              <StyledTableCell align="center">
                {capitalize(t("devices.status"))}
              </StyledTableCell>
              <StyledTableCell align="center">
                {capitalize(t("devices.nb_media"))}
              </StyledTableCell>
              <StyledTableCell align="center">
                {capitalize(t("main.remove"))}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceMenu
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell align="center">
                    <Link component={RouterLink} to={`/devices/${row.id}`}>
                      {row.name}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.status}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.nb_images}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton onClick={handleClickOpen}>
                      <ClearTwoToneIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={devices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={open} onClose={handleClose}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <DialogTitle>
            <Typography variant="h6">
              {capitalize(t("devices.delete"))}
            </Typography>
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <ClearTwoToneIcon />
          </IconButton>
        </Stack>
        <Divider />
        <DialogContent>
          <Typography>{capitalize(t("main.unavailable"))}</Typography>
        </DialogContent>
        <Divider />
        <DialogYesNo
          onYes={() => {
            return;
          }}
          onNo={handleClose}
        />
      </Dialog>
    </Stack>
  ) : (
    <Alert severity="warning">
      <AlertTitle>{capitalize(t("main.warning"))}</AlertTitle>
      {capitalize(t("devices.warning_msg"))}
    </Alert>
  );
};
export default DevicesTable;
