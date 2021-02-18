import React from "react";
import "../App.css";

function Info(props) {
  return (
    <ul className="ul-popup">
      {/* SERVER NAME */}
      <li className='server_name'>{props.host.name}</li>

      {/* SERVER INFOS */}
      {/* IP */}
      <li>
        <span className='server_tittle_infos'>IP address:</span>
        <span className='server_text_infos'> {props.host.interfaces[0].ip}</span>
      </li>
      {/* LOCATION */}
      <li>
        <span className='server_tittle_infos'>Latitude:</span>
        <span className='server_text_infos'> {props.host.inventory.location_lat}</span>
      </li>
      <li>
        <span className='server_tittle_infos'>Longitude:</span>
        <span className='server_text_infos'> {props.host.inventory.location_lon}</span>
      </li>
      {/* DYNAMIC INFOS */}
      {props.host.items.map((item) => {
        return (
          <li key={item.itemid}>
            <span className='server_tittle_infos'>{item.name}:</span>
            <span className='server_text_infos'> {item.lastvalue}</span>
          </li>
        );
      })}

      {props.host.problems.map((problem) => {
        return <li key={problem.eventid}>
          <span className='server_err'>{problem.name}</span>
        </li>;
      })}
    </ul>
  );
}

export default Info;
