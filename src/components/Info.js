import React from "react";

function Info(props) {
  return (
    <ul className="ul-popup">
      <li>{props.host.name}</li>
      <li>{props.host.interfaces[0].ip}</li>
      <li>Latitude: {props.host.inventory.location_lat}</li>
      <li>Longitude: {props.host.inventory.location_lon}</li>
      {props.host.items.map((item) => {
        return (
          <li key={item.itemid}>
            {item.name}: {item.lastvalue}
          </li>
        );
      })}

      {props.host.problems.map((problem) => {
        return <li key={problem.eventid}>{problem.name}</li>;
      })}
    </ul>
  );
}

export default Info;
