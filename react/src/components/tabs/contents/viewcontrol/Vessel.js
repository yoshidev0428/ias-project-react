import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { getVesselById } from '../../../../utils/vessel-types';
import { useElementSize } from 'usehooks-ts';
import Dishes from '../../../vessels/Dishes';
import Slides from '../../../vessels/Slides';
import WellPlates from '../../../vessels/WellPlates';
import Wafers from '../../../vessels/Wafers';
import {
    mdiSyncAlert,
    mdiImageFilterCenterFocus,
} from '@mdi/js';
import Icon from '@mdi/react';
import { SelectDialog } from '../../../vessels/SelectDialog';
import { ExpansionDialog } from '../../../vessels/ExpansionDialog';
// import CustomButton from '../../../custom/CustomButton';

export default function Vessel(props) {

    const [currentVesselId, setCurrentVesselId] = useState(1);
    const [currentVessel, setCurrentVessel] = useState(getVesselById(1));
    const [showSelectDialog, setShowSelectDialog] = useState(false);
    const [showExpansionDialog, setShowExpansionDialog] = useState(false);

    const [ref, { width }] = useElementSize();

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
                case 'Dish':
                    return <Dishes width={width} size={currentVessel.size} />;
                case 'Well':
                    return <WellPlates width={width} rows={currentVessel.rows} cols={currentVessel.cols} showName={currentVessel.showName} />;
                case 'Wafer':
                    return <Wafers width={width} size={currentVessel.size} />;
                default:
                    return;
            }
        }
    }

    return (
        <Card ref={ref}>
            <div className="d-flex justify-content-around common-border">
                <h6 style={{ width: "60%" }}> {currentVessel.title} - {currentVessel.type}</h6>
                <button className='btn btn-light btn-sm' style={{ width: "25%" }} onClick={() => setShowSelectDialog(true)}>
                    <Icon size={0.6}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiSyncAlert}>
                    </Icon>
                </button>
                <button className='btn btn-light btn-sm' style={{ width: "25%" }} onClick={() => setShowExpansionDialog(true)}>
                    <Icon size={0.6}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiImageFilterCenterFocus}>
                    </Icon>
                </button>
            </div>
            {renderVessel()}
            <SelectDialog currentVessel={currentVesselId} open={showSelectDialog} closeDialog={() => { setShowSelectDialog(false) }} changeVessel={(id) => { setCurrentVesselId(id); setCurrentVessel(getVesselById(id)); }} />
            <ExpansionDialog currentVessel={currentVesselId} open={showExpansionDialog} closeDialog={() => { setShowExpansionDialog(false) }} />
        </Card >
    );
}