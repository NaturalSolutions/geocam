import { Box, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useEffect } from "react";

import InputTaxo from "./inputTaxo";

const MediaFilters = (props) => {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | null>(null);

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
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 3,
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          inputFormat="dd/MM/yyyy"
          label="Date du média"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          renderInput={(params) => (
            <TextField {...params} sx={{ width: "50%" }} variant="outlined" />
          )}
        />
      </LocalizationProvider>
      <InputTaxo rank="classe"></InputTaxo>
      <InputTaxo rank="order"></InputTaxo>
      <InputTaxo rank="family"></InputTaxo>
      <InputTaxo rank="genus"></InputTaxo>
      <InputTaxo rank="species"></InputTaxo>
    </Box>
  );
};
export default MediaFilters;
