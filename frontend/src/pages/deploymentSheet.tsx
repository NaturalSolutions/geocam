import MainLayout from "../layouts/mainLayout";
import HeadBar from "../components/HeadBar";
import Drawer from "../components/drawer";
import NavigationPath from "../components/navigationPath";
import DeploymentDetails from "../components/deploymentDetails";

function DeploymentSheet(props) {
  return (
    <div className="Main">
      <MainLayout
        Header={<HeadBar />}
        Side={<Drawer />}
        Navigation={<NavigationPath />}
        Main={<DeploymentDetails number={props.number} />}
      />
    </div>
  );
}

export default DeploymentSheet;
