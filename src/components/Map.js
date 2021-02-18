import React, { Component } from "react";
import Z from "zabbix-rpc";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

  gethosts = () => {
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

  componentDidMount = async () => {
    const auth = await this.zabbixLogin();
    this.setState({ auth: auth });

    const hosts = await this.gethosts();
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

    this.start();
  };

  start = () => {
    this.intervalId = setInterval(async () => {
      const hosts = await this.gethosts();
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

  render() {
    return (
      <React.Fragment>
        <MapContainer
          id="map"
          center={this.state.position}
          zoom={this.state.zoom}
          scrollWheelZoom={this.state.scrollWheelZoom}
          onClick={() => this.addMarker}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

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
        />
      </React.Fragment>
    );
  }
}

export default Map;
