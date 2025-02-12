import React, { useState, FC } from "react";
import { Box, TextField, capitalize } from "@mui/material";
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        width: "100%",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
        <DateTimePicker
          label={capitalize(t("projects.start_date"))}
          value={dateRange.start_date}
          onChange={(date) => handleFilter("start_date", date)}
          inputFormat="yyyy/MM/dd HH:mm:ss"
          ampm={false}
          renderInput={(params) => (
            <TextField {...params} size="small" sx={{ width: "215px" }} />
          )}
        />

        <DateTimePicker
          label={capitalize(t("projects.end_date"))}
          value={dateRange.end_date}
          onChange={(date) => handleFilter("end_date", date)}
          inputFormat="yyyy/MM/dd HH:mm:ss"
          ampm={false}
          renderInput={(params) => (
            <TextField {...params} size="small" sx={{ width: "215px" }} />
          )}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DateRangeFilters;
