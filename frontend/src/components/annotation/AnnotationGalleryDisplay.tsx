import { IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { useMainContext } from "../../contexts/mainContext";
import { useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ButtonGoAnnotation from "../common/ButtonGoAnnotation";
import { useAnnotationContext } from "../../contexts/annotationContext";

const AnnotationGalleryDisplay = () => {

  const { files } = useMainContext();
  const { selectedMedias, setSelectedMedias } = useAnnotationContext();
  
  const [hoveredMedia, setHoveredMedia] = useState<string>();
  
  const handleImageClick = (item) => {
    if (!selectedMedias.includes(item.id)) {
      setSelectedMedias((currentSelectedMedias: any[]) => 
        [...currentSelectedMedias, item]);
    };
    if (selectedMedias.includes(item)) {
      setSelectedMedias((currentSelectedMedias: any[]) =>
        currentSelectedMedias.filter((currentSelectedMedia) => currentSelectedMedia.id !== item.id));
    };
  };
  
  const handleImageMouseOver = (id: string) => {
    setHoveredMedia(id);
  };

  const handleImageMouseOut = () => {
    setHoveredMedia(undefined);
  };

  const displayMedia = (item) => {
    if (item.extension.includes("image")) {
      return (
        <img
          srcSet={`${item.url}`}
          src={`${item.url}`}
          alt={item.name}
          loading="lazy"
          onMouseOver={ () => handleImageMouseOver(item.id) }
          onMouseOut={ () => handleImageMouseOut() }
          onClick={ () => handleImageClick(item) }
        />
      );
    } else {
      return (
        <video 
          onMouseOver={ () => handleImageMouseOver(item.id) }
          onMouseOut={ () => handleImageMouseOut() }
          onClick={ () => handleImageClick(item) }
        >
          <source
            src={`${item.url}#t=1`} // t value can be ajusted to display a specific start time as video thumbnail
            type="video/mp4"
          />
          { item.name }
        </video>
      );
    }
  };

  const displayAnnotation = (data) => {
    return data
      .map((item) => {
        let taxonomicInfo = item.species || item.genus || item.order || item.family || item.classe;
        return `${taxonomicInfo} (${item.number})`;
      })
      .join(', ');
  };

  return (
    <ImageList
      cols={4}
      gap={1}
    >
      {files?.map((item, index) => (
        <ImageListItem 
          key={item.img} 
          cols={item.cols || 1} 
          rows={item.rows || 1}
        > 
          { displayMedia(item) }
          {selectedMedias.includes(item) && (
            <IconButton
              sx={{
                position: 'absolute',
                top: 3,
                left: 3,
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <CheckCircleIcon />
            </IconButton>
          )}
          {hoveredMedia === item.id && (
            <ImageListItemBar
              subtitle={ displayAnnotation(item.annotations) }
              sx={{
                "& .MuiImageListItemBar-subtitle": { fontSize: "0.7rem", whiteSpace: "normal", wordWrap: "break-word" }
              }}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${ item.name }`}
                >
                  <ButtonGoAnnotation name={ item.name } id={ item.id }/>
                </IconButton>
              }
              onMouseOver={ (e) => handleImageMouseOver(item.id) }
              onMouseOut={ () => handleImageMouseOut() }
            />
          )}
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default AnnotationGalleryDisplay;
