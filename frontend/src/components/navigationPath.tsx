import { Breadcrumbs, capitalize, Stack } from "@mui/material";
import { useMainContext } from "../contexts/mainContext";
import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BreadcrumbElement from "./breadcrumbElement";
import { useTranslation } from "react-i18next";

const NavigationPath: FC<{}> = () => {
  const {
    project,
    projects,
    deploymentData,
    currentImage,
    device,
    devices,
    site,
    sites,
    setCurrentImage,
    setCurrentProject,
    setDeploymentData,
    setCurrentDevice,
    setCurrentSite,
    files,
    image,
    updateProjects
  } = useMainContext();
  useEffect(() => {
    updateProjects()
  }, [])


  const { t } = useTranslation();
  const location = useLocation();

  const homeBreadcrumb = (isActive: boolean = false) => {
    return (
      !isActive && (
        <BreadcrumbElement
          key="home"
          current_option={capitalize(t("main.home"))}
          link="/"
          isActive={isActive}
        />
      )
    );
  };

  const projectBreadcrumb = (isActive: boolean = false) => {
    
    return (
     
    <BreadcrumbElement
        key="project"
        current_option={project().name}
        link={`/project/${project().id}`}
        parentlink="/project"
        options={projects}
        isActive={isActive}
      />
    );
  };

  const deploymentBreadcrumb = (isActive: boolean = false) => {
    return (
      <BreadcrumbElement
        key="deployment"
        current_option={deploymentData.name}
        link={`/project/${project().id}/deployment/${
          deploymentData.id
        }/details`}
        parentlink={`/project/${project().id}/deployment`}
        options={projects.find((p) => p.id === project().id).deployments}
        linkSuffix="details"
        isActive={isActive}
      />
    );
  };

  const imageBreadcrumb = (isActive: boolean = false) => {
    return (
      <BreadcrumbElement
        key="image"
        current_option={image()?.name}
        link={`/project/${project().id}/deployment/${
          deploymentData.id
        }/details/${currentImage}`}
        parentlink={`/project/${project().id}/deployment/${
          deploymentData.id
        }/details`}
        options={files}
        isActive={isActive}
      />
    );
  };

  const devicesBreadcrumb = (isActive: boolean = false) => {
    return (
      <BreadcrumbElement
        key="devices"
        current_option={capitalize(t("devices.devices"))}
        link="/devices/"
        isActive={isActive}
      />
    );
  };

  const deviceBreadcrumb = (isActive: boolean = false) => {
    return (
      <BreadcrumbElement
        key="device"
        current_option={device().name}
        link={`/devices/${device().id}`}
        parentlink={`/devices`}
        options={devices}
        isActive={isActive}
      />
    );
  };
  const sitesBreadcrumb = (isActive: boolean = false) => {
    return (
      <BreadcrumbElement
        key="sites"
        current_option={capitalize(t("sites.sites"))}
        link="/sites/"
        isActive={isActive}
      />
    );
  };
  const siteBreadcrumb = (isActive: boolean = false) => {
    return (
      <BreadcrumbElement
        key="site"
        current_option={site().name}
        link={`/sites/${site().id}`}
        parentlink={`/sites`}
        options={sites}
        isActive={isActive}
      />
    );
  };

  // workeround for breadcrumbs issue

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrentImage(null);
      setCurrentProject(null);
      setDeploymentData(null);
      setCurrentDevice(null);
      setCurrentSite(null);
    }
  }, [location]);

  const breadcrumbs = () => {
    if (currentImage && project() && deploymentData) {
      return [
        homeBreadcrumb(),
        projectBreadcrumb(),
        deploymentBreadcrumb(),
        imageBreadcrumb(true),
      ];
    } else if (deploymentData) {
      return [
        homeBreadcrumb(),
        projectBreadcrumb(),
        deploymentBreadcrumb(true),
      ];
    } else if (project()) {
      return [homeBreadcrumb(), projectBreadcrumb(true)];
    } else if (device()) {
      return [homeBreadcrumb(), devicesBreadcrumb(), deviceBreadcrumb(true)];
    } else if (site()) {
      return [homeBreadcrumb(), sitesBreadcrumb(), siteBreadcrumb(true)];
    } else if (location.pathname == "/devices/") {
      return [homeBreadcrumb(), devicesBreadcrumb(true)];
    } else if (location.pathname == "/sites/") {
      return [homeBreadcrumb(), sitesBreadcrumb(true)];
    } else if (location.pathname == "/") {
      return [homeBreadcrumb(true)];
    } else {
      return [homeBreadcrumb(true)];
    }
  };

  return (
    <div>
      <Stack direction="row" alignItems="center" spacing={0} height="100%">
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs()}
        </Breadcrumbs>
      </Stack>
    </div>
  );
};
export default NavigationPath;
