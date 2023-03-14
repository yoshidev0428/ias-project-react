import React from 'react';
import { Container } from 'react-bootstrap';

const TabItem = (props) => {
  return (
    <Container fluid={true} className="p-0">
      <div className="px-2 py-2 blue lighten-5">
        <span className="subtitle-1 font-weight-small primary--text font-16">
          {props.title}
        </span>
      </div>
      {props.children}
    </Container>
  );
};

export default TabItem;
