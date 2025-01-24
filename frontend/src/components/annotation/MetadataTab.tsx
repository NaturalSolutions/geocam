import { FC } from "react";
import TabPanel from "../tabPanel";
import { useAnnotationContext } from "../../contexts/annotationContext";
import NestedList from "../common/collapsableButton";
import AlertUnavailable from "../common/AlertUnavailable";

interface MetadataTabProps {
    valueTab: number;
    index: number;
};

const MetadataTab: FC<MetadataTabProps> = ({
    valueTab,
    index
}) => {
    const { selectedMedias } = useAnnotationContext();
    const { gridView } = useAnnotationContext();

    return(
        
        <TabPanel 
            valueTab={ valueTab } 
            index={ index }
        >
            { gridView ? 
                (selectedMedias.map((item) => (
                    <NestedList 
                        text={ item.name }
                    >
                        <AlertUnavailable/>
                    </NestedList>
            ))) :
                <AlertUnavailable/>
            }
        </TabPanel >
    )
};
export default MetadataTab;