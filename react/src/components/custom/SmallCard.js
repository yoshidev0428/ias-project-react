import React from 'react'

// import { Row, Col, Container } from 'react-bootstrap';
const SmallCard = (props) => {
    return (
        <div className="common-border" style={{padding: "2px"}}>
            <h6 style={{ fontWeight: 'normal' }}>
                {props.title}
            </h6>
            {/* <h6 style={props.child ? { fontWeight: 'normal' } : { fontWeight: 'bold' }}>
                {props.title}
            </h6> */}
            <div>
                <div className="d-flex justify-content-around">
                    {props.children}
                </div>
            </div>
        </div>

    )
}

export default SmallCard; // connect wrapper function in use 

