import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Map from "./components/Map";
const Z = require("zabbix-rpc");

class App extends Component {
  state = {
    auth: "",
    hosts: [],
    filteredHosts: [],
    input: "",
  };

  intervalId = 0;

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

  render() {
    return (
      <React.Fragment>
        <Map
          filteredHosts={this.state.filteredHosts}
          input={this.state.input}
          handleSearch={this.handleSearch}
          createHost={this.createHost}
        />
      </React.Fragment>
    );
  }
}

export default App;
