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
    mdiCircleHalfFull,
    mdiWeatherSunny
} from '@mdi/js';
import {
    // useImageSettingsStore,
    // useViewerStore,
    useChannelsStore,
    // useLoader
} from '../../../viv/state';

const Input = styled(TextField)`
  width: 50px;
`;

export default function ImageAdjust() {
    const [brightness, contrast, gamma, setBrightness, setContrast, setGamma] = useChannelsStore(store => [
        store.brightness,
        store.contrast,
        store.gamma,
        store.setBrightness,
        store.setContrast,
        store.setGamma
    ]);

    const handleSlideBrightness = (_event, newValue) => {        
        setBrightness(newValue ? Number(newValue) : 0);
    };
    const handleInputBrightness = (event) => {
        const newValue = Number(event.target.value);
        setBrightness(newValue ? Number(newValue) : 0);
    };
    const handleBlurBrightness = () => {
        setBrightness(Math.min(1, Math.max(-1, brightness)));
    };

    // Contrast
    const handleSlideContrast = (_event, newValue) => {        
        setContrast(newValue ? Number(newValue) : 0);
    };
    const handleInputContrast = (event) => {
        const newValue = Number(event.target.value);
        setContrast(newValue ? Number(newValue) : 0);
    };
    const handleBlurContrast = () => {
        setContrast(Math.min(1, Math.max(-1, contrast)));
    };

    // Gamma
    const handleSlideGamma = (_event, newValue) => {        
        setGamma(newValue ? Number(newValue) : 0);
    };
    const handleInputGamma = (event) => {
        const newValue = Number(event.target.value);
        setGamma(newValue ? Number(newValue) : 0);
    };
    const handleBlurGamma = () => {
        setGamma(Math.min(1, Math.max(-1, gamma)));
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
                                    value={brightness}
                                    onChange={handleSlideBrightness}
                                    aria-labelledby="input-slider"
                                    min={-1}
                                    max={1}
                                    step={0.01}
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={brightness}
                                    size="small"
                                    onChange={handleInputBrightness}
                                    onBlur={handleBlurBrightness}
                                    variant="standard"
                                    style={{ BorderNone: true, border: 'none' }}
                                    InputProps={{ step: 0.01, min: -1, max: 1, type: 'number', 'aria-labelledby': 'input-slider', disableUnderline: true }}
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
                                    value={contrast}
                                    onChange={handleSlideContrast}
                                    aria-labelledby="input-slider"
                                    min={-1}
                                    max={1}
                                    step={0.01}
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={contrast}
                                    size="small"
                                    onChange={handleInputContrast}
                                    onBlur={handleBlurContrast}
                                    variant="standard"
                                    style={{ BorderNone: true, border: 'none' }}
                                    InputProps={{ step: 0.01, min: -1, max: 1, type: 'number', 'aria-labelledby': 'input-slider', disableUnderline: true, }} />
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
                                    value={gamma}
                                    onChange={handleSlideGamma}
                                    aria-labelledby="input-slider"
                                    min={-1}
                                    max={1}
                                    step={0.01}
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={gamma}
                                    size="small"
                                    onChange={handleInputGamma}
                                    onBlur={handleBlurGamma}
                                    variant="standard"
                                    style={{ BorderNone: true, border: 'none' }}
                                    InputProps={{ step: 0.01, min: -1, max: 1, type: 'number', 'aria-labelledby': 'input-slider', disableUnderline: true }}
                                />
                            </Grid>
                        </Grid>
                    </Col>
                </Container>
            </div>
        </>
    );
};
