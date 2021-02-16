import React, { Component } from "react";
import "./App.css";
import Z from "zabbix-rpc";
import Map from "./components/Map";

class App extends Component {
  state = {
    auth: "",
    hosts: [],
    hostsCopy: [],
  };

  zabbix = new Z("177.53.204.46/zabbix/api_jsonrpc.php");

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
        output: ["host", "status"],
        selectInventory: ["location_lat", "location_lon"],
      },
      auth: this.state.auth,
      id: 2,
    });
  };

  componentDidMount = async () => {
    const auth = await this.zabbixLogin();
    this.setState({ auth: auth });

    const hosts = await this.gethosts();
    this.setState({ hosts: hosts, hostsCopy: hosts });
  };

  render() {
    console.log(this.state);
    return (
      <React.Fragment>
        <Map hosts={this.state.hosts} />
      </React.Fragment>
    );
  }
}

export default App;
