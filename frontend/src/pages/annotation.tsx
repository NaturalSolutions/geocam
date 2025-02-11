import MainLayout from "../layouts/mainLayout";
import HeadBar from "../components/HeadBar";
import NavigationPath from "../components/navigationPath";
import AnnotationContextProvider from "../contexts/annotationContext";
import AnnotationMain from "../components/annotation/AnnotationMain";
import MediaFilters from "../components/deployments/Filters";

function Annotation() {
  return (
    <div className="Main">
      <MainLayout
        Header={<HeadBar />}
        Navigation={<NavigationPath />}
        Main={
          <AnnotationContextProvider>
            <MediaFilters />
            <AnnotationMain />
          </AnnotationContextProvider>
        }
      />
    </div>
  );
}

export default Annotation;
