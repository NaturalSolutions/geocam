import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMainContext } from "../contexts/mainContext";
import { Box, capitalize, Tab, Tabs } from "@mui/material";
import DeploymentForm from "./deploymentForm";
import ImageList from "./imageList";
import TabPanel from "./tabPanel";
import PageHeadBar from "./common/PageHeadBar";

const DeploymentDetails = (props) => {
  const { t } = useTranslation();
  const { deploymentData } = useMainContext();
  const [tabValue, setTabValue] = useState(props.number);
  const handleTabValueChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <PageHeadBar data={deploymentData} type="deployment" />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabValueChange}
            aria-label="deployment tab"
            variant="fullWidth"
          >
            <Tab label={capitalize(t("main.details"))} />
            <Tab label={capitalize(t("main.medias"))} />
          </Tabs>
        </Box>

        <TabPanel valueTab={tabValue} index={0}>
          <DeploymentForm />
        </TabPanel>

        <TabPanel valueTab={tabValue} index={1}>
          <ImageList />
        </TabPanel>
      </Box>
    </>
  );
};
export default DeploymentDetails;
