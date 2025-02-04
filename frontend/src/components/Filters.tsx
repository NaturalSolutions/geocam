import { Box } from "@mui/material";

import InputTaxo from "./TaxonomicInputs";
import DateFilter from "./common/DateRangePicker";
import { useMainContext } from "../contexts/mainContext";

const MediaFilters = () => {
  const { setFilters } = useMainContext();

  const updateFilters = (dateRange: {
    start_date: Date | null;
    end_date: Date | null;
  }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...dateRange,
    }));
  };

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
      <DateFilter onFilters={updateFilters}></DateFilter>
      <InputTaxo rank="classe"></InputTaxo>
      <InputTaxo rank="order"></InputTaxo>
      <InputTaxo rank="family"></InputTaxo>
      <InputTaxo rank="genus"></InputTaxo>
      <InputTaxo rank="species"></InputTaxo>
    </Box>
  );
};
export default MediaFilters;
