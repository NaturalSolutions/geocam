import { IconButton, ImageList, ImageListItem } from "@mui/material";
import { useMainContext } from "../../contexts/mainContext";
import { useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AnnotationImageDisplay = () => {

  const { files } = useMainContext();
  
  const [selectedImageList, setSelectedImageList] = useState<any[]>([]);
  const handleImageClick = (imageId) => {
    if (!selectedImageList.includes(imageId)) {
      setSelectedImageList((currentImageList) => 
        [...currentImageList, imageId]);
    }
    if (selectedImageList.includes(imageId)) {
      setSelectedImageList((currentImageList) =>
        currentImageList.filter((id) => id !== imageId));
    }
    console.log("Liste Images sélectionnées : ", selectedImageList)
  };
  
  const displayMedia = (item) => {
    if (item.extension.includes("image")) {
      return (
        <img
          src={`${item.url}`}
          alt={item.name}
          loading="lazy"
          // onClick={() => displayMedia(item.id)}
          // style={thumbnailStyle}
        />
      );
    } else {
      return (
        <video 
          // style={thumbnailStyle} 
          // onClick={() => displayMedia(item.id)}
        >
          <source
            src={`${item.url}#t=1`} // t value can be ajusted to display a specific start time as video thumbnail
            type="video/mp4"
          />
          {item.name}
        </video>
      );
    }
  };

  return (
    <ImageList
      variant="quilted"
      cols={4}
      rowHeight={121}
    >
      {files?.map((item, index) => (
        <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
            <img
              srcSet={`${item.url}`}
              src={`${item.url}`}
              alt={item.name}
              loading="lazy"
              // onMouseover={() => displayMedia(item.id)}
              onClick={() => handleImageClick(item.id)}
            />
            {selectedImageList.includes(item.id) && (
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <CheckCircleIcon />
              </IconButton>
            )}
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default AnnotationImageDisplay;
