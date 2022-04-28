import React from 'react';
// import { Container } from 'react-bootstrap';
// import Pagination from '@mui/material/Pagination';
// import Divider from '@mui/material/Divider';
import TabItem from "../custom/TabItem";
import Vessel from "./contents/viewcontrol/Vessel";
import Objective from "./contents/viewcontrol/Objective";
import Channel from "./contents/viewcontrol/Channel";
import ImageAdjust from "./contents/viewcontrol/ImageAdjust";
// import ImageSeries from "./contents/viewcontrol/ImageSeries";
import ZPosition from "./contents/viewcontrol/ZPosition";
import Timeline from "./contents/viewcontrol/Timeline";
// import DropzoneButton from "../viv/components/Controller/components/DropzoneButton";
// import LensSelect from "../viv/components/Controller/components/LensSelect";
// import Contoller from "../viv/components/Controller/"
export default function ViewTab() {

    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <>
            <TabItem title="View Control">
                {/* <Divider className='mt-2 mb-2' /> */}
                <Vessel />
                {/* <Divider className='mt-2 mb-2' /> */}
                <Objective />
                {/* <Divider className='mt-2 mb-2' />
                <LensSelect /> */}
                {/* <Divider className='mt-2 mb-2' /> */}
                <Channel />
                {/* <Divider className='mt-2 mb-2' /> */}
                <ImageAdjust />
                {/* <Divider className='mt-2 mb-2' /> */}
                <ZPosition />
                {/* <Divider className='mt-2 mb-2' /> */}
                <Timeline />
                {/* <Divider className='mt-2 mb-4' /> */}
            </TabItem>
        </>
    );
};
