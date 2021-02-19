import React from "react";
import Button from "react-bootstrap/Button";

function AddButton(props) {
  return (
    <div id="add-button">
      <Button variant="outline-primary" onClick={props.handleClick}>
        {props.toggle ? "Cancelar" : "Criar Host"}
      </Button>
    </div>
  );
}

export default AddButton;
