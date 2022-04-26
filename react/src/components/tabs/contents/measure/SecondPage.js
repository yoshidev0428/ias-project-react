import * as React from 'react';
import { Container } from 'react-bootstrap';
import Divider from '@mui/material/Divider';
import Vessel from "../viewcontrol/Vessel";
import Objective from "../viewcontrol/Objective";
import Channel from "../viewcontrol/Channel";

export default function SecondPage() {

    return (
        <>
            <p>Range Setting1</p>
            <div>
                <Vessel />
                {/* <Divider /> */}
                <Objective />
                <Divider />
                <Channel />
                <Divider />
            </div>
        </>
    );
};
