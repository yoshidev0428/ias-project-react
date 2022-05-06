import React, { useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import {
    AccordionSummary,
    Accordion,
    AccordionDetails,
    Typography
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { useFlagsStore } from "../../../../state";

const Filter2dDialog = () => {

    const DialogFilter2dflag = useFlagsStore(store => store.DialogFilter2dflag);

    // const [emphasisFlag, setEmpahsisFlag] = useState(false);
    // const [edgeFlag, setEdge] = useState(false);
    // const [morphologicalFlag, setMorphological] = useState(false);
    // const [kernelFlag, setKernel] = useState(false);
    // const [specialfilterFlag, setSepcialFilter] = useState(false);
    // const [leargeFlag, setLearge] = useState(false);

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        console.log( panel, isExpanded, expanded, "panel, isExpanded, expanded, ");
        setExpanded(isExpanded ? panel : false);
    };

    const close = () => {
        useFlagsStore.setState({ DialogFilter2dflag: false });
    };

    const action = () => {
        console.log("flag Status---> Action");
    };

    return (
        <>
            <Dialog open={DialogFilter2dflag} onClose={close} minWidth={"610"} >
                <div className="d-flex border-bottom">
                    <DialogTitle>2DFilter Select</DialogTitle>
                    <button className="dialog-close-btn" color="primary" size="small" onClick={close}>&times;</button>
                </div>
                <div className='d-flex justify-content-around p-2' style={{ width: 600, overflowY: "scroll", overflowX: "hidden" }}>
                    <div className='border' style={{ width: "100%", height: "100%" }}>
                        <Accordion expanded={expanded === 'emphasis'} onChange={handleChange('emphasis')}>
                            <AccordionSummary aria-controls="emphasis-content" id="emphasis-header" className="border filter-dialog-tab-bg">
                                <Typography>emphasis</Typography>
                            </AccordionSummary>
                            <AccordionDetails className='p-0'>
                                <Row>
                                    <Col>
                                        <div className="card-body">
                                            <div className="btn-group-vertical" role="group" aria-label="button-group-2Dfilter-emphasis">
                                                <button type="button" className="btn btn-sm bg-light text-dark" helf="#LowPass">Low pass</button>
                                                <button type="button" className="btn btn-sm bg-light text-dark" helf="#HighPass">High pass</button>
                                                <button type="button" className="btn btn-sm bg-light text-dark">Sharpening</button>
                                                <button type="button" className="btn btn-sm bg-light text-dark">Median</button>
                                                <button type="button" className="btn btn-sm bg-light text-dark">Gauss</button>
                                                <button type="button" className="btn btn-sm bg-light text-dark">High gauss</button>
                                                <button type="button" className="btn btn-sm bg-light text-dark">Local equalization</button>
                                                <button type="button" className="btn btn-sm bg-light text-dark">Flattening</button>
                                                <button type="button" className="btn btn-sm bg-light text-dark">Rank</button>
                                                <button type="button" className="btn btn-sm bg-light text-dark">Stain removal</button>
                                                <button type="button" className="btn btn-sm bg-light text-dark">Sigma</button>
                                                <button type="button" className="btn btn-sm bg-light text-dark">Sigma(Median)</button>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="card body" id="LowPass"> Low Pass</div>
                                        <div className="card body" id="HighPass">High Pass</div>
                                    </Col>
                                </Row>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'edge'} onChange={handleChange('edge')}>
                            <AccordionSummary aria-controls="edge-content" id="edge-header" className="border filter-dialog-tab-bg">
                                <Typography>edge</Typography>
                            </AccordionSummary>
                            <AccordionDetails className='p-0'>
                                <Row>
                                    <div className="card-body">
                                        <div className="btn-group-vertical" role="group" aria-label="button-group-2Dfilter-edge">
                                            <button type="button" className="btn btn-sm bg-light text-dark">Sobel</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Roberts</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Laplacian</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Variance</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Sobel Phase</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Horizontal Edge</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Canny</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Gabor</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Differential UI restoration</button>
                                        </div>
                                    </div>
                                </Row>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'morphological'} onChange={handleChange('morphological')}>
                            <AccordionSummary aria-controls="morphological-content" id="morphological-header" className="border filter-dialog-tab-bg">
                                <Typography>morphological</Typography>
                            </AccordionSummary>
                            <AccordionDetails className='p-0'>
                                <Row>
                                    <div className="card-body">
                                        <div className="btn-group-vertical" role="group" aria-label="button-group-2Dfilter-morphological">
                                            <button type="button" className="btn btn-sm bg-light text-dark">Cutting</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Connection</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Contraction</button>
                                        </div>
                                    </div>
                                </Row>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'kernel'} onChange={handleChange('kernel')}>
                            <AccordionSummary aria-controls="kernel-content" id="kernel-header" className="border filter-dialog-tab-bg">
                                <Typography>kernel</Typography>
                            </AccordionSummary>
                            <AccordionDetails className='p-0'>
                                <Row>
                                    <div className="card-body">
                                        <div className="btn-group-vertical" role="group" aria-label="button-group-2Dfilter-kernel">
                                            <button type="button" className="btn btn-sm bg-light text-dark">Convolution</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Morphological</button>
                                        </div>
                                    </div>
                                </Row>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'specialfilter'} onChange={handleChange('specialfilter')}>
                            <AccordionSummary aria-controls="specialfilter-content" id="specialfilter-header" className="border filter-dialog-tab-bg">
                                <Typography>kernel</Typography>
                            </AccordionSummary>
                            <AccordionDetails className='p-0'>
                                <Row>
                                    <div className="card-body">
                                        <div className="btn-group-vertical" role="group" aria-label="button-group-2Dfilter-specialfilter">
                                            <button type="button" className="btn btn-sm bg-light text-dark">Sculpture</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Background</button>
                                        </div>
                                    </div>
                                </Row>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'learge'} onChange={handleChange('learge')}>
                            <AccordionSummary aria-controls="learge-content" id="learge-header" className="border filter-dialog-tab-bg">
                                <Typography>learge</Typography>
                            </AccordionSummary>
                            <AccordionDetails className='p-0'>
                                <Row>
                                    <div className="card-body">
                                        <div className="btn-group-vertical" role="group" aria-label="button-group-2Dfilter-learge">
                                            <button type="button" className="btn btn-sm bg-light text-dark">Low Pass</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">High Pass</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Band Pass</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Edge+</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Edge-</button>
                                        </div>
                                    </div>
                                </Row>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
                <div className='border-top mt-2'>
                    <DialogActions>
                        <Button className="btn btn-success btn-md" onClick={action}>Action</Button>
                        <Button className="btn btn-primary btn-md" onClick={close}>OK</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    );
}
export default Filter2dDialog;