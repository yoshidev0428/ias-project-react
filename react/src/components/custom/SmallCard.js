import React from 'react'

import { Row, Col, Container } from 'react-bootstrap';
const SmallCard = (props) => {
    return (
     
        <div className="px-2 py-2">
            <h6 style={ props.child ? {fontWeight:'normal'} : {fontWeight:'bold'}}>
                {props.title}
            </h6>
            <div>
                <Row className="mt-1 d-flex justify-content-around">
                    {props.children}
                </Row>
            </div>
        </div>
      
    )
}

export default SmallCard; // connect wrapper function in use 

