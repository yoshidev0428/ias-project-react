import React from 'react'

// import { Row, Col, Container } from 'react-bootstrap';
const SmallCard = (props) => {
    return (
        <div className="px-1 py-1 common-border">
            <h6 style={{ fontWeight: 'normal' }}>
                {props.title}
            </h6>
            {/* <h6 style={props.child ? { fontWeight: 'normal' } : { fontWeight: 'bold' }}>
                {props.title}
            </h6> */}
            <div>
                <div className="mt-1 d-flex justify-content-around">
                    {props.children}
                </div>
            </div>
        </div>

    )
}

export default SmallCard; // connect wrapper function in use 

