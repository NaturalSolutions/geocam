import {
  Box,
  MenuItem,
  Stack,
  TextField,
  Typography,
  capitalize,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useEffect } from "react";
import { useMainContext } from "../../contexts/mainContext";
import { Deployments } from "../../client/models/Deployments";
import { Sites } from "../../client/models/Sites";
import { Devices } from "../../client/models/Devices";

const Filters = (props) => {
  const { t } = useTranslation();
  const {
    project,
    sites,
    currentProject,
    deployments,
    devices,
    projectSheetData,
  } = useMainContext();
  const [start_date, setStartDate] = useState<Date | null>(null);
  const [end_date, setEndDate] = useState<Date | null>(null);
  const [name, setName] = useState<Deployments | undefined>();
  const [sNname, setSName] = useState<Sites | undefined>();
  const [siteList, setSiteList] = useState<Sites[]>([]);
  const [deviceList, setDeviceList] = useState<Devices[]>([]);
  const [dName, setDName] = useState<Devices | undefined>();
  const options = project().deployments;

  const site = (item_site): Sites => {
    return sites.find((s) => s.id === item_site);
  };
  const device = (item_device): Sites => {
    return devices.find((s) => s.id === item_device);
  };

  const getLists = () => {
    props.list.forEach((item) => {
      const itemSite = site(item.site_id);
      console.log("item", item);
      console.log("site trouvé", itemSite);
      setSiteList((prevSiteList) => {
        // Vérifie si l'élément existe déjà
        if (!prevSiteList.some((site) => site.id === itemSite.id)) {
          return [...prevSiteList, itemSite];
        }
        return prevSiteList; // Ne modifie pas si le site est déjà présent
      });
    });
  };

  const getDevices = () => {
    props.list.forEach((item) => {
      const itemDevice = device(item.device_id);
      setDeviceList((prevSiteList) => {
        if (!prevSiteList.some((device) => device.id === itemDevice.id)) {
          return [...prevSiteList, itemDevice];
        }
        return prevSiteList; // Ne modifie pas si le site est déjà présent
      });
    });
  };

  useEffect(() => {
    getLists();
    setDeviceList([]);
    getDevices();
    console.log("hello");
  }, [currentProject, deployments, sites, devices, projectSheetData]);

  // Mettez à jour le parent lorsque les filtres changent
  const updateParentFilters = () => {
    props.onFilterChange({
      name: name?.id,
      start_date,
      end_date,
      site: sNname?.id,
      device: dName?.id,
    });
  };

  useEffect(() => {
    updateParentFilters();
  }, [start_date, end_date, name, dName, sNname]); // Mettre à jour à chaque changement

  console.log(sNname);

  return (
    <Box
      component="form"
      sx={{
        width: 1150,
        "& .MuiTextField-root": { m: 3 },
      }}
      noValidate
      autoComplete="off"
    >
      <div className="filter">
        <Autocomplete
          options={options} // Options à afficher dans la liste déroulante
          getOptionLabel={(option) => option.name} // Label à afficher dans la liste
          value={name} // Valeur sélectionnée
          onChange={(event, newValue) => setName(newValue!)} // Mise à jour de la valeur
          renderInput={(params) => (
            <TextField {...params} variant="outlined" fullWidth label="Nom" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparaison pour éviter des avertissements
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            inputFormat="dd/MM/yyyy"
            label={capitalize(t("projects.start_date"))}
            value={start_date}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant="outlined" />
            )}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            inputFormat="dd/MM/yyyy"
            label={capitalize(t("projects.end_date"))}
            value={end_date}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant="outlined" />
            )}
          />
        </LocalizationProvider>
        <Autocomplete
          options={siteList} // Options à afficher dans la liste déroulante
          getOptionLabel={(option) => option.name} // Label à afficher dans la liste
          value={sNname} // Valeur sélectionnée
          onChange={(event, newValue) => setSName(newValue!)} // Mise à jour de la valeur
          renderInput={(params) => (
            <TextField {...params} variant="outlined" fullWidth label="Site" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparaison pour éviter des avertissements
        />
        <Autocomplete
          options={deviceList} // Options à afficher dans la liste déroulante
          getOptionLabel={(option) => option.name} // Label à afficher dans la liste
          value={dName} // Valeur sélectionnée
          onChange={(event, newValue) => setDName(newValue!)} // Mise à jour de la valeur
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
              label="Dispositif"
            />
          )}
          isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparaison pour éviter des avertissements
        />
      </div>
    </Box>
  );
};
export default Filters;
