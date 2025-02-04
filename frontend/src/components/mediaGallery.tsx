import Masonry from "@mui/lab/Masonry";
import { useMainContext } from "../contexts/mainContext";
import { Box, capitalize, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import GalleryItem from "./GalleryItem";
import MediaFilters from "./Filters";

export default function MediaGallery() {
  const { files } = useMainContext();
  const { t } = useTranslation();

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
      <MediaFilters />
      <Masonry columns={6} spacing={2}>
        {files.map((item, index) => (
          <GalleryItem item={item} index={index} />
        ))}
      </Masonry>
    </Box>
  );
}
