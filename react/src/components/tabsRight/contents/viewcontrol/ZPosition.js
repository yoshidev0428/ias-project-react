import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import {Row, Col, Container} from 'react-bootstrap';
// import Slider from '@mui/material/Slider';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Icon from '@mdi/react';
import {
    mdiSwapVertical
} from '@mdi/js';
import StepRangeSlider from 'react-step-range-slider';
import {connect} from 'react-redux';

import store from "../../../../reducers";


const Input = styled(TextField)`
  width: 50px;
`;
const mapStateToProps = (state) => ({
    content: state.files.content,
    files: state.files.files,
    selectedVesselHole: state.vessel.selectedVesselHole,
    isImageLoading: state.files.isImageLoading,
})

const ZPosition = (props) => {

    const {isImageLoading} = props;
    var contents = [];
    const [value, setValue] = useState(1);
    const [minSlider, setMinSlider] = useState(1);
    const [maxSlider, setMaxSlider] = useState(2);

    const [isLoading, setIsLoading] = useState(false);
    const [range, setRange] = useState([
        {value: 1, step: 1},
        {value: 2, step: 1}
    ]);

    const updateZ = (newValue) => {
        store.dispatch({ type: "vessel_selectedVesselZ", content: newValue - 1 });
    }

    const SliderChange = (newValue) => {
        setIsLoading(false);
        setValue(newValue);
        updateZ(newValue);
        setIsLoading(true);
    };

    const InputChange = (event) => {
        let currentValue = event.target.value === '' ? '' : Number(event.target.value);
        // console.log("ZPosition InputChange currentValue : ", currentValue);
        if (currentValue < minSlider) {
            setValue(minSlider);
        } else if (currentValue > maxSlider) {
            setValue(maxSlider);
        } else {
            setIsLoading(false);
            setValue(currentValue);
            updateZ(currentValue);
            setIsLoading(true);
        }
    };

    const on3DView = () => {
        console.log("on3DVIew clicked")
    }

    useEffect(() => {
        if (props.content) {
            // console.log(" Zposition.js useEffect props.content : ", props.content);
            if (props.content.length > 0) {
                setIsLoading(false);
                contents = props.content; let zMin = contents[0].z; let zMax = contents[0].z;
                for (let i = 0; i < contents.length; i++) {
                    if (contents[i].z > zMax) {
                        zMax = contents[i].z;
                    }
                    if (contents[i].z < zMin) {
                        zMin = contents[i].z;
                    }
                }
                if (zMax > 0) {
                    let rangeValues = [];
                    for (let i = 0; i < zMax - zMin + 1; i++) {
                        rangeValues.push({value: i + 1, step: 1});
                    }
                    console.log(" Zposition.js useEffect rangeValues : ", rangeValues);
                    setValue(zMin + 1);
                    setRange(rangeValues);
                    setMinSlider(zMin + 1);
                    setMaxSlider(zMax + 1);
                    setIsLoading(true);
                }
            }
            // setZPosConfig(props.viewConfigsObj.z);
        }
    }, [props.content])

    useEffect(() => {
        if (props.selectedVesselHole && props.content) {
            console.log(" Zposition.js useEffect props.selectedVesselHole : ", props.selectedVesselHole);
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

    // useEffect(() => {
    //     if (zPosConfig) {
    //         setMinSlider(zPosConfig.min);
    //         setMaxSlider(zPosConfig.max);
    //         setValue(zPosConfig.min);
    //     }
    // }, [zPosConfig])

    return (
        <>
            <div className={`common-border ${isLoading || !isImageLoading ? "" : "cover-gray"}`}>
                <div className="d-flex justify-space-between align-center" >
                    <h6>Z Position</h6>
                    <div>
                        <div className="spacer"></div>
                        <Button className="py-0" variant="contained" color="primary" size="small" onClick={on3DView}>3-D View</Button>
                    </div>
                </div>
                <Container fluid={true} className="px-0 py-0" >
                    <Grid container spacing={1} alignItems="left">
                        <Grid item xs={2}>
                            <Icon path={mdiSwapVertical} size={1} />
                        </Grid>
                        <Grid item xs={6}>
                            <StepRangeSlider
                                value={value}
                                range={range}
                                onChange={(value) => {SliderChange(value)}}
                                disabled={!isLoading}
                                className="color-blue mr-5"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Input
                                value={value}
                                size="small"
                                onChange={InputChange}
                                variant="standard"
                                style={{BorderNone: true, border: 'none'}}
                                InputProps={{
                                    step: minSlider, min: minSlider, max: maxSlider, type: 'number', 'aria-labelledby': 'input-slider', disableUnderline: true,
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
                                className="pa-0 ma-0 no-underline input-removeArrow"
                                style={{BorderNone: true}}
                                variant="standard"
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
