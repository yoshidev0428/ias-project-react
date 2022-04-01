import React from 'react'
import SmallCard from "../../../custom/SmallCard"
import CustomButton from "../../../custom/CustomButton"
import { 
    mdiPlayCircleOutline,
    mdiThumbUpOutline,
    mdiThumbDownOutline,
    mdiKeyboardReturn
} from '@mdi/js';
export default function Judge () {
    const onGo = () => {
        console.log("Go")
    }
    const onGood = () => {
        console.log("Good")
    }
    const onNo = () => {
        console.log("No")
    }
    const onReturn = () => {
        console.log("Return")
    }

    return (
        <>
            <SmallCard title="Judge">
                <CustomButton icon={mdiPlayCircleOutline} label="Go" onClick={() => onGo()} />
                <CustomButton icon={mdiThumbUpOutline} label="Good" onClick={() => onGood()} />
                <CustomButton icon={mdiThumbDownOutline} label="No" onClick={() => onNo()} />
                <CustomButton icon={mdiKeyboardReturn} label="Return" onClick={() => onReturn()} />
            </SmallCard>
        </>
    )
}

