import React, { Component } from "react";
import Z from "zabbix-rpc";
import L, { icon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import Panel from "./Panel";
import Info from "./Info";
import greenMarker from "../img/greenMarker.png";
import greyMarker from "../img/greyMarker.png";
import blueMarker from "../img/blueMarker.png";
import yellowMarker from "../img/yellowMarker.png";
import orangeMarker from "../img/orangeMarker.png";
import redMarker from "../img/redMarker.png";
import blackMarker from "../img/blackMarker.png";

class Map extends Component {
  state = {
    position: [-20.464615419359156, -54.61627937784175],
    zoom: 12,
    scrollWheelZoom: true,
    dynamicMarkers: [],
    auth: "",
    hosts: [],
    filteredHosts: [],
    input: "",
  };

  intervalId = 0;

  greenMarker = L.icon({
    iconUrl: greenMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  greyMarker = L.icon({
    iconUrl: greyMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  blueMarker = L.icon({
    iconUrl: blueMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  yellowMarker = L.icon({
    iconUrl: yellowMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  orangeMarker = L.icon({
    iconUrl: orangeMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  redMarker = L.icon({
    iconUrl: redMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  blackMarker = L.icon({
    iconUrl: blackMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // addMarker = (event) => {
  //   let markers = this.dynamicMarkers;
  //   markers.push(event);
  //   this.setState({ dynamicMarkers: markers });
  // };

  zabbix = new Z("177.53.204.46/zabbix");

  zabbixLogin = () => {
    return this.zabbix.call({
      jsonrpc: 2.0,
      method: "user.login",
      params: {
        user: "IronMonitor",
        password: "IronMonitor",
      },
      id: 1,
    });
  };

  getHosts = () => {
    return this.zabbix.call({
      jsonrpc: 2.0,
      method: "host.get",
      params: {
        output: ["host", "name", "status"],
        selectInventory: ["location_lat", "location_lon"],
        selectInterfaces: ["interfaceid", "ip"],
        selectTriggers: [],
      },
      auth: this.state.auth,
      id: 2,
    });
  };

  getItems = () => {
    return this.zabbix.call({
      jsonrpc: 2.0,
      method: "item.get",
      params: {
        filter: { key_: ["icmpping", "icmppingloss", "icmppingsec"] },
        output: [
          "key_",
          "hostid",
          "name",
          "lastclock",
          "lastns",
          "lastvalue",
          "prevvalue",
        ],
        monitored: true,
      },
      auth: this.state.auth,
      id: 3,
    });
  };

  getProblems = () => {
    return this.zabbix.call({
      jsonrpc: 2.0,
      method: "problem.get",
      params: {
        output: [
          "eventid",
          "objectid",
          "clock",
          "ns",
          "name",
          "severity",
          "opdata",
        ],
      },
      auth: this.state.auth,
      id: 4,
    });
  };

  handleData = async () => {
    const hosts = await this.getHosts();
    const items = await this.getItems();
    const problems = await this.getProblems();

    hosts.forEach((host) => {
      host.items = [];
      host.problems = [];
      host.problemSeverity = -1;
      items.forEach((item) => {
        if (item.hostid === host.hostid) {
          host.items.push(item);
        }
      });

      problems.forEach((problem) => {
        host.triggers.forEach((trigger) => {
          if (trigger.triggerid === problem.objectid) {
            host.problems.push(problem);
            if (problem.severity > host.problemSeverity) {
              host.problemSeverity = problem.severity;
            }
          }
        });
      });
    });

    this.setState({ hosts: hosts, filteredHosts: hosts });
  };

  componentDidMount = async () => {
    const auth = await this.zabbixLogin();
    this.setState({ auth: auth });

    this.start();
  };

  start = () => {
    this.handleData();

    this.intervalId = setInterval(() => {
      this.handleData();
    }, 7000);
  };

  filterHost = (input) => {
    const filtered = this.state.hosts.filter(
      (host) =>
        host.name.toLowerCase().includes(input.toLowerCase()) ||
        host.interfaces[0].ip.includes(input)
    );
    this.setState({ filteredHosts: filtered });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.input !== prevState.input) {
      this.filterHost(this.state.input);
    }
  }

  handleSearch = (event) => {
    const { value } = event.target;

    clearInterval(this.intervalId);

    if (value === "") {
      this.start();
    }

    this.setState({ input: value });
  };

  createHost = () => {
    this.zabbix.call({
      jsonrpc: "2.0",
      method: "host.create",
      params: {
        host: "Iron server",
        interfaces: [
          {
            type: 1,
            main: 1,
            useip: 1,
            ip: "186.192.90.12",
            dns: "",
            port: "10050",
          },
        ],
        groups: [
          {
            groupid: "17",
          },
        ],
        templates: [
          {
            templateid: "10186",
          },
        ],
        inventory_mode: 0,
        inventory: {
          location_lat: "-20.497727116736",
          location_lon: "-54.614331421148",
        },
      },
      auth: this.state.auth,
      id: 5,
    });
  };

  // handleClick = (e) => {
  //   const { lat, lng } = e.latlng;
  //   console.log(lat, lng);
  // };

  render() {
    console.log(this.state.hosts);
    const MyComponent = () => {
      const map = useMapEvents({
        click: (event) => {
          L.marker(
            [event.latlng.lat, event.latlng.lng],
            {
              icon: this.greenMarker,
            },
            { draggable: true, title: "Hover Text", opacity: 0.5 }
          )
            .addTo(map)
            .bindPopup(`${event.latlng.lat}, ${event.latlng.lng}`)
            .openPopup();
        },
      });
      return null;
    };
    return (
      <React.Fragment>
        <MapContainer
          id="map"
          center={this.state.position}
          zoom={this.state.zoom}
          scrollWheelZoom={this.state.scrollWheelZoom}
          doubleClickZoom={true}
          onclick={this.handleClick}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MyComponent />
          {this.state.filteredHosts.map((host) => {
            let iconColor = this.greyMarker;

            switch (host.problemSeverity) {
              case "0":
                iconColor = this.greyMarker;
                break;
              case "1":
                iconColor = this.blueMarker;
                break;
              case "2":
                iconColor = this.yellowMarker;
                break;
              case "3":
                iconColor = this.orangeMarker;
                break;
              case "4":
                iconColor = this.redMarker;
                break;
              case "5":
                iconColor = this.blackMarker;
                break;
              default:
                iconColor = this.greenMarker;
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
        </MapContainer>
        <Panel
          filteredHosts={this.state.filteredHosts}
          input={this.input}
          handleSearch={this.handleSearch}
          createHost={this.createHost}
        />
      </React.Fragment>
    );
  }
}

export default Map;
