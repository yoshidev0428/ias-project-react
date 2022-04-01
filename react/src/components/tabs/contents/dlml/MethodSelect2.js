import React from 'react'
import SmallCard from "../../../custom/SmallCard"
import CustomButton from "../../../custom/CustomButton"
import { 
    mdiPlusBox,
    mdiPlayBox
} from '@mdi/js';
export default function MethodSelect () {
    const onNew = () => {
        console.log("New")
    }
    const onCall = () => {
        console.log("Call")
    }

    return (
        <>
            <SmallCard title="Method Select">
                <CustomButton icon={mdiPlusBox} label="New" onClick={() => onNew()} />
                <CustomButton icon={mdiPlayBox} label="Call" onClick={() => onCall()} />
            </SmallCard>
        </>
    )
}