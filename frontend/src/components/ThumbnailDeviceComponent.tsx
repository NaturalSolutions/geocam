import { useState, useEffect } from "react";
import { Devices, DevicesService, FilesService } from "../client";
import { useMainContext } from "../contexts/mainContext";

import ThumbnailComponent from "./ThumbnailComponent";

const ThumbnailDeviceComponent = () => {
  const { device, updateDeviceMenu } = useMainContext();
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [modifyState, setModifyState] = useState<boolean>(false);
  const [deviceData, setDeviceData] = useState<Devices>(device());
  const [file, setFile] = useState<any>(null);

  useEffect(() => {
    setDeviceData(device());
    if (deviceData) {
      DevicesService.readDeviceThumbnail(deviceData.id).then((res) => {
        setThumbnail(res[0].url);
        fetch(res[0].url).then((r) => {
          if (r.status != 200) {
            setThumbnail(null);
          }
        });
      });
    }
  }, [deviceData]);

  const saveThumbnail = async () => {
    if (deviceData) {
      FilesService.uploadDeviceFile(deviceData.id, { file }).then((res) => {
        DevicesService.readDeviceThumbnail(deviceData.id).then((res) => {
          setThumbnail(res[0].url);
        });
      });
    }

    setModifyState(false);
  };

  const clear = () => {
    setFile("");
  };

  const get_file_name = (fileName) => {
    const match = fileName.match(/([^\/]+\.(png|jpg|jpeg|gif|bmp))/i);
    return match ? match[1] : null;
  };

  return (
    <ThumbnailComponent
      text="device"
      saveThumbnail={saveThumbnail}
      thumbnail={thumbnail}
      file={file}
      setFile={setFile}
      modifyState={modifyState}
      setModifyState={setModifyState}
    />
  );
};

export default ThumbnailDeviceComponent;
