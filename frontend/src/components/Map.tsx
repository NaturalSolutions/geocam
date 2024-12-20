import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Map = (props) => {
  const defaultCenter = { lat: 12, lng: 0, name: "Default" };
  return (
    <MapContainer
      center={props.position.length > 0 ? props.position[0] : defaultCenter}
      zoom={props.zoom}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {props.position[0] ? (
        props.position.map((pos, k) => (
          <Marker key={k} position={pos}>
            <Popup>{pos.name}</Popup>
          </Marker>
        ))
      ) : (
        <></>
      )}
    </MapContainer>
  );
};
export default Map;
