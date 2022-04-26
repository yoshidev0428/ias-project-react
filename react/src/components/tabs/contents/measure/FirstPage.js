import * as React from 'react';
import Divider from '@mui/material/Divider';
import { Container } from 'react-bootstrap';
import SmallCard from "../../../custom/SmallCard";
import CustomButton from "../../../custom/CustomButton";
import {
    mdiBookOpenPageVariant,
    mdiPlayCircle,
    mdiCube,
    mdiLayers,
    mdiCubeOutline,
    mdiLayersOutline
} from '@mdi/js'

export default function FirstPage() {
    const onClick1 = () => {
        console.log("onClick Set Call")
    }
    const onClick2 = () => {
        console.log("onClick Go")
    }
    const onClick3 = () => {
        console.log("onClick Learning-Method DLCall")
    }
    const onClick4 = () => {
        console.log("onClick Learning-Method MLCall")
    }
    const onClick5 = () => {
        console.log("onClick Learning-Method Go")
    }
    const onClick6 = () => {
        console.log("onClick Object-Method DLCall")
    }
    const onClick7 = () => {
        console.log("onClick Object-Method MLCall")
    }
    return (
        <>
            <p>Method Setting</p>
            <div className="">
                <SmallCard title="Analysis Method">
                    <CustomButton icon={mdiBookOpenPageVariant} label="Setting Call" click={onClick1} />
                    <CustomButton icon={mdiPlayCircle} label="Go" click={onClick2} />
                </SmallCard>
                <SmallCard title="Learning Method">
                    <CustomButton icon={mdiCube} label="DLCall" click={onClick3} />
                    <CustomButton icon={mdiLayers} label="MLCall" click={onClick4} />
                    <CustomButton icon={mdiPlayCircle} label="Go" click={onClick5} />
                </SmallCard>
                <SmallCard title="Object Method">
                    <CustomButton icon={mdiCubeOutline} label="DLCall" click={onClick6} />
                    <CustomButton icon={mdiLayersOutline} label="MLCall" click={onClick7} />
                </SmallCard>
                <SmallCard title="Method Information">
                </SmallCard>
            </div>
        </>
    );
};
