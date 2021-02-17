import React, { Component } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import icon from "../img/marker.png";

class Map extends Component {
  state = {
    position: [-20.464615419359156, -54.61627937784175],
    zoom: 12,
    scrollWheelZoom: true,
  };

  myIcon = L.icon({
    iconUrl: icon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  render() {
    return (
      <MapContainer
        id="map"
        center={this.state.position}
        zoom={this.state.zoom}
        scrollWheelZoom={this.state.scrollWheelZoom}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {this.props.hosts.map((host) => {
          return (
            <Marker
              key={host.hostid}
              position={[
                host.inventory.location_lat,
                host.inventory.location_lon,
              ]}
              icon={this.myIcon}
            >
              <Popup>
                <ul className="ul-popup">
                  <li>{host.name}</li>
                  <li>{host.interfaces[0].ip}</li>
                  <li>Latitude: {host.inventory.location_lat}</li>
                  <li>Longitude: {host.inventory.location_lon}</li>
                  {host.items.map((item) => {
                    return (
                      <li key={item.itemid}>
                        {item.name}: {item.lastvalue}
                      </li>
                    );
                  })}

                  {host.problems.map((problem) => {
                    return <li key={problem.eventid}>{problem.name}</li>;
                  })}
                </ul>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    );
  }
}

export default Map;
