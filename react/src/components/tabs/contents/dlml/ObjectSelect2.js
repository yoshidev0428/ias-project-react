import React from 'react'
import SmallCard from "../../../custom/SmallCard"
import CustomButton from "../../../custom/CustomButton"
import {
    mdiLightbulbOutline,
    mdiLightbulb,
    mdiGestureTap,
    mdiLayersTriple,
    mdiGestureTapButton,
    mdiTrashCanOutline
} from '@mdi/js';
export default function ObjectSelect() {

    const onLight = () => {
        console.log("Light");
    }
    const onBlack = () => {
        console.log("Black");
    }
    const onObject = () => {
        console.log("Object");
    }
    const onArea = () => {
        console.log("Area");
    }
    const onBack = () => {
        console.log("Back");
    }
    const onSet = () => {
        console.log("Set");
    }

    return (
        <div className='common-border'>
            <h6>Object Select</h6>
            <SmallCard title="Object brightness" child={true} >
                <CustomButton icon={mdiLightbulbOutline} label="LightOB" onClick={() => onLight()} />
                <CustomButton icon={mdiLightbulb} label="BlackOB" onClick={() => onBlack()} />
            </SmallCard>
            <div style={{ height: "12px" }}></div>
            <SmallCard title="Select target" child={true}>
                <CustomButton icon={mdiGestureTap} label="OB" onClick={() => onObject()} />
                <CustomButton icon={mdiLayersTriple} label="Area" onClick={() => onArea()} />
                <CustomButton icon={mdiGestureTapButton} label="BG" onClick={() => onBack()} />
                <CustomButton icon={mdiTrashCanOutline} label="" onClick={() => onSet()} />
            </SmallCard>
        </div>
    )
}