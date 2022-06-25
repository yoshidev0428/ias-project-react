import React, {useState, useEffect} from 'react';
import { Col, Container } from 'react-bootstrap';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Icon from '@mdi/react';
import {
    mdiRefresh,
    mdiCog,
    mdiPlay,
    // mdiStop,
    // mdiRewind,
    // mdiFastForward
} from '@mdi/js';
import store from "../../reducers";
import {connect} from 'react-redux';

const Input = styled(TextField)`
  width: 50px;
  border
`;

const mapStateToProps = state => ({
    viewConfigsObj: state.vessel.viewConfigsObj,
})

const Timeline = (props) => {
    const [value, setValue] = React.useState(1);
    const [timeConfig, setTimeConfig] = useState(props.viewConfigsObj? props.viewConfigsObj.time: {});
    const [minSlider, setMinSlider] = useState(-50);
    const [maxSlider, setMaxSlider] = useState(50);
    const SliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const onRefresh = () => {
        console.log("onRefresh clicked")
    }
    const onSetting = () => {
        console.log("onSetting clicked")
    }
    // const onPlay = () => {
    //     console.log("onPlay clicked")
    // }
    // const onStop = () => {
    //     console.log("onStop clicked")
    // }
    // const onRewind = () => {
    //     console.log("onRewind clicked")
    // }
    // const onFForward = () => {
    //     console.log("onFForward clicked")
    // }

    const onlyNumber = () => {
        console.log("onlyNumber clicked")
    }

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

    useEffect(() => {
        if(props.viewConfigsObj){
            setTimeConfig(props.viewConfigsObj.time);
        }
    },[props.viewConfigsObj])

    useEffect(() => {
        if(timeConfig){
            setMinSlider(timeConfig.min);
            setMaxSlider(timeConfig.max);
            setValue(timeConfig.min);
        }
    },[timeConfig])

    return (
        <>
            <div className="common-border">
                <div className="d-flex justify-space-between align-center" >
                    <h6>Timeline</h6>
                    <div>
                        <div className="spacer"></div>
                        <IconButton color="primary" size="small" onClick={onRefresh}><Icon path={mdiRefresh} size={1} /></IconButton>
                        <IconButton color="primary" size="small" onClick={onSetting}><Icon path={mdiCog} size={1} /></IconButton>
                    </div>
                </div>
                <Container fluid={true} className="px-0 py-0">
                    <Grid container spacing={1} alignItems="left">
                        <Grid item>
                            <Icon path={mdiPlay} size={1} />
                        </Grid>
                        <Grid item>
                            {/* <IconButton color="primary" size="small" onClick={onPlay}><Icon path={mdiPlay} size={1}/></IconButton>
          <IconButton color="primary" size="small" onClick={onStop}><Icon path={mdiStop} size={1}/></IconButton>
          <IconButton color="primary" size="small" onClick={onRewind}><Icon path={mdiRewind} size={1}/></IconButton>
          <IconButton color="primary" size="small" onClick={onFForward}><Icon path={mdiFastForward} size={1}/></IconButton> */}
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
                                InputProps={{
                                    step: 1,
                                    min: minSlider,
                                    max: maxSlider,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                    disableUnderline: true,
                                }}

                            />
                        </Grid>
                    </Grid>
                    <div className="d-flex justify-center pa-0 ma-0" style={{marginTop:"-18px"}}>
                        <Col md={4}>
                            <Input
                                value={minSlider}
                                size="small"
                                className="pa-0 ma-0 no-underline"
                                style={{ BorderNone: true }}
                                onKeyDown={onlyNumber}
                                variant="standard"
                                InputProps={{
                                    min: minSlider,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                    disableUnderline: true,
                                }}
                            />
                        </Col>
                        <Col md={4}>
                            <Input
                                value={maxSlider}
                                size="small"
                                className="pa-0 ma-0 no-underline"
                                variant="standard"
                                style={{ BorderNone: true }}
                                onKeyDown={onlyNumber}
                                InputProps={{
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

export default connect(mapStateToProps)(Timeline);
