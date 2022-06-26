import React, {useState, useEffect} from 'react';
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
import store from "../../../../reducers";
import {connect} from 'react-redux';

const Input = styled(TextField)`
  width: 50px;
`;

const mapStateToProps = state => ({
    viewConfigsObj: state.vessel.viewConfigsObj,
})

const ZPosition = (props) => {
    const [value, setValue] = React.useState(1);
    const [zPosConfig, setZPosConfig] = useState(props.viewConfigsObj? props.viewConfigsObj.z: {});
    const [minSlider, setMinSlider] = useState(-50);
    const [maxSlider, setMaxSlider] = useState(50);
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

    useEffect(() => {
        if(props.viewConfigsObj){
            setZPosConfig(props.viewConfigsObj.z);
        }
    },[props.viewConfigsObj])

    useEffect(() => {
        if(zPosConfig){
            setMinSlider(zPosConfig.min);
            setMaxSlider(zPosConfig.max);
            setValue(zPosConfig.min);
        }
    },[zPosConfig])

    return (
        <>
            <div className="common-border">
                <div className="d-flex justify-space-between align-center" >
                    <h6>Z Position</h6>
                    <div>
                        <div className="spacer"></div>
                        <Button className="py-0" variant="contained" color="primary" size="small" onClick={on3DView}>3-D View</Button>
                    </div>
                </div>
                <Container fluid={true} className="px-0 py-0">
                    <Grid container spacing={1} alignItems="left">
                        <Grid item>
                            <Icon path={mdiSwapVertical} size={1} />
                        </Grid>
                        <Grid item xs>
                            <Slider
                                value={typeof value === 'number' ? value : 0}
                                onChange={SliderChange}
                                aria-labelledby="input-slider"
                                min={minSlider}
                                max={maxSlider}
                                size="small"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={value}
                                size="small"
                                onChange={InputChange}
                                onBlur={Blur}
                                variant="standard"
                                style={{ BorderNone: true, border: 'none' }}
                                InputProps={{ step: minSlider, min: minSlider, max: maxSlider, type: 'number', 'aria-labelledby': 'input-slider', disableUnderline: true}}

                            />
                        </Grid>
                    </Grid>
                    <div className="d-flex justify-center pa-0 ma-0" style={{marginTop:"-18px"}}>
                        <Col md={4}>
                            <Input
                                value={minSlider}
                                size="small"
                                onChange={InputChange}
                                onBlur={Blur}
                                className="pa-0 ma-0 no-underline"
                                style={{ BorderNone: true }}
                                onKeyDown={onlyNumber}
                                variant="standard"
                                InputProps={{
                                    min: minSlider,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                    disableUnderline: true,
                                    value: minSlider,
                                }}
                            />
                        </Col>
                        <Col md={4}>
                            <Input
                                value={maxSlider}
                                size="small"
                                onChange={InputChange}
                                onBlur={Blur}
                                className="pa-0 ma-0 no-underline"
                                style={{ BorderNone: true }}
                                variant="standard"
                                onKeyDown={onlyNumber}
                                InputProps={{
                                    value: maxSlider,
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

export default connect(mapStateToProps)(ZPosition);
