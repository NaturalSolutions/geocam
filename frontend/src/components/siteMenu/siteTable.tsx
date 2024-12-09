import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Link, Paper, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow, Typography, capitalize } from "@mui/material";
import { useMainContext } from "../../contexts/mainContext";
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Map from "../Map";
import { Grid } from "@mui/material";
import ButtonValidate from "../common/buttonValidate";
import ButtonCancel from "../common/buttonCancel";
import ThumbnailComponent from "../ThumbnailDeviceComponent";
import { Sites, SitesService } from "../../client";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const SitesTable = () => {
  const { t } = useTranslation();

  const {sites, updateSites} = useMainContext();
  const [open, setOpen] = useState(false);
  const [position, setPostition] = useState<any>([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sitesLength, setSitesLength] = useState<number>(0)
  const [allSites, setAllSites] = useState<Sites[]>()
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {

    SitesService.getSitesNumber()
    .then((res) => {
      setSitesLength(res)
    })
  }, [])

  useEffect(() => {
    sites.map((data, k) => {
      setPostition(position => [...position, { lat: data.latitude, lng: data.longitude, name: data.name }])
    })
  }, [sites])
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    updateSites(page, event.target.value)
  };
  return (
    sites.length !== 0 ?
      <Stack
        spacing={2}
        justifyContent="center"
      >
        <Grid container justifyContent="center" alignItems='center'>
          <Grid container item justifyContent="center" height={400} width={1200} spacing={1} style={{ backgroundColor: "#D9D9D9" }}>
            {
              <Map position={position} zoom={2} /> 
            }
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} size="small" aria-label="customized table">
                <TableHead style={{backgroundColor: "#CCDFD9"}}>
                <TableRow>
                    <StyledTableCell align="center">{capitalize(t('main.name'))}</StyledTableCell>
                    <StyledTableCell align="center">{capitalize(t('sites.latitude'))}</StyledTableCell>
                    <StyledTableCell align="center">{capitalize(t('sites.longitude'))}</StyledTableCell>
                    <StyledTableCell align="center">{capitalize(t('main.delete'))}</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    { sites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <StyledTableRow key={row.name}>
                            <StyledTableCell align="center">
                              <Link component={RouterLink} to ={`/sites/${row.id}`}>
                                {row.name}
                              </Link>
                            </StyledTableCell>
                            <StyledTableCell align="center">{row.latitude}</StyledTableCell>
                            <StyledTableCell align="center">{row.longitude}</StyledTableCell>
                            <StyledTableCell align="center">
                              <IconButton onClick={handleClickOpen}>
                                  <ClearTwoToneIcon/>
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
        count={sites.length}
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
                {capitalize(t('sites.delete_site'))}
              </Typography>
            </DialogTitle>
              <IconButton onClick = {handleClose} >
                <ClearTwoToneIcon/>
              </IconButton>
            </Stack>
          <Divider />
          <DialogContent>
              <Typography>
                {capitalize(t('main.unavailable'))}
              </Typography>
          </DialogContent>
          <Divider />
          <DialogActions>
            <ButtonCancel content={ capitalize(t('main.no')) } cancel={ handleClose } />
            <ButtonValidate content={ capitalize(t('main.yes')) } validate={ () => { return } }/>
          </DialogActions>
      </Dialog>
    </Stack> : 
      <Alert severity="warning" >
        <AlertTitle>{capitalize(t('main.warning'))}</AlertTitle>
        {`${capitalize(t('main.zero'))} ${t('sites.site')}`}
      </Alert>
);
    };
export default SitesTable;