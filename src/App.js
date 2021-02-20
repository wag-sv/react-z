import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Map from "./components/Map";
import Panel from "./components/Panel";
import AddButton from "./components/AddButton";
import axios from "axios";

class App extends Component {
  state = {
    auth: "",
    hosts: [],
    filteredHosts: [],
    input: "",
    toggle: false,
  };

  intervalId = 0;

  zabbixApiUrl = "https://177.53.204.46/zabbix/api_jsonrpc.php";
  zabbixApiHeaders = {
    headers: {
      "Content-Type": "application/json-rpc",
    },
  };

  zabbixLogin = async () => {
    try {
      const response = await axios.post(
        this.zabbixApiUrl,
        JSON.stringify({
          jsonrpc: 2.0,
          method: "user.login",
          params: {
            user: "IronMonitor",
            password: "IronMonitor",
          },
          id: 1,
        }),
        this.zabbixApiHeaders
      );

      return response.data.result;
    } catch (err) {
      console.error(err);
    }
  };

  getHosts = async () => {
    try {
      const response = await axios.post(
        this.zabbixApiUrl,
        JSON.stringify({
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
        }),
        this.zabbixApiHeaders
      );

      return response.data.result;
    } catch (err) {
      console.error(err);
    }
  };

  getItems = async () => {
    try {
      const response = await axios.post(
        this.zabbixApiUrl,
        JSON.stringify({
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
        }),
        this.zabbixApiHeaders
      );
      return response.data.result;
    } catch (err) {
      console.error(err);
    }
  };

  getProblems = async () => {
    try {
      const response = await axios.post(
        this.zabbixApiUrl,
        JSON.stringify({
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
        }),
        this.zabbixApiHeaders
      );
      return response.data.result;
    } catch (err) {
      console.error(err);
    }
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

  handleClick = () => {
    const toggle = !this.state.toggle;
    this.setState({ toggle: toggle });
  };

  render() {
    return (
      <React.Fragment>
        <Map filteredHosts={this.state.filteredHosts} />
        <Panel
          filteredHosts={this.state.filteredHosts}
          input={this.state.input}
          handleSearch={this.handleSearch}
          toggle={this.state.toggle}
          auth={this.state.auth}
        />
        <AddButton handleClick={this.handleClick} toggle={this.state.toggle} />
      </React.Fragment>
    );
  }
}

export default App;
