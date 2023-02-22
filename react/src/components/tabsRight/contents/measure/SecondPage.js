import * as React from "react";
import Divider from "@mui/material/Divider";
import Vessel from "../viewcontrol/Vessel";
import Objective from "../viewcontrol/Objective";
import Channel from "../viewcontrol/Channel";
import RectangleSelect from "../viewcontrol/RectangleSelect";
import SmallCard from "../../../custom/SmallCard";
import ImageAdjust from "../viewcontrol/ImageAdjust";
import ZPosition from "../viewcontrol/ZPosition";
import Timeline from "../viewcontrol/Timeline";

export default function SecondPage() {
  return (
    <>
      <p>Range Setting1</p>
      <div>
        <Vessel />
        <RectangleSelect />
        <Objective />
        <Divider />
        <Channel />
        <ImageAdjust />
        <ZPosition />
        <Timeline />
        <SmallCard title="Range Information"></SmallCard>
      </div>
    </>
  );
}
