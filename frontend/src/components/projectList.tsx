import { Grid, Typography, Stack, Box, TablePagination } from "@mui/material";
import { useMainContext } from "../contexts/mainContext";
import ProjectCard from "./projectCard";
import ProjectModal from "./projectModale";
import { useTranslation } from "react-i18next";
import { capitalize } from "@mui/material";
import { useEffect, useState } from "react";
import { ProjectsService } from "../client";

const ProjectList = () => {
  const { projectsStats, updateProjectsStats } = useMainContext();
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(0);
  const [projectLength, setProjectLength] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  useEffect(() => {
    const skip = page * rowsPerPage;
    updateProjectsStats(skip, rowsPerPage);
    ProjectsService.lengthProjectsProjectsLengthGet().then((res) => {
      setProjectLength(res);
    });
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    const skip = Math.abs(newPage * rowsPerPage);
    updateProjectsStats(skip, rowsPerPage);
  };

  return (
    <Grid container>
      <Box
        component="form"
        sx={{
          width: 2000,
          "& .MuiTextField-root": { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={5}
          >
            <Typography variant="h4" gutterBottom component="div">
              {capitalize(t("main.my_projects"))}
            </Typography>
            <ProjectModal page="home" />
          </Stack>
        </div>
      </Box>

      <Grid container direction="row" spacing={2}>
        {projectsStats &&
          projectsStats.map((s, k) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={k}>
              <ProjectCard selectedProject={s} />
            </Grid>
          ))}
      </Grid>
      {projectsStats && (
        <TablePagination
          rowsPerPageOptions={[4]}
          component="div"
          count={projectLength}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      )}
    </Grid>
  );
};
export default ProjectList;
