import Masonry from "@mui/lab/Masonry";
import { useMainContext } from "../contexts/mainContext";
import { Box, capitalize, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import GalleryItem from "./GalleryItem";
import MediaFilters from "./filters";
import { useEffect, useState } from "react";

export default function MediaGallery() {
  const { files } = useMainContext();
  const { t } = useTranslation();
  const [dateFilterValue, setDateFilterValue] = useState();

  console.log(files);
  const parseDate = (dateString) => (dateString ? new Date(dateString) : null);
  const handleFilterChange = (filters) => {
    setDateFilterValue(filters.date);
  };
  console.log(files);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 829,
        paddingTop: "2vh",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {capitalize(t("deployments.deploy_gallery"))}
      </Typography>
      <MediaFilters onFilterChange={handleFilterChange}></MediaFilters>
      <Masonry columns={6} spacing={2}>
        {files
          ?.filter((file) => {
            if (!dateFilterValue) {
              // Si aucun filtre de date, on retourne tous les fichiers
              return true;
            }
            const fileDate = parseDate(file.date);
            console.log("file", file);
            console.log("fileDate", fileDate);
            const filterDate = parseDate(dateFilterValue);

            // Vérifier si le fichier a une date et si elle correspond au filtre
            return (
              fileDate &&
              filterDate &&
              fileDate.toISOString().slice(0, 10) ===
                filterDate.toISOString().slice(0, 10)
            );
          })
          .map((item, index) => (
            <GalleryItem item={item} index={index} />
          ))}
      </Masonry>
    </Box>
  );
}
