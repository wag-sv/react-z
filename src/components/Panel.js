import React from "react";

class Panel extends React.Component {
  render() {
    return (
      <div id="panel">
        <form className="container">
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
        <div className="container">
          <div className="list">
            <ul className="ul-panel">
              {this.props.filteredHosts.map((host) => {
                return (
                  <li key={host.hostid} className="d-flex li-panel span-list">
                    <div className="size-60">
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
      </div>
    );
  }
}

export default Panel;
