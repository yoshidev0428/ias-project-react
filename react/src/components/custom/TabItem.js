import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const TabItem = (props) => {
  const onRefresh = () => {
    console.log("click onRefresh");
  };
  const onHelp = () => {
    console.log("click onHelp");
  };

  return (
      <Container fluid={true} className="p-0">
        <div className="px-2 py-2 blue lighten-5">
          <span className="subtitle-1 font-weight-small primary--text" >
            {props.title}
          </span>
          <ButtonGroup>
            <IconButton style={props.buttons ? {display:"block"} : {display:"none"}} onClick={onRefresh}>
                <RefreshIcon className="primary--text"/>
            </IconButton>
            <IconButton style={props.buttons ? {display:"block"} : {display:"none"}} onClick={onHelp}>
              <HelpOutlineIcon className="primary--text"/>
            </IconButton>
          </ButtonGroup>
        </div>
        {props.children}        
      </Container>
  )
}


export default TabItem