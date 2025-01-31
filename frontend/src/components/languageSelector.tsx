import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  FormControl,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const LanguageSelector: FC = () => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language.split('-')[0]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const hanleLangChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <FormControl
      sx={{
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "& .MuiSvgIcon-root": {
          fill: "#47B9B2",
        },
      }}
    >
      <Select
        value={language}
        displayEmpty
        label={language}
        onChange={(e) => hanleLangChange(e.target.value)}
        renderValue={(value) => (
          <Typography color="white" sx={{ mr: 2, textTransform: "uppercase" }}>
            {value}
          </Typography>
        )}
      >
        <MenuItem value="en">{t("languageSelector.en")}</MenuItem>
        <MenuItem value="fr">{t("languageSelector.fr")}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
