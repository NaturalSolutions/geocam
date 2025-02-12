import {
  Autocomplete,
  capitalize,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useMainContext } from "../../contexts/mainContext";

interface InputTaxoProps {
  rank: string;
}

const InputTaxo: FC<InputTaxoProps> = (props) => {
  const { t } = useTranslation();
  const { filters, setFilters } = useMainContext();

  interface Taxon {
    REGNE: string;
    PHYLUM: string;
    CLASSE: string;
    ORDRE: string;
    FAMILLE: string;
    SOUS_FAMILLE: string;
    TRIBU: string;
    GROUP1_INPN: string;
    GROUP2_INPN: string;
    GROUP3_INPN: string;
    CD_NOM: string;
    CD_TAXSUP: string;
    CD_SUP: string;
    CD_REF: string;
    RANG: string;
    LB_NOM: string;
    LB_AUTEUR: string;
    NOM_COMPLET: string;
    NOM_COMPLET_HTML: string;
    NOM_VALIDE: string;
    NOM_VERN?: string; // Cette propriété peut être absente
    NOM_VERN_ENG: string;
    HABITAT: string;
    FR: string;
    GF: string;
    MAR: string;
    GUA: string;
    SM: string;
    SB: string;
    SPM: string;
    MAY: string;
    EPA: string;
    REU: string;
    SA: string;
    TA: string;
    TAAF: string;
    PF: string;
    NC: string;
    WF: string;
    CLI: string;
    URL: string;
  }

  const [taxonList, setTaxonList] = useState<Taxon[]>([]);

  const [load, setLoad] = useState<boolean>(false);

  const [input, setInput] = useState<string>("");
  const sep = " - ";

  let rank = props.rank;

  async function getData(search_name: string) {
    let data: Taxon[] = [];

    if (rank === "species") {
      const speciesByLatinName = (
        await axios.get(`/taxapi/V1/taxons?RANG=ES&LB_NOM=${search_name}`)
      ).data;
      const speciesByVernName = (
        await axios.get(`/taxapi/V1/taxons?RANG=ES&NOM_VERN=${search_name}`)
      ).data;
      data = Array.from(new Set(speciesByLatinName.concat(speciesByVernName)));
    }
    if (rank === "genus") {
      data = (
        await axios.get(`/taxapi/V1/taxons?RANG=GN&LB_NOM=${search_name}`)
      ).data;
    }
    if (rank === "family") {
      data = (
        await axios.get(`/taxapi/V1/taxons?RANG=FM&LB_NOM=${search_name}`)
      ).data;
    }
    if (rank === "order") {
      data = (
        await axios.get(`/taxapi/V1/taxons?RANG=OR&LB_NOM=${search_name}`)
      ).data;
    }
    if (rank === "classe") {
      data = (
        await axios.get(`/taxapi/V1/taxons?RANG=CL&LB_NOM=${search_name}`)
      ).data;
    }

    setTaxonList(data);
    setLoad(false);
  }

  const onInputChange = (newInput) => {
    setInput(newInput);

    if (newInput.length >= 3) {
      setLoad(true);
      getData(newInput);
    }
  };

  const updateFilters = (key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  async function reset() {
    updateFilters(rank, "");
    setTaxonList([]);
  }

  async function onChange(newValue) {
    if (newValue.RANG === "ES") {
      updateFilters("classe", newValue.CLASSE);
      updateFilters("order", newValue.ORDRE);
      updateFilters("family", newValue.FAMILLE);
      updateFilters("genus", newValue.LB_NOM.split(" ")[0]);
      updateFilters("species", newValue.LB_NOM);
    }
    if (newValue.RANG === "GN") {
      updateFilters("classe", newValue.CLASSE);
      updateFilters("order", newValue.ORDRE);
      updateFilters("family", newValue.FAMILLE);
      updateFilters("genus", newValue.LB_NOM.split(" ")[0]);
      updateFilters("species", "");
    }
    if (newValue.RANG === "FM") {
      updateFilters("classe", newValue.CLASSE);
      updateFilters("order", newValue.ORDRE);
      updateFilters("family", newValue.FAMILLE);
      updateFilters("genus", "");
      updateFilters("species", "");
    }
    if (newValue.RANG === "OR") {
      updateFilters("classe", newValue.CLASSE);
      updateFilters("order", newValue.ORDRE);
      updateFilters("family", "");
      updateFilters("genus", "");
      updateFilters("species", "");
    }
    if (newValue.RANG === "CL") {
      updateFilters("classe", newValue.CLASSE);
      updateFilters("order", "");
      updateFilters("family", "");
      updateFilters("genus", "");
      updateFilters("species", "");
    }
    setTaxonList([]);
  }

  return (
    <Grid item xs={12} sm={6} md={2} lg={1.8}>
      <Autocomplete
        id={rank}
        freeSolo
        disableClearable
        loading={load}
        value={filters[rank] == undefined ? " " : filters[rank]}
        onChange={(_, newValue) => {
          onChange(newValue);
        }}
        inputValue={input}
        onInputChange={(_, newInput) => {
          onInputChange(newInput);
        }}
        getOptionLabel={(opt) =>
          typeof opt === "string"
            ? opt
            : opt.NOM_VERN
            ? `${opt.CD_NOM}${sep}${opt.LB_NOM} (${opt.NOM_VERN})`
            : `${opt.CD_NOM}${sep}${opt.LB_NOM}`
        }
        options={taxonList}
        noOptionsText="Pas d'options"
        renderInput={(params) => (
          <TextField
            {...params}
            label={capitalize(t(`taxon.${rank}`))}
            size="small"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: filters[rank] && (
                <IconButton
                  onClick={() => {
                    reset();
                  }}
                >
                  <HighlightOffIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
        )}
      />
    </Grid>
  );
};

export default InputTaxo;
