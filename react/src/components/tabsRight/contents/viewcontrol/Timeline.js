import React, {useState, useEffect} from 'react';
import {Col, Container} from 'react-bootstrap';
// import Slider from '@mui/material/Slider';
import {styled} from '@mui/material/styles';
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
import {connect} from 'react-redux';
import StepRangeSlider from 'react-step-range-slider';
import { useSelector } from 'react-redux';

import store from "../../../../reducers";

const Input = styled(TextField)`
  width: 50px;
  border
`;

const mapStateToProps = (state) => ({
    content: state.files.content,
    files: state.files.files,
    selectedVesselHole: state.vessel.selectedVesselHole,
    isImageLoading: state.files.isImageLoading,
})

const Timeline = (props) => {

    const {isImageLoading} = props;
    var contents = [];
    const [isLoading, setIsLoading] = useState(false);
    const [range, setRange] = useState([
        {value: 1, step: 1},
        {value: 2, step: 1},
        {value: 3, step: 1},
        {value: 4, step: 1},
        {value: 5, step: 1},
        {value: 6, step: 1},
        {value: 7, step: 1},
        {value: 8, step: 1},
        {value: 9, step: 1},
        {value: 10, step: 1}
    ]);
    const [value, setValue] = useState(1);
    const [minSlider, setMinSlider] = useState(1);
    const [maxSlider, setMaxSlider] = useState(10);

    const updateTime = (newValue) => {
        store.dispatch({type: "vessel_selectedVesselTime", content: newValue});
    }

    const SliderChange = (newValue) => {
        console.log(" Timeline.js SliderChange newValue : ", newValue);
        setIsLoading(false);
        setValue(newValue);
        updateTime(newValue);
        setIsLoading(true);
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

    const InputChange = (event) => {
        let currentValue = event.target.value === '' ? '' : Number(event.target.value);
        console.log("Timeline InputChange currentValue : ", currentValue);
        if (currentValue < minSlider) {
            setValue(minSlider);
        } else if (currentValue > maxSlider) {
            setValue(maxSlider);
        } else {
            setIsLoading(false);
            setValue(currentValue);
            updateTime(currentValue);
            setIsLoading(true);
        }
    };
    const getTimeLine = useSelector( state => state.experiment.viewinfo.timeline)
    useEffect(() => {
        if (props.selectedVesselHole && props.content) {
            console.log(" ==== timeline.js useEffect props.selectedVesselHole : ", props.selectedVesselHole);
            if (props.content.length > 0) {
                // let contents = props.content; let zMin = 0; let zMax = 0;
                // for (let i = 0; i < contents.length; i++) {
                //     if (contents[i].z > zMax) {
                //         zMax = contents[i].z;
                //     }
                //     if (contents[i].z < zMin) {
                //         zMin = contents[i].z;
                //     }
                // }
                // if (zMax > 0) {
                //     let rangeValues = [];
                //     for (let i = 0; i < zMax - zMin; i++) {
                //         rangeValues.push({value: i + 1, step: i + 1});
                //     }
                //     setRange(rangeValues);
                //     setMinSlider(zMin + 1);
                //     setMaxSlider(zMax + 1);
                //     setIsZ(true);
                // }
            }
            // setZPosConfig(props.viewConfigsObj.z);
        }
    }, [props.selectedVesselHole])

    useEffect(() => {
        if (props.content) {
            console.log(" ==== Timeline.js useEffect props.content : ", props.content);
            if (props.content.length > 0) {
                setIsLoading(false);
                contents = props.content;
                let timeMin = contents[0].time; let timeMax = contents[0].time;
                for (let i = 0; i < contents.length; i++) {
                    if (contents[i].time > timeMax) {
                        timeMax = contents[i].time;
                    }
                    if (contents[i].time < timeMin) {
                        timeMin = contents[i].time;
                    }
                }
                if (timeMax > 0) {
                    let rangeValues = [];
                    for (let i = timeMin; i <= timeMax; i++) {
                        rangeValues.push({value: i, step: 1});
                    }
                    // rangeValues.sort((a, b) => a.value - b.value);
                    console.log(" Timeline.js useEffect rangeValues : ", rangeValues);
                    setValue(timeMin);
                    setRange(rangeValues);
                    setMinSlider(timeMin);
                    setMaxSlider(timeMax);
                    setIsLoading(true);
                    updateTime(timeMin);
                }
            }
            // setZPosConfig(props.viewConfigsObj.z);
        }
    }, [props.content])

    return (
        <>
            <div className={`common-border ${isLoading ? "" : "cover-gray"}`}>
                {/* || !isImageLoading  */}
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
                        <Grid item xs={2}>
                            <Icon path={mdiPlay} size={1} />
                        </Grid>
                        <Grid item xs={6}>
                            <StepRangeSlider
                                value={value}
                                range={range}
                                onChange={(value) => {SliderChange(value)}}
                                disabled={!isLoading || isImageLoading}
                                className="color-blue mr-5"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Input
                                className="pa-0 ma-0 ml-2 no-underline"
                                value={value}
                                size="small"
                                onChange={InputChange}
                                variant="standard"
                                style={{BorderNone: true, border: 'none'}}
                                InputProps={{
                                    step: 1, min: minSlider, max: maxSlider, type: 'number', 'aria-labelledby': 'input-slider', disableUnderline: true,
                                    disabled: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <div className="d-flex justify-center pa-0 ma-0" style={{marginTop: "-18px"}}>
                        <Col md={4}>
                            <Input
                                value={minSlider}
                                size="small"
                                className="pa-0 ma-0 no-underline input-removeArrow"
                                style={{BorderNone: true}}
                                variant="standard"
                                InputProps={{
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
                                className="pa-0 ma-0 no-underline"
                                variant="standard"
                                style={{BorderNone: true}}
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
