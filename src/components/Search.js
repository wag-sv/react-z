import React from "react";
import Form from "react-bootstrap/Form";
import trash from "../img/trash.png";

function Search(props) {
  return (
    <React.Fragment>
      <Form>
        <Form.Group controlId="formBasicSearch">
          <Form.Control
            type="text"
            placeholder="Pesquisar Host"
            onChange={props.handleSearch}
            value={props.input}
          />
        </Form.Group>
      </Form>

      <div className="list-box">
        <div className="list overflow-auto" id="style-7">
          <ul className="ul-panel">
            {props.filteredHosts.map((host) => {
              return (
                <li
                  key={host.hostid}
                  className="server_card d-flex flex-row li-panel span-list justify-content-between mb-1 align-items-center"
                >
                  <div className="ml-2 justify-content-start text-truncate">
                    <p className="text-truncate server_list_tittle">
                      {host.name}
                    </p>
                  </div>
                  <div className="d-flex justify-content-end mx-2">
                    <p className="server_list_ip">{host.interfaces[0].ip}</p>
                    {/* <div className="li-remove">
                      <img
                        src={trash}
                        alt="A trash icon."
                        className="li-icon"
                      />
                    </div> */}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Search;
