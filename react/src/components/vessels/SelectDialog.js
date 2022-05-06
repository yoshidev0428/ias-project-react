import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Slides from './Slides';
import WellPlates from './WellPlates';
import Dishes from './Dishes';
import Wafers from './Wafers';
import { VESSELS } from '../../utils/vessel-types';
import { useElementSize } from 'usehooks-ts';


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

export const SelectDialog = (props) => {

    const [tab, setTab] = useState(0);
    const maxDialogWidth = 800;
    const [open, setOpen] = useState(true);
    const [currentVessel, setCurrentVessel] = useState(props.currentVessel);

    const [ref] = useElementSize();
    // { width, height }
    useEffect(() => {
        setOpen(props.open);
    }, [props]);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleClose = () => {
        props.closeDialog();
    };

    const changeCurrentVessel = (id) => {
        setCurrentVessel(id);
        if (props.changeVessel) {
            props.changeVessel(id);
        }
    };

    // btn btn-selected-vessel-color d-flex p-0 pr-1
    // <p className='m-auto'>{vessel.title + vessel.type}</p>
    const renderVesselItem = (vessel) => {
        if (vessel) {
            switch (vessel.type) {
                case 'Slide':
                    return <div key={vessel.id} className={currentVessel === vessel.id ? 'border border-primary align-items-center justify-content-center' : 'align-items-center justify-content-center'} role="button" onClick={() => { changeCurrentVessel(vessel.id) }} style={{ width: maxDialogWidth / 6.3 }}><Slides width={maxDialogWidth / 6.3 - 10} count={vessel.count} /><div className={'text-center text-info'}>{vessel.title}</div></div>;
                case 'Well':
                    return <div key={vessel.id} className={currentVessel === vessel.id ? 'border border-primary align-items-center justify-content-center' : 'align-items-center justify-content-center'} role="button" onClick={() => { changeCurrentVessel(vessel.id) }} style={{ width: maxDialogWidth / 6.3 }}><WellPlates width={maxDialogWidth / 6.3 - 10} rows={vessel.rows} cols={vessel.cols} showName={vessel.showName} /><div className={'text-center text-info'}>{vessel.title}</div></div>;
                case 'Dish':
                    return <div key={vessel.id} className={currentVessel === vessel.id ? 'border border-primary align-items-center justify-content-center' : 'align-items-center justify-content-center'} role="button" onClick={() => { changeCurrentVessel(vessel.id) }} style={{ width: maxDialogWidth / 6.3 }}><Dishes width={maxDialogWidth / 6.3 - 10} size={vessel.size} /><div className={'text-center text-info'}>{vessel.title}</div></div>;
                case 'Wafer':
                    return <div key={vessel.id} className={currentVessel === vessel.id ? 'border border-primary align-items-center justify-content-center' : 'align-items-center justify-content-center'} role="button" onClick={() => { changeCurrentVessel(vessel.id) }} style={{ width: maxDialogWidth / 6.3 }}><Wafers width={maxDialogWidth / 6.3 - 10} size={vessel.size} /><div className={'text-center text-info'}>{vessel.title}</div></div>;
                default:
                    return;
            }
        }
    }

    const renderVessels = () => {
        if (tab >= VESSELS.length) {
            return (
                <div className="text-center pt-3" style={{ height: "70px" }}>
                    <p className='text-center'>Unimplemented</p>
                </div>
            );
        }
        let vessels = [];
        (VESSELS[tab]).forEach(vessel => {
            vessels.push(renderVesselItem(vessel));
        });
        return (<div ref={ref} className='d-flex flex-row justify-content-around m-1'>
            {
                vessels
            }
        </div>);
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth={"800"} >
            <div className="d-flex border-bottom">
                <DialogTitle>Vessel Select</DialogTitle>
                <button className="dialog-close-btn" color="primary" size="small" onClick={handleClose}>&times;</button>
            </div>
            <div style={{ width: maxDialogWidth }} className='border'>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={handleTabChange} className="">
                        <Tab className='common-tab-button' label="SLIDE" />
                        <Tab className='common-tab-button' label="DISH" />
                        <Tab className='common-tab-button' label="WELLPLATE" />
                        <Tab className='common-tab-button' label="WAFER" />
                        <Tab className='common-tab-button' label="CUSTOM" />
                    </Tabs>
                </Box>
                {renderVessels()}
            </div>
            <div>
                <DialogActions>
                    <Button className="" variant="contained" color="primary" size="small" onClick={handleClose}>OK</Button>
                </DialogActions>
            </div>
        </Dialog>
    );
}