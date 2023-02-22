import React from 'react'

// import { Row, Col, Container } from 'react-bootstrap';
const SmallCard = (props) => {
    return (
      <div className="pt-2 pl-1" style={{ padding: "2px" }}>
        <div
          className={"mb-2"}
          style={{ fontWeight: "bold", fontSize: "14px" }}
        >
          {props.title}
        </div>
        <div>
          <div
            className="d-flex justify-content-around"
            style={{ paddingBottom: "4px" }}
          >
            {props.children}
          </div>
        </div>
      </div>
    );
}

export default SmallCard; // connect wrapper function in use 

