import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useFlagsStore } from '@/state';
import { useState } from 'react';
import { Row, Col, Form, Button, Image } from 'react-bootstrap';
// import CustomButton from "../../../custom/Custom
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import Icon from '@mdi/react';
import {
  mdiArrowLeftBold,
  mdiArrowRightBold,
  mdiAlphaX,
  mdiHomeOutline,
} from '@mdi/js';

const VisualToolbar = () => {
  const [imgURL, setURL] = useState('http://');

  const changeURL = (e) => {
    setURL(e.target.value);
  };
  const next = () => {
    console.log('onClick->next');
  };
  const before = () => {
    console.log('onClick->before');
  };
  const exit = () => {
    console.log('onClick->exit');
  };
  const home = () => {
    console.log('onClick->home');
  };
  return (
    <Row style={{ width: '100%' }}>
      <Col xs={4}>
        <div className="d-flex justify-content-between visual-toolbar-buttons">
          <button
            className="btn btn-sm pt-0 pb-0"
            style={{ height: '35px' }}
            onClick={before}
          >
            <Icon
              size={1}
              horizontal
              vertical
              rotate={180}
              color="#000000"
              path={mdiArrowLeftBold}
            ></Icon>
          </button>
          <button
            className="btn btn-sm pt-0 pb-0"
            style={{ height: '35px' }}
            onClick={next}
          >
            <Icon
              size={1}
              horizontal
              vertical
              rotate={180}
              color="#000000"
              path={mdiArrowRightBold}
            ></Icon>
          </button>
          <button
            className="btn btn-sm pt-0 pb-0"
            style={{ height: '35px' }}
            onClick={exit}
          >
            <Icon
              size={1}
              horizontal
              vertical
              rotate={180}
              color="#000000"
              path={mdiAlphaX}
            ></Icon>
          </button>
          <button
            className="btn btn-sm pt-0 pb-0"
            style={{ height: '35px' }}
            onClick={home}
          >
            <Icon
              size={1}
              horizontal
              vertical
              rotate={180}
              color="#000000"
              path={mdiHomeOutline}
            ></Icon>
          </button>
        </div>
      </Col>
      <Col xs={6}>
        <input
          className="form-control"
          placeholder="http://"
          type="text"
          value={imgURL}
          onChange={changeURL}
        />
      </Col>
      <Col xs={2}>
        <Paper component="form" sx={{ display: 'flex', alignItems: 'center' }}>
          <InputBase
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton sx={{ padding: 0 }} type="button" aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Col>
    </Row>
  );
};

export default VisualToolbar;
