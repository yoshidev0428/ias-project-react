import React, { useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';

import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';

import { useFlagsStore } from '@/state';
import Draggable from 'react-draggable';
import Paper from '@mui/material/Paper';

const Input = styled(MuiInput)`
  width: 42px;
`;

const Filter2dDialog = () => {
  const DialogFilter2dflag = useFlagsStore((store) => store.DialogFilter2dflag);

  const close = () => {
    useFlagsStore.setState({ DialogFilter2dflag: false });
  };

  const action = () => {
    console.log('flag Status---> Action');
  };

  //slider changing
  const [value, setValue] = useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  //item select
  const [selected, setSelected] = React.useState([]);

  const onChange = (selected) => {
    setSelected(selected);
  };
  const options = [
    {
      label: 'Emphasis',
      options: [
        { value: 'Low pass', label: 'Low pass' },
        { value: 'High pass', label: 'High pass' },
        { value: 'Sharpening', label: 'Sharpening' },
        { value: 'Median', label: 'Median' },
        { value: 'Gauss', label: 'Gauss' },
        { value: 'High gauss', label: 'High gauss' },
        { value: 'Local equalization', label: 'Local equalization' },
        { value: 'Flattening', label: 'Flattening' },
        { value: 'Rank', label: 'Rank' },
        { value: 'Stain removal', label: 'Stain removal' },
        { value: 'Sigma', label: 'Sigma' },
      ],
    },
    {
      label: 'Edge',
      options: [
        { value: 'Sobel', label: 'Sobel' },
        { value: 'Roberts', label: 'Roberts' },
        { value: 'Laplacian', label: 'Laplacian' },
        { value: 'Sobel Phase', label: 'Sobel Phase' },
        { value: 'Horizontal Edge', label: 'Horizontal Edge' },
        { value: 'Canny', label: 'Canny' },
        { value: 'Gabor', label: 'Gabor' },
      ],
    },
    {
      label: 'Morphological',
      options: [
        { value: 'Cutting', label: 'Cutting' },
        { value: 'Connection', label: 'Connection' },
        { value: 'Contraction', label: 'Contraction' },
      ],
    },
    {
      label: 'Kernel',
      options: [
        { value: 'Convolution', label: 'Convolution' },
        { value: 'Morphological', label: 'Morphological' },
        { value: 'Sculpture', label: 'Sculpture' },
        { value: 'Background', label: 'Background' },
      ],
    },
    {
      label: 'Learge',
      options: [
        { value: 'Low Pass', label: 'Low Pass' },
        { value: 'High Pass', label: 'High Pass' },
        { value: 'Band Pass', label: 'Band Pass' },
        { value: 'Edge+', label: 'Edge+' },
        { value: 'Edge-', label: 'Edge-' },
      ],
    },
  ];

  function PaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

  return (
    <>
      <Dialog
        open={DialogFilter2dflag}
        onClose={close}
        minWidth={'610'}
        PaperComponent={PaperComponent}
        hideBackdrop={true}
        onBackdropClick="false"
        disableScrollLock
        aria-labelledby="draggable-dialog-title"
      >
        <div className="d-flex border-bottom">
          <DialogTitle>2D Filter</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div
          className="d-flex justify-content-around p-3"
          style={{ width: 600, overflowY: 'auto', overflowX: 'hidden' }}
        >
          <div style={{ width: '100%', height: '100%' }}>
            <Row>
              <Col>
                <p className="px-3">Candidate</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <DualListBox
                  className="min_height-250"
                  options={options}
                  selected={selected}
                  onChange={onChange}
                  icons={{
                    moveLeft: <KeyboardArrowLeftIcon />,
                    moveAllLeft: <DeleteIcon />,
                    moveRight: <KeyboardArrowRightIcon />,
                    moveAllRight: <KeyboardDoubleArrowRightIcon />,
                  }}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={6}></Col>
              <Col xs={6}>
                <Row>
                  <Col>
                    <div className="border mb-3 p-3">
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <label>Strength</label>
                        </Grid>
                        <Grid item xs>
                          <Slider
                            value={typeof value === 'number' ? value : 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                          />
                        </Grid>
                        <Grid item>
                          <Input
                            value={value}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                              step: 10,
                              min: 0,
                              max: 100,
                              type: 'number',
                              'aria-labelledby': 'input-slider',
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <label>Number of Times</label>
                        </Grid>
                        <Grid item>
                          <Input
                            size="small"
                            inputProps={{
                              min: 0,
                              max: 10,
                              type: 'number',
                              'aria-labelledby': 'input-slider',
                            }}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
            <Button
              className=""
              variant="contained"
              color="dark"
              size="medium"
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              className=""
              variant="contained"
              color="success"
              size="medium"
              onClick={action}
            >
              Set
            </Button>
            <Button
              className=""
              variant="contained"
              color="success"
              size="medium"
              onClick={action}
            >
              Set All
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
export default Filter2dDialog;
