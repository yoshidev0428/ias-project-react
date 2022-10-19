import * as React from 'react';
import { Button } from 'react-bootstrap';
import SmallCard from "../custom/SmallCard";
import TabItem from '../custom/TabItem';
// import Divider from '@mui/material/Divider';
// import CustomButton from "../custom/CustomButton";
// import {
//     mdiCloudUploadOutline,
//     mdiMicrosoftExcel,
//     mdiFileDelimitedOutline,
//     mdiFileCodeOutline,
//     mdiChartTimelineVariantShimmer,
//     mdiTabletDashboard
// } from '@mdi/js'

export default function ReportTab() {
    const onClick1 = () => {
        console.log("onClick Cloud")
    }
    const onClick2 = () => {
        console.log("onClick Excel")
    }
    const onClick3 = () => {
        console.log("onClick CSV")
    }
    const onClick4 = () => {
        console.log("onClick Save As")
    }
    const onClick5 = () => {
        console.log("onClick Visual")
    }
    const onClick6 = () => {
        console.log("onClick Tableau")
    }
    const onClick7 = () => {
        console.log("onClick Stop")
    }
    const onClick8 = () => {
        console.log("onClick Stop")
    }
    const onClick9 = () => {
        console.log("onClick Stop")
    }
    const onClick10 = () => {
        console.log("onClick Stop")
    }
    return (
        <>
            <TabItem title="Report">
                <p className='mt-4'>Measure Setting</p>
                <SmallCard title="Measure Contents">
                    <Button className="btn btn-light btn-sm w-16" onClick={onClick1}>Mi</Button>
                    <Button className="btn btn-light btn-sm w-16" onClick={onClick2}>Ss</Button>
                    <Button className="btn btn-light btn-sm w-16" onClick={onClick3}>S</Button>
                    <Button className="btn btn-light btn-sm w-16" onClick={onClick4}>C</Button>
                    <Button className="btn btn-light btn-sm w-16" onClick={onClick5}>L</Button>
                    <Button className="btn btn-light btn-sm w-16" onClick={onClick6}>S</Button>
                </SmallCard>
                <SmallCard title="Method Save">
                </SmallCard>
                <SmallCard title="Go">
                    <Button className="btn btn-light btn-sm w-16" onClick={onClick7}>Go</Button>
                    <Button className="btn btn-light btn-sm w-16" onClick={onClick8}>Stop</Button>
                    <Button className="btn btn-light btn-sm w-16" onClick={onClick9}>Save</Button>
                    <Button className="btn btn-light btn-sm w-16" onClick={onClick10}>Cancel</Button>
                </SmallCard>
                <p className='mt-4'>Measure Information</p>
                <SmallCard title="">
                </SmallCard>
            </TabItem>
        </>
    );
};
