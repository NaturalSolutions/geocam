import { Box, TextField, capitalize, Autocomplete } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useEffect } from "react";
import { Sites } from "../client/models/Sites";

const MediaFilters = (props) => {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | null>(null);
  const [classe, setClasse] = useState<(typeof options)[0] | null>();
  const [order, setOrder] = useState<(typeof options)[0] | null>();
  const [family, setFamily] = useState<(typeof options)[0] | null>();
  const [genus, setGenus] = useState<(typeof options)[0] | null>();
  const [species, setSpecies] = useState<(typeof options)[0] | null>();

  const options = [
    {
      id: "7b3a7d54-84fb-43d8-8f36-15380c9bcd41",
      sex: "",
      genus: "Felis",
      order: "Carnivora",
      classe: "Mammalia",
      family: "Felidae",
      number: 1,
      species: "Felis yagouaroundi",
      comments: "",
      behaviour: "",
      life_stage: "",
      id_annotation: "443820",
      biological_state: "",
    },
    {
      id: "6432547f-237b-45ea-82d2-9f897d39153c",
      sex: "",
      genus: "Hibana",
      order: "Araneae",
      classe: "Arachnida",
      family: "Anyphaenidae",
      number: 1,
      species: "Hibana tenuis",
      comments: "",
      behaviour: "",
      life_stage: "",
      id_annotation: "950807",
      biological_state: "",
    },
  ];

  const updateParentFilters = () => {
    props.onFilterChange({
      date: date,
    });
  };

  useEffect(() => {
    updateParentFilters();
  }, [date]);

  return (
    <Box
      component="form"
      sx={{
        width: 1150,
        "& .MuiTextField-root": { m: 2 },
      }}
      noValidate
      autoComplete="off"
    >
      <div className="filter">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            inputFormat="dd/MM/yyyy"
            label="Date du média"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
          />
        </LocalizationProvider>
        <Autocomplete
          options={options} // Options à afficher dans la liste déroulante
          getOptionLabel={(option) => option.classe} // Label à afficher dans la liste
          value={classe} // Valeur sélectionnée
          onChange={(event, newValue) => setClasse(newValue!)} // Mise à jour de la valeur
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
              label="Classe"
            />
          )}
          isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparaison pour éviter des avertissements
        />

        <Autocomplete
          options={options} // Options à afficher dans la liste déroulante
          getOptionLabel={(option) => option.order} // Label à afficher dans la liste
          value={order} // Valeur sélectionnée
          onChange={(event, newValue) => setOrder(newValue!)} // Mise à jour de la valeur
          renderInput={(params) => (
            <TextField {...params} variant="outlined" fullWidth label="Ordre" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparaison pour éviter des avertissements
        />
        <Autocomplete
          options={options} // Options à afficher dans la liste déroulante
          getOptionLabel={(option) => option.family} // Label à afficher dans la liste
          value={family} // Valeur sélectionnée
          onChange={(event, newValue) => setFamily(newValue!)} // Mise à jour de la valeur
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
              label="Family"
            />
          )}
          isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparaison pour éviter des avertissements
        />
        <Autocomplete
          options={options} // Options à afficher dans la liste déroulante
          getOptionLabel={(option) => option.genus} // Label à afficher dans la liste
          value={genus} // Valeur sélectionnée
          onChange={(event, newValue) => setGenus(newValue!)} // Mise à jour de la valeur
          renderInput={(params) => (
            <TextField {...params} variant="outlined" fullWidth label="Genus" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparaison pour éviter des avertissements
        />
        <Autocomplete
          options={options} // Options à afficher dans la liste déroulante
          getOptionLabel={(option) => option.species} // Label à afficher dans la liste
          value={species} // Valeur sélectionnée
          onChange={(event, newValue) => setSpecies(newValue!)} // Mise à jour de la valeur
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
              label="Species"
            />
          )}
          isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparaison pour éviter des avertissements
        />
      </div>
    </Box>
  );
};
export default MediaFilters;
