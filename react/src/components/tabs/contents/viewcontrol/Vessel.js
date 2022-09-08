import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
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

const mapStateToProps = (state) => ({
    content: state.files.content
})

const Vessel = (props) => {

    const [currentVesselId, setCurrentVesselId] = useState(1);
    const [currentVessel, setCurrentVessel] = useState(getVesselById(1));
    const [showSelectDialog, setShowSelectDialog] = useState(false);
    const [showExpansionDialog, setShowExpansionDialog] = useState(false);
    const [contents, setContents] = useState(props.content);
    const [ref, { width }] = useElementSize();

    useEffect(() => {
        setCurrentVessel(getVesselById(currentVesselId));
        // console.log("Current Vessel: ", currentVessel);
    }, [currentVesselId]);

    useEffect(() => {
        console.log("View Control Vessel.js : NEW CONTENT : ", props.content);
        if (props.content) {
            let current_contents = JSON.parse(JSON.stringify(props.content));
            setContents(current_contents);
            let current_vessel = { id: 1, type: "", rows: 1, cols: 1, title: "4", showName: true, showNumber: false };
            if (current_contents[0].series.includes("Plate")) {
                current_vessel.type = "WellPlate";
                for (let i = 0; i < current_contents.length; i++) {
                    if (current_contents[i].row + 1 > current_vessel.rows) {
                        current_vessel.rows = current_contents[i].row + 1;
                    }
                    if (current_contents[i].col + 1 > current_vessel.cols) {
                        current_vessel.cols = current_contents[i].col;
                    }
                }
                if (current_vessel.rows * current_vessel.cols >= 384) { current_vessel.title = "384"; current_vessel.rows = 16; current_vessel.cols = 24; }
                else if (current_vessel.rows * current_vessel.cols >= 96) { current_vessel.title = "96"; current_vessel.rows = 8; current_vessel.cols = 12; }
                else if (current_vessel.rows * current_vessel.cols >= 48) { current_vessel.title = "48"; current_vessel.rows = 6; current_vessel.cols = 8; }
                else if (current_vessel.rows * current_vessel.cols >= 4) { current_vessel.title = "4"; current_vessel.rows = 2; current_vessel.cols = 2; }
                else { current_vessel.title = "4"; current_vessel.rows = 2; current_vessel.cols = 2; }
            } else if (current_contents[0].series.includes("Slide")) {
                current_vessel.type = "Slide";
            } else if (current_contents[0].series.includes("Dish")) {
                current_vessel.type = "Dish";
            } else if (current_contents[0].series.includes("Wafer")) {
                current_vessel.type = "Wafer";
            }
            setCurrentVessel(current_vessel);
        }
    }, [props.content])

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
                case 'WellPlate':
                    return <WellPlates content={contents} width={width} rows={currentVessel.rows} cols={currentVessel.cols} showName={currentVessel.showName} showNumber={currentVessel.showNumber} />;
                case 'Wafer':
                    return <Wafers width={width} size={currentVessel.size} />;
                default:
                    return;
            }
        }
    }

    return (
        <Card ref={ref}>
            <div className="d-flex common-border">
                <h6 className='mb-0'> {currentVessel.title} - {currentVessel.type}</h6>
            </div>
            {renderVessel()}
            <SelectDialog currentVessel={currentVesselId} open={showSelectDialog} closeDialog={() => { setShowSelectDialog(false) }} changeVessel={(id) => { setCurrentVesselId(id); setCurrentVessel(getVesselById(id)); }} />
            <ExpansionDialog currentVessel={currentVesselId} open={showExpansionDialog} closeDialog={() => { setShowExpansionDialog(false) }} />
            <div className="d-flex justify-content-around align-items-center common-border">
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
        </Card >
    );
}

export default connect(mapStateToProps)(Vessel);