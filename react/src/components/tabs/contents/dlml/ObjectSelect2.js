import React from 'react'
import SmallCard from "../../../custom/SmallCard"
import CustomButton from "../../../custom/CustomButton"
import { 
    mdiLightbulbOutline,
    mdiLightbulb,
    mdiGestureTap,
    mdiLayersTriple,
    mdiGestureTapButton,
    mdiCog
} from '@mdi/js';
export default function ObjectSelect () {

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
        <>
            <div className="card pa-1">
                <h6>Object Select</h6>
                <SmallCard title="Object Brightness" child={true} >
                    <CustomButton icon={mdiLightbulbOutline} label="Light" onClick={() => onLight()} />
                    <CustomButton icon={mdiLightbulb} label="Black" onClick={() => onBlack()} />
                </SmallCard>
            </div>
            <SmallCard title="Select Target" child={true}>
                <CustomButton icon={mdiGestureTap} label="Object" onClick={() => onObject()} />
                <CustomButton icon={mdiLayersTriple} label="Area" onClick={() => onArea()} />
                <CustomButton icon={mdiGestureTapButton} label="Back" onClick={() => onBack()} />
                <CustomButton icon={mdiCog} label="Set" onClick={() => onSet()} />
            </SmallCard>
        </>
    )
}