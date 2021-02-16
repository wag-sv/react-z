import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Pane } from "react-leaflet";
import icon from "../img/marker.png";
import Search from "../components/Search";

function Map(props) {
  const myIcon = L.icon({
    iconUrl: icon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
  const center = [51.505, -0.09];
  const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
  ];

  const position = [-20.464615419359156, -54.61627937784175];

  return (
    <MapContainer id="map" center={position} zoom={12} scrollWheelZoom={true}>
      <Pane>
        <Search />
      </Pane>

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
