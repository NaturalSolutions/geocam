import { Box, Grid } from "@mui/material";

import InputTaxo from "./TaxonomicInputs";
import DateFilter from "../common/DateRangePicker";
import { useMainContext } from "../../contexts/mainContext";

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
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 3,
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{ width: "100%", flexWrap: "wrap" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DateFilter onFilters={updateFilters} />
        </Grid>
        <InputTaxo rank="classe" />
        <InputTaxo rank="order" />
        <InputTaxo rank="family" />
        <InputTaxo rank="genus" />
        <InputTaxo rank="species" />
      </Grid>
    </Box>
  );
};
export default MediaFilters;
