import * as React from 'react';
import { Container } from 'react-bootstrap';
import Divider from '@mui/material/Divider';
import Vessel from "../viewcontrol/Vessel";
import Objective from "../viewcontrol/Objective";
import Channel from "../viewcontrol/Channel";
import ImageAdjust from "../viewcontrol/ImageAdjust";
import ZPosition from "../viewcontrol/ZPosition";
import Timeline from "../viewcontrol/Timeline";

export default function SecondPage () {

  return (
    <>
      <Container className="pa-0">
        <Vessel />
        <Divider/>
        <Objective />
        <Divider/>
        <Channel />
        <Divider/>
        <ImageAdjust />
        <Divider/>
        <ZPosition />
        <Divider/>
        <Timeline />
      </Container>
    </>
  );
};
