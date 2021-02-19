import React from "react";
import Search from "./Search";
import AddHost from "./AddHost";

function Panel(props) {
  return (
    <div id="panel">
      {props.toggle ? (
        <AddHost auth={props.auth} />
      ) : (
        <Search
          input={props.input}
          handleSearch={props.handleSearch}
          filteredHosts={props.filteredHosts}
        />
      )}
    </div>
  );
}

export default Panel;
