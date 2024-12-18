import { styled } from "@mui/material";
import AnnotationForm from "./AnnotationForm";
import AnnotationSaveError from "./AnnotationSaveError";
import "../../css/annotation.css";
import AnnotationImage from "./AnnotationImage";
import GridSwitcher from "./GridSwitcher";

const LayoutAnnotationContainer = styled("div")({
  flexGrow: 1,
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  columnGap: "1rem",
  rowGap: "1rem",
  overflowY: "auto",
});

const LayoutAnnotationImage = styled("div")(({ theme }) => ({
  gridColumn: "1/8",
  height: "100%",
  overflow: "auto",
  [theme.breakpoints.down("md")]: {
    gridColumn: "1/13",
    gridRow: "1/5",
  },
}));

const LayoutAnnotationForm = styled("div")(({ theme }) => ({
  gridColumn: "8/13",
  [theme.breakpoints.down("md")]: {
    gridColumn: "1/13",
    gridRow: "5/9",
  },²²
  overflowY: "scroll",
}));

const AnnotationMain = () => {
  return (
    <LayoutAnnotationContainer className="page">
      <GridSwitcher />
      
      <LayoutAnnotationImage>
        <AnnotationImage />
      </LayoutAnnotationImage>

      <LayoutAnnotationForm className="annotations">
        <AnnotationForm />
      </LayoutAnnotationForm>

      <AnnotationSaveError />
    </LayoutAnnotationContainer>
  );
};
export default AnnotationMain;
