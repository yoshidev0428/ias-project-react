import * as React from 'react';
import SmallCard from "../../../custom/SmallCard";
import ImageAdjust from "../../contents/viewcontrol/ImageAdjust";
import ZPosition from "../../contents/viewcontrol/ZPosition";
import Timeline from "../../contents/viewcontrol/Timeline";

export default function ThirdPage() {
    return (
        <>
            <p>Range Setting2</p>
            <ImageAdjust />
            <ZPosition />
            <Timeline />
            <SmallCard title="Range Information">
            </SmallCard>
        </>
    );
};
