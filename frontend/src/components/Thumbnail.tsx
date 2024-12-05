import { CSSProperties } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton } from "@mui/material";

const Thumbnail = ({
  item,
  handleButtonClick,
  modifyRef,
  modifyState,
  setFile,
  cancelModify,
}) => {
  const thumbnailStyle: CSSProperties = {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 400,
    width: 400,
    objectFit: "cover",
    marginBottom: "20px",
  };
  // const displayImage = (item) => {
  //   return (
  //     <img
  //       src={`${item}`}
  //       alt="Miniature"
  //       loading="lazy"
  //       onClick={() => displayMedia(item.id)}
  //       style={thumbnailStyle}
  //     />
  //   );
  // };
  return (
    // Début modification de l'image
    // <Box
    //   sx={{
    //     position: "relative",
    //     display: "inline-block",
    //     borderRadius: "5px",
    //     marginRight: "25px",
    //   }}
    // >
    //   <input
    //     ref={modifyRef}
    //     type="file"
    //     id="modify"
    //     name="modify"
    //     onChange={async (e) => {
    //       setFile(e.target.files);
    //     }}
    //     style={{ display: "none" }}
    //   />

    //   {displayImage(item)}
    //   {modifyState && (
    //     <label htmlFor="modify">
    //       <IconButton
    //         sx={{
    //           position: "absolute",
    //           top: 0,
    //           left: 0,
    //           margin: "8px",
    //           backgroundColor: "white",
    //           borderRadius: "5px",
    //           padding: "4px",
    //         }}
    //         onClick={handleButtonClick}
    //       >
    //         <EditIcon />
    //       </IconButton>
    //     </label>
    //   )}
    // </Box>
    <img
      src={`${item}`}
      alt=" Erreur avec le fichier! Il ne semble pas être au bon format"
      loading="lazy"
      style={thumbnailStyle}
    />
  );
};

export default Thumbnail;
