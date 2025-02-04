import React, { useState, FC } from "react";
import { Grid, TextField, capitalize } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import frLocale from "date-fns/locale/fr";
import { useTranslation } from "react-i18next";

interface DateRange {
  start_date: Date | null;
  end_date: Date | null;
}

interface DateRangeFilterProps {
  onFilters: (dateRange: DateRange) => void;
}
const DateRangeFilters: FC<DateRangeFilterProps> = ({ onFilters }) => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange>({
    start_date: null,
    end_date: null,
  });

  const handleFilter = (key, value) => {
    setDateRange({ ...dateRange, [key]: value });
    onFilters(dateRange);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
        <Grid item>
          <DateTimePicker
            label={capitalize(t("projects.start_date"))}
            value={dateRange.start_date}
            onChange={(date) => handleFilter("start_date", date)}
            inputFormat="yyyy/MM/dd HH:mm:ss"
            ampm={false}
            renderInput={(params) => (
              <TextField {...params} sx={{ width: "220px" }} />
            )}
          />
        </Grid>
        <Grid item>
          <DateTimePicker
            label={capitalize(t("projects.end_date"))}
            value={dateRange.end_date}
            onChange={(date) => handleFilter("end_date", date)}
            inputFormat="yyyy/MM/dd HH:mm:ss"
            ampm={false}
            renderInput={(params) => (
              <TextField {...params} sx={{ width: "220px" }} />
            )}
          />
        </Grid>
      </LocalizationProvider>
    </Grid>
  );
};

export default DateRangeFilters;
