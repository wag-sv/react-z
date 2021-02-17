import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Z from "zabbix-rpc";
import Map from "./components/Map";
import Search from "./components/Search";

class App extends Component {
  state = {
    auth: "",
    hosts: [],
    problems: [],
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
      items.forEach((item) => {
        if (item.hostid === host.hostid) {
          host.items.push(item);
        }
      });

      problems.forEach((problem) => {
        host.triggers.forEach((trigger) => {
          if (trigger.triggerid === problem.objectid) {
            host.problems.push(problem);
          }
        });
      });
    });

    this.setState({ hosts: hosts, problems: problems });

    this.start();
  };

  start = () => {
    setInterval(async () => {
      const hosts = await this.gethosts();
      const items = await this.getItems();
      const problems = await this.getProblems();

      hosts.forEach((host) => {
        host.items = [];
        host.problems = [];
        items.forEach((item) => {
          if (item.hostid === host.hostid) {
            host.items.push(item);
          }
        });

        problems.forEach((problem) => {
          host.triggers.forEach((trigger) => {
            if (trigger.triggerid === problem.objectid) {
              host.problems.push(problem);
            }
          });
        });
      });

      this.setState({ hosts: hosts, problems: problems });
    }, 10000);
  };

  render() {
    return (
      <React.Fragment>
        <Map hosts={this.state.hosts} />
        <Search />
      </React.Fragment>
    );
  }
}

export default App;
