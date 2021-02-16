import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import icon from "../img/marker.png";

function Map(props) {
  const myIcon = L.icon({
    iconUrl: icon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const position = [-20.464615419359156, -54.61627937784175];

  return (
    <MapContainer
      className="map"
      center={position}
      zoom={12}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {props.hosts.map((host) => {
        return (
          <Marker
            key={host.hostid}
            position={[
              host.inventory.location_lat,
              host.inventory.location_lon,
            ]}
            icon={myIcon}
          >
            <Popup>{host.host}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default Map;
