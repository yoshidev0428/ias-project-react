import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { getVesselById } from '../../../../utils/vessel-types';
import { useElementSize } from 'usehooks-ts';
import Dishes from '../../../vessels/Dishes';
import Slides from '../../../vessels/Slides';
import WellPlates from '../../../vessels/WellPlates';
import Wafers from '../../../vessels/Wafers';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { SelectDialog } from '../../../vessels/SelectDialog';
import { ExpansionDialog } from '../../../vessels/ExpansionDialog';

export default function Vessel (props) {

    const [currentVesselId, setCurrentVesselId] = useState(1);
    const [currentVessel, setCurrentVessel] = useState(getVesselById(1));
    const [showSelectDialog, setShowSelectDialog] = useState(false);
    const [showExpansionDialog, setShowExpansionDialog] = useState(false);
    
    const [ref, { width, height }] = useElementSize();

    useEffect(() => {
        setCurrentVessel(getVesselById(currentVesselId));
    }, [currentVesselId]);

    if (currentVessel == null) {
        return (
            <></>
        );
    }

    const renderVessel = () => {
        if (currentVessel) {
            switch (currentVessel.type) {
                case 'Slide':
                    return <Slides width={width} count={currentVessel.count} />;
                case 'WellPlate':
                    return <WellPlates width={width} rows={currentVessel.rows} cols={currentVessel.cols} showName={currentVessel.showName} />;
                case 'Dish':
                    return <Dishes width={width} size={currentVessel.size} />;
                case 'Wafer':
                    return <Wafers width={width} size={currentVessel.size} />;
            }
        }
    }

    return (
        <Card ref={ref}>
            <div>
                <h5>{currentVessel.title}</h5>
            </div>
            {renderVessel()}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SyncAltIcon role="button" className="primary--text" onClick={() => { setShowSelectDialog(true) }} />
                <CenterFocusStrongIcon role="button" className="primary--text" onClick={() => { setShowExpansionDialog(true) }} />
            </div>
            <SelectDialog currentVessel={currentVesselId} open={showSelectDialog} closeDialog={() => { setShowSelectDialog(false) }} changeVessel={(id) => { setCurrentVesselId(id); setCurrentVessel(getVesselById(id)); }} />
            <ExpansionDialog currentVessel={currentVesselId} open={showExpansionDialog} closeDialog={() => { setShowExpansionDialog(false) }} />
        </Card>
    );
}