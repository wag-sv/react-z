import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class Panel extends React.Component {
  render() {
    return (
      <div id="panel">
        <div className="container div-h60vh">
          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Pesquisar
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <form>
                    <div className="form-group">
                      <input
                        type="text"
                        className="input form-control"
                        onChange={this.props.handleSearch}
                        placeholder="Pesquisar"
                        value={this.props.input}
                      />
                    </div>
                  </form>
                  <div>
                    <div className="list">
                      <ul className="ul-panel">
                        {this.props.filteredHosts.map((host) => {
                          return (
                            <li
                              key={host.hostid}
                              className="d-flex li-panel span-list"
                            >
                              <div className="div-w60pc">
                                <span>
                                  <strong>{host.name}</strong>
                                </span>
                              </div>
                              <div>{host.interfaces[0].ip}</div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1">
                Adicionar Host
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <Form>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" />
                      <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Example select</Form.Label>
                      <Form.Control as="select">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                      <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Form>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
      </div>
    );
  }
}

export default Panel;
