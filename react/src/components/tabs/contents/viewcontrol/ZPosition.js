import * as React from 'react';
import Button from '@mui/material/Button';
import { Row, Col, Container } from 'react-bootstrap';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Icon from '@mdi/react';
import {
  mdiSwapVertical
} from '@mdi/js';

const Input = styled(TextField)`
  width: 50px;
`;

export default function ZPosition(props) {
  const [value, setValue] = React.useState(1);
  const SliderChange = (event, newValue) => {
    setValue(newValue);
  };
  const InputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };
  const Blur = () => {
    if (value < 1) {
      setValue(1);
    } else if (value > 50) {
      setValue(50);
    }
  };

  const on3DView = () => {
    console.log("on3DVIew clicked")
  }
  const onlyNumber = () => {
    console.log("onlyNumber clicked")
  }

  return (
    <>
      <div className="pa-1">
        <div className="d-flex justify-space-between align-center" >
          <h6>Z Position</h6>
          <div>
            <div className="spacer"></div>
            <Button className="pa-1" height="20px" variant="contained" color="primary" size="small" onClick={on3DView}>3-D View</Button>
          </div>
        </div>
        <Container fluid={true} className="px-0 py-0 mt-3">
          <Grid container spacing={1} alignItems="left">
            <Grid item>
              <Icon path={mdiSwapVertical} size={1} />
            </Grid>
            <Grid item xs>
              <Slider
                value={typeof value === 'number' ? value : 0}
                onChange={SliderChange}
                aria-labelledby="input-slider"
                min={1}
                max={50}
                size="small"
              />
            </Grid>
            <Grid item>
              <Input
                value={value}
                size="small"
                onChange={InputChange}
                variant="standard"
                style={{ BorderNone: true, border: 'none' }}
                onBlur={Blur}
                InputProps={{
                  step: 1,
                  min: 1,
                  max: 50,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                  disableUnderline: true,
                }}
              />
            </Grid>
          </Grid>
          <div className="d-flex justify-center pa-0 ma-0">
            <Col md={4}>
              <Input
                value={props.minV}
                size="small"
                onChange={InputChange}
                onBlur={Blur}
                className="pa-0 ma-0 no-underline"
                style={{ BorderNone: true }}
                onKeyDown={onlyNumber}
                variant="standard"
                InputProps={{
                  min: 0,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                  disableUnderline: true,
                  value: 1,
                }}
              />
            </Col>
            <Col md={4}>
              <Input
                value={props.maxV}
                size="small"
                onChange={InputChange}
                onBlur={Blur}
                className="pa-0 ma-0 no-underline"
                style={{ BorderNone: true }}
                variant="standard"
                onKeyDown={onlyNumber}
                InputProps={{
                  value: 50,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                  disableUnderline: true,
                }}
              />
            </Col>
          </div>
        </Container>
      </div>
    </>
  );
};
