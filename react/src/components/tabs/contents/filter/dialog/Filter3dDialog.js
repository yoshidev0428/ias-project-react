import React, {useState} from 'react';
import { Row, Button } from 'react-bootstrap';
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

const Filter3dDialog = () => {

    const DialogFilter3dflag = useFlagsStore(store => store.DialogFilter3dflag);

    const [expanded, setExpanded] = useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        console.log( panel, isExpanded, expanded, "panel, isExpanded, expanded, ");
        setExpanded(isExpanded ? panel : false);
    };

    const close = () => {
        useFlagsStore.setState({ DialogFilter3dflag: false });
    };

    const action = () => {
        console.log("flag Status---> Action");
    };

    return (
        <>
            <Dialog open={DialogFilter3dflag} onClose={close} maxWidth={"610"} >
                <div className="d-flex border-bottom">
                    <DialogTitle>3DFilter Select</DialogTitle>
                    <button className="dialog-close-btn" color="primary" size="small" onClick={close}>&times;</button>
                </div>
                <div className='d-flex justify-content-around p-2' style={{ width: 600, overflowY: "scroll", overflowX: "hidden" }}>
                    <div className='border' style={{ width: "100%", height: "100%" }}>
                        <Accordion expanded={expanded === 'Convolution'} onChange={handleChange('Convolution')}>
                            <AccordionSummary aria-controls="Convolution-content" id="Convolution-3d-header" className="border filter-dialog-tab-bg">
                                <Typography>Convolution</Typography>
                            </AccordionSummary>
                            <AccordionDetails className='p-0'>
                                <Row>
                                    <div className="card-body">
                                        <div className="btn-group-vertical" role="group" aria-label="button-group-3Dfilter-Convolution">
                                            <button type="button" className="btn btn-sm bg-light text-dark">Low Pass</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">High Pass</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Gauss</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Edge+</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Edge-</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Median</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Rank</button>
                                        </div>
                                    </div>
                                </Row>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'Morphological'} onChange={handleChange('Morphological')}>
                            <AccordionSummary aria-controls="Morphological-content" id="Morphological-3d-header" className="border filter-dialog-tab-bg">
                                <Typography>Morphological</Typography>
                            </AccordionSummary>
                            <AccordionDetails className='p-0'>
                                <Row>
                                    <div className="card-body">
                                        <div className="btn-group-vertical" role="group" aria-label="button-group-3Dfilter-Morphological">
                                            <button type="button" className="btn btn-sm bg-light text-dark">Cutting</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Connection</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Contraction</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Distance map</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Watershed</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Gray Watershed</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Thinning</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Cutting</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Pruning</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">End Point</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Degeneration</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Top hat+</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Top hat-</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Ring top hat</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Slope</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Great</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Reduction</button>
                                        </div>
                                    </div>
                                </Row>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'covuny'} onChange={handleChange('covuny')}>
                            <AccordionSummary aria-controls="covuny-content" id="covuny-3d-header" className="border filter-dialog-tab-bg">
                                <Typography>カーネル</Typography>
                            </AccordionSummary>
                            <AccordionDetails className='p-0'>
                                <Row>
                                    <div className="card-body">
                                        <div className="btn-group-vertical" role="group" aria-label="button-group-3Dfilter-covuny">
                                            <button type="button" className="btn btn-sm bg-light text-dark">Convolution</button>
                                            <button type="button" className="btn btn-sm bg-light text-dark">Morphological</button>
                                        </div>
                                    </div>
                                </Row>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
                <div className='border-top mt-2'>
                    <DialogActions>
                        <Button className="" variant="contained" color="success" size="medium" onClick={action}>Action</Button>
                        <Button className="" variant="contained" color="primary" size="medium" onClick={close}>OK</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    );
}
export default Filter3dDialog;