import * as React from 'react';
import { Button } from 'react-bootstrap';
import SmallCard from "../custom/SmallCard";
import TabItem from '../custom/TabItem';
import {CSVLink, CSVDownload} from 'react-csv';
import { useFlagsStore } from '../state';
import VisualDialog from './contents/report/VisualDialog'
// import Divider from '@mui/material/Divider';
import CustomButton from "../custom/CustomButton";
import { 
    mdiCloudOutline,
    mdiFileExcel,
    mdiFileExcelOutline,
    mdiFile,
    mdiEyeOutline,
    mdiTable
} from '@mdi/js';

// const dampleData = [{firstName}];

export default function ReportTab() {
    const DialogVisualFlag = useFlagsStore(store => store.DialogVisualFlag)

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
        console.log("onClick hdf5")
    }
    const onClick5 = () => {
        console.log("onClick Visual")
        useFlagsStore.setState({DialogVisualFlag: true})
    }
    const onClick6 = () => {
        console.log("onClick Tableau")
    }
    return (
        <TabItem title="Report">
            {/* <p className='mt-4'>Save</p> */}
            <SmallCard title="Save">
                <CustomButton icon={mdiCloudOutline} label="Cloud" click={onClick1} />
                <CustomButton icon={mdiFileExcel} label="Excel" click={onClick2} />
                <CustomButton icon={mdiFileExcelOutline} label="CSV" click={onClick3} />
                <CustomButton icon={mdiFile} label="hdf5" click={onClick4} />
            </SmallCard>
            {DialogVisualFlag&&<VisualDialog/>}
            {/* <p className='mt-4'>View</p> */}
            <SmallCard title="View">
                <CustomButton icon={mdiEyeOutline} label="visual" click={onClick5} />
                <CustomButton icon={mdiTable} label="tableau" click={onClick6} />
            </SmallCard>
        </TabItem>
    );
};
