import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Card from '@mui/material/Card';
import { getVesselById, VESSELS } from '../../../../utils/vessel-types';
import { useElementSize } from 'usehooks-ts';
import Dishes from '../../../vessels/Dishes';
import Slides from '../../../vessels/Slides';
import WellPlates from '../../../vessels/WellPlates';
import Wafers from '../../../vessels/Wafers';
import {
    mdiChevronLeft, 
    mdiChevronRight,
    mdiSyncAlert,
    mdiImageFilterCenterFocus,
} from '@mdi/js';
import Icon from '@mdi/react';
import { SelectDialog } from '../../../vessels/SelectDialog';
import { ExpansionDialog } from '../../../vessels/ExpansionDialog';
import {
    useViewerStore
} from '../../../viv/state';

const mapStateToProps = (state) => ({
    content: state.files.content,
})

const Vessel = (props) => {

    const [currentVesselId, setCurrentVesselId] = useState(1);
    const [currentVessel, setCurrentVessel] = useState(getVesselById(1));
    const [showSelectDialog, setShowSelectDialog] = useState(false);
    const [showExpansionDialog, setShowExpansionDialog] = useState(false);
    const [contents, setContents] = useState(props.content);
    const [ref, { width }] = useElementSize();

    const getCorrectVesselID = (seriesStr, maxRow, maxCol) => {
        let vesselID = 12;
        let currentVesselTypeGroup = [];
        for (let i = 0; i < VESSELS.length; i++) {
            if (seriesStr.includes(VESSELS[i][0].type)) {
                currentVesselTypeGroup = VESSELS[i];
                break;
            }
            if (seriesStr.includes("Plate") && VESSELS[i][0].type.includes("Plate")) {
                currentVesselTypeGroup = VESSELS[i];
                break;
            }
        }
        if (currentVesselTypeGroup.length > 0) {
            for (let i = 0; i < currentVesselTypeGroup.length; i++) {
                if (currentVesselTypeGroup[i].rows >= maxRow && currentVesselTypeGroup[i].cols >= maxCol) {
                    vesselID = currentVesselTypeGroup[i].id;
                    break;
                }
            }
        }
        return vesselID;
    }

    const changeVesselSeries = (direction) => {
        if ( direction ) {
            console.log("next");
        } else {
            console.log("previous");
        }
    }
    useEffect(() => {
        console.log("View Control Vessel.js : NEW CONTENT : ", props.content);
        if (props.content) {
            let current_contents = JSON.parse(JSON.stringify(props.content));
            setContents(JSON.parse(JSON.stringify(current_contents)));
            let current_vessel = { id: 12, type: "WellPlate", rows: 8, cols: 12, title: "96", showName: true };
            let maxRow = 0; let maxCow = 1;
            for (let i = 0; i < current_contents.length; i++) {
                if (current_contents[i].row > maxRow) maxRow = current_contents[i].row;
                if (current_contents[i].col > maxCow) maxCow = current_contents[i].col;
            }
            current_vessel = getVesselById(getCorrectVesselID(current_contents[0].series, maxRow + 1, maxCow));
            setCurrentVessel(current_vessel);
            setCurrentVesselId(current_vessel.id);
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
            <div className="d-flex align-items-center common-border">
                <button className='btn btn-light btn-sm' style={{ width: "50%" }} onClick={() => changeVesselSeries(false)}>
                    <Icon size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiChevronLeft}>
                    </Icon>
                </button>
                <button className='btn btn-light btn-sm' style={{ width: "50%" }} onClick={() => changeVesselSeries(true)}>
                    <Icon size={0.9}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiChevronRight}>
                    </Icon>
                </button>
            </div>
            <div className="d-flex common-border">
                <h6 className='mb-0'> {currentVessel.title} - {currentVessel.type}</h6>
            </div>
            {renderVessel()}
            <SelectDialog currentVessel={currentVesselId} open={showSelectDialog} closeDialog={() => { setShowSelectDialog(false) }} changeVessel={(id) => { setCurrentVesselId(id); setCurrentVessel(getVesselById(id)); }} />
            <ExpansionDialog currentVessel={currentVesselId} open={showExpansionDialog} closeDialog={() => { setShowExpansionDialog(false) }} />
            <div className="d-flex justify-content-around align-items-center common-border">
                <button className='btn btn-light btn-sm' style={{ width: "50%" }} onClick={() => setShowSelectDialog(true)}>
                    <Icon size={0.8}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiSyncAlert}>
                    </Icon>
                </button>
                <button className='btn btn-light btn-sm' style={{ width: "50%" }} onClick={() => setShowExpansionDialog(true)}>
                    <Icon size={0.8}
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