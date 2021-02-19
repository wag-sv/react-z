import React from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
  useMapEvents,
} from "react-leaflet";
import Logo from "./Logo";
import Info from "./Info";
import green from "../img/greenMarker.png";
import grey from "../img/greyMarker.png";
import blue from "../img/blueMarker.png";
import yellow from "../img/yellowMarker.png";
import orange from "../img/orangeMarker.png";
import red from "../img/redMarker.png";
import black from "../img/blackMarker.png";

let dynamicMarker = L.marker();
let showDynamicMarker = false;

function Map(props) {
  const greenMarker = L.icon({
    iconUrl: green,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const greyMarker = L.icon({
    iconUrl: grey,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const blueMarker = L.icon({
    iconUrl: blue,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const yellowMarker = L.icon({
    iconUrl: yellow,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const orangeMarker = L.icon({
    iconUrl: orange,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const redMarker = L.icon({
    iconUrl: red,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const blackMarker = L.icon({
    iconUrl: black,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // let dynamicMarker = L.marker();
  // let showDynamicMarker = false;

  const AddDynamicMarker = () => {
    const map = useMapEvents({
      click: (event) => {
        if (!showDynamicMarker) {
          dynamicMarker = L.marker([event.latlng.lat, event.latlng.lng], {
            icon: greyMarker,
          })
            .addTo(map)
            .bindPopup(`${event.latlng.lat}, ${event.latlng.lng}`)
            .openPopup();
          showDynamicMarker = !showDynamicMarker;
        } else {
          map.removeLayer(dynamicMarker);
          showDynamicMarker = !showDynamicMarker;
        }
      },
    });
    return null;
  };

  return (
    <React.Fragment>
      <MapContainer
        id="map"
        center={[-20.467867574723673, -54.55604553222656]}
        zoom={12}
        scrollWheelZoom={true}
        doubleClickZoom={true}
      >
        <Logo />
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap P/B">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Marcadores">
            <LayerGroup>
              {props.filteredHosts.map((host) => {
                let iconColor = greyMarker;

                switch (host.problemSeverity) {
                  case "0":
                    iconColor = greyMarker;
                    break;
                  case "1":
                    iconColor = blueMarker;
                    break;
                  case "2":
                    iconColor = yellowMarker;
                    break;
                  case "3":
                    iconColor = orangeMarker;
                    break;
                  case "4":
                    iconColor = redMarker;
                    break;
                  case "5":
                    iconColor = blackMarker;
                    break;
                  default:
                    iconColor = greenMarker;
                }
                return (
                  <Marker
                    key={host.hostid}
                    position={[
                      host.inventory.location_lat,
                      host.inventory.location_lon,
                    ]}
                    icon={iconColor}
                  >
                    <Popup>
                      <Info host={host} />
                    </Popup>
                  </Marker>
                );
              })}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AddDynamicMarker />
      </MapContainer>
    </React.Fragment>
  );
}

export default Map;
