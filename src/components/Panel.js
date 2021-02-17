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
          <ul className="ul-panel">
            {this.props.filteredHosts.map((host) => {
              return (
                <li key={host.hostid}>
                  <strong>{host.name}</strong> | {host.interfaces[0].ip}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Panel;
