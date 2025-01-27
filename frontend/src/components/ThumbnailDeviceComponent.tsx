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
      deviceData.id &&
        DevicesService.fetchDeviceThumbnailDevicesFetchDeviceThumbnailDeviceIdGet(
          deviceData.id
        ).then((res) => {
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
    deviceData.id &&
      FilesService.uploadFilesFilesUploadDeviceDeviceIdPost(deviceData.id, {
        file,
      }).then((res) => {
        deviceData.id &&
          DevicesService.fetchDeviceThumbnailDevicesFetchDeviceThumbnailDeviceIdGet(
            deviceData.id
          ).then((res) => {
            setThumbnail(res[0].url);
          });
      });

    setModifyState(false);
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
