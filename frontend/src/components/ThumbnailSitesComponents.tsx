import { useEffect, useState } from "react";
import ThumbnailComponent from "./ThumbnailComponent";
import { FilesService, Sites, SitesService } from "../client";
import { useMainContext } from "../contexts/mainContext";

const ThumbnailSitesComponent = () => {
  const { sites, site } = useMainContext();
  const [file, setFile] = useState<any>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [modifyState, setModifyState] = useState<boolean>(false);
  const [actualSite, setActualSite] = useState<Sites | null>(null);

  useEffect(() => {
    setActualSite(site());
    if (actualSite) {
      console.log(actualSite.id);
      SitesService.readSiteThumbnail(actualSite.id).then((res) => {
        setThumbnail(res[0].url);
        fetch(res[0].url).then((r) => {
          if (r.status != 200) {
            setThumbnail(null);
          }
        });
      });
    }
  }, [actualSite]);

  const saveThumbnail = async () => {
    if (actualSite) {
      FilesService.uploadSiteFile(actualSite.id, { file }).then((res) => {
        SitesService.readSiteThumbnail(actualSite.id).then((res) => {
          setThumbnail(res[0].url);
        });
      });
    }

    setModifyState(false);
  };

  return (
    <ThumbnailComponent
      text="site"
      saveThumbnail={saveThumbnail}
      file={file}
      setFile={setFile}
      thumbnail={thumbnail}
      modifyState={modifyState}
      setModifyState={setModifyState}
    />
  );
};

export default ThumbnailSitesComponent;
