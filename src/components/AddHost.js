import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

class Panel extends Component {
  state = {
    host: "",
    ip: "",
    latitude: "",
    longitude: "",
  };

  zabbixApiUrl = "http://177.53.204.46/zabbix/api_jsonrpc.php";
  zabbixApiHeaders = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios
        .post(
          this.zabbixApiUrl,
          {
            jsonrpc: 2.0,
            method: "host.create",
            params: {
              host: this.state.host,
              interfaces: [
                {
                  type: 1,
                  main: 1,
                  useip: 1,
                  ip: this.state.ip,
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
                location_lat: this.state.latitude,
                location_lon: this.state.longitude,
              },
            },
            auth: this.props.auth,
            id: 5,
          },
          this.zabbixApiHeaders
        )
        .then(() => {
          this.setState({ host: "", ip: "", latitude: "", longitude: "" });
          alert("Requisição enviada!");
        });
    } catch (err) {
      alert("Houve algum erro!");
      console.error(err);
    }
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formBasicHost">
            <Form.Label>Nome do host</Form.Label>
            <Form.Control
              type="text"
              name="host"
              placeholder="Nome do host"
              onChange={this.handleChange}
              value={this.state.host}
            />
            <Form.Text className="text-muted">
              Não utilize caracteres especiais e acentuação.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicIP">
            <Form.Label>IP do host</Form.Label>
            <Form.Control
              type="text"
              name="ip"
              placeholder="xxx.xxx.xxx.xxx"
              onChange={this.handleChange}
              value={this.state.ip}
            />
          </Form.Group>

          <Form.Group controlId="formBasicLat">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              type="text"
              name="latitude"
              placeholder="-20.464615419359"
              onChange={this.handleChange}
              value={this.state.latitude}
              maxLength={16}
            />
          </Form.Group>

          <Form.Group controlId="formBasicLon">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="text"
              name="longitude"
              placeholder="-54.616279377841"
              onChange={this.handleChange}
              value={this.state.longitude}
              maxLength={16}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Adicionar
          </Button>
        </Form>
      </div>
    );
  }
}

export default Panel;
