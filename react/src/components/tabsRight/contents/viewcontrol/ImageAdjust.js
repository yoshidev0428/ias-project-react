import * as React from 'react';
import Button from '@mui/material/Button';
import { Col, Container } from 'react-bootstrap';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Icon from '@mdi/react';
import {
    mdiBrightness5,
    mdiPlus,
    mdiMenuUp,
    mdiMenuDown,
    mdiCircleHalfFull,
    mdiWeatherSunny
} from '@mdi/js';

const Input = styled(TextField)`
  width: 50px;
`;

export default function ImageAdjust() {
    //Brightness
    const [Brightvalue, setBrightValue] = React.useState(0);
    const BrightSliderChange = (event, newValue) => {
        setBrightValue(newValue);
    };
    const BrightInputChange = (event) => {
        setBrightValue(event.target.value === '' ? '' : Number(event.target.value));
    };
    const BrightBlur = () => {
        if (Brightvalue < -100) {
            setBrightValue(-100);
        } else if (Brightvalue > 100) {
            setBrightValue(100);
        }
    };

    // Contrast
    const [Contvalue, setContValue] = React.useState(0);
    const ContSliderChange = (event, newValue) => {
        setContValue(newValue);
    };
    const ContInputChange = (event) => {
        setContValue(event.target.value === '' ? '' : Number(event.target.value));
    };
    const ContBlur = () => {
        if (Contvalue < -100) {
            setContValue(-100);
        } else if (Contvalue > 100) {
            setContValue(100);
        }
    };

    // Gamma
    const [Gammavalue, setGammaValue] = React.useState(0);
    const GammaSliderChange = (event, newValue) => {
        setGammaValue(newValue);
    };
    const GammaInputChange = (event) => {
        setGammaValue(event.target.value === '' ? '' : Number(event.target.value));
    };
    const GammaBlur = () => {
        if (Gammavalue < -100) {
            setGammaValue(-100);
        } else if (Gammavalue > 100) {
            setGammaValue(100);
        }
    };

    return (
        <>
            <div className="common-border">
                <div className="d-flex justify-space-between align-center" >
                    <h6>Image Adjust</h6>
                    <div>
                        <div className="spacer"></div>
                        <Button className="py-0" height="20px" variant="contained" color="primary" size="small">Reset</Button>
                    </div>
                </div>
                <Container fluid={true} className="px-0 py-0">
                    {/* Brightness */}
                    <Col className="pa-0" xs={12}>
                        <Grid container spacing={1} alignItems="left" style={{ marginTop: "-10px" }}>
                            <Grid item>
                                <Icon path={mdiBrightness5} size={0.7} />
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    value={typeof Brightvalue === 'number' ? Brightvalue : 0}
                                    onChange={BrightSliderChange}
                                    aria-labelledby="input-slider"
                                    min={-100}
                                    max={100}
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={Brightvalue}
                                    size="small"
                                    onChange={BrightInputChange}
                                    onBlur={BrightBlur}
                                    variant="standard"
                                    style={{ BorderNone: true, border: 'none' }}
                                    InputProps={{ step: 1, min: -100, max: 100, type: 'number', 'aria-labelledby': 'input-slider', disableUnderline: true }}
                                />
                            </Grid>
                        </Grid>
                    </Col>
                    {/* Contrast */}
                    <Col className="pa-0" xs={12}>
                        <Grid container spacing={1} alignItems="left" style={{ marginTop: "-20px" }}>
                            <Grid item>
                                <Icon path={mdiCircleHalfFull} size={0.7} />
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    value={typeof Contvalue === 'number' ? Contvalue : 0}
                                    onChange={ContSliderChange}
                                    aria-labelledby="input-slider"
                                    min={-100}
                                    max={100}
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={Contvalue}
                                    size="small"
                                    onChange={ContInputChange}
                                    onBlur={ContBlur}
                                    variant="standard"
                                    style={{ BorderNone: true, border: 'none' }}
                                    InputProps={{ step: 1, min: -100, max: 100, type: 'number', 'aria-labelledby': 'input-slider', disableUnderline: true, }} />
                            </Grid>
                        </Grid>
                    </Col>
                    {/* Gamma */}
                    <Col className="pa-0" xs={12}>
                        <Grid container spacing={1} alignItems="left" style={{ marginTop: "-20px", marginBottom: "-12px" }} >
                            <Grid item>
                                <Icon path={mdiWeatherSunny} size={0.7} />
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    value={typeof Gammavalue === 'number' ? Gammavalue : 0}
                                    onChange={GammaSliderChange}
                                    aria-labelledby="input-slider"
                                    min={-100}
                                    max={100}
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={Gammavalue}
                                    size="small"
                                    onChange={GammaInputChange}
                                    onBlur={GammaBlur}
                                    variant="standard"
                                    style={{ BorderNone: true, border: 'none' }}
                                    InputProps={{ step: 1, min: -100, max: 100, type: 'number', 'aria-labelledby': 'input-slider', disableUnderline: true }}
                                />
                            </Grid>
                        </Grid>
                    </Col>
                </Container>
            </div>
        </>
    );
};
