import Dialog from '@mui/material/Dialog';

import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Slides from './Slides';
import WellPlates from './WellPlates';
import Dishes from './Dishes';
import Wafers from './Wafers';
import { getVesselById } from '../../utils/vessel-types';

// import { useElementSize } from 'usehooks-ts';
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export const ExpansionDialog = (props) => {

    // const [tab, setTab] = useState(0);
    const [open, setOpen] = useState(true);
    const [currentVessel, setCurrentVessel] = useState(props.currentVessel);

    // const [ref, { width, height }] = useElementSize();
    useEffect(() => {
        setOpen(props.open);
        setCurrentVessel(props.currentVessel);
    }, [props]);

    // const handleTabChange = (event, newValue) => {
    //     setTab(newValue);
    // };

    const handleClose = () => {
        props.closeDialog();
    };

    const changeCurrentVessel = (id) => {
        setCurrentVessel(id);
        if (props.changeVessel) {
            props.changeVessel(id);
        }
    };

    const renderVesselItem = (vessel) => {
        if (vessel) {
            switch (vessel.type) {
                case 'Slide':
                    return <div role="button" onClick={() => { changeCurrentVessel(vessel.id) }} style={{ width: 500 }}><Slides width={"480px"} height={"350px"} vessel={vessel} count={vessel.count} key={vessel.id}/></div>;
                case 'Dish':
                    return <div role="button" onClick={() => { changeCurrentVessel(vessel.id) }} style={{ width: 500 }}><Dishes width={"480px"} height={"350px"} vessel={vessel} size={vessel.size} key={vessel.id} /></div>;
                case 'Well':
                    return <div role="button" onClick={() => { changeCurrentVessel(vessel.id) }} style={{ width: 500 }}><WellPlates width={"480px"} height={"350px"} vessel={vessel} rows={vessel.rows} cols={vessel.cols} showName={true} key={vessel.id} showNumber={true} /></div>;
                case 'Wafer':
                    return <div role="button" onClick={() => { changeCurrentVessel(vessel.id) }} style={{ width: 500 }}><Wafers width={"480px"} height={"350px"} vessel={vessel} size={vessel.size} key={vessel.id} /></div>;
                default:
                    return;
            }
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth={'510'}>
            <div className="d-flex border-bottom">
                <DialogTitle>Vessel Expansion</DialogTitle>
                <button className="dialog-close-btn" color="primary" size="small" onClick={handleClose}>&times;</button>
            </div>
            <div style={{ width: 510 }} className='border'>
                {renderVesselItem(getVesselById(currentVessel))}
            </div>
            <DialogActions>
                <DialogActions>
                    <Button className="pa-1" variant="contained" color="primary" size="small" onClick={handleClose}>OK</Button>
                </DialogActions>
            </DialogActions>
        </Dialog>
    );
}