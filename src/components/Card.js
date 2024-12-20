import React from "react";
import "./Card.css";

const Card = ({ children, header, style }) => {
  return (
    <div className="cardcomp" style={style}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
