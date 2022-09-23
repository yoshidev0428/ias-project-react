import React from 'react'
import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'
import { 
    mdiEyeOutline,
    mdiUndo
} from '@mdi/js';
export default function Division(){

    const select1 = () => {
        console.log("Select-1")
    }

    const select2 = () => {
        console.log("Select-2")
    }

    return (
        <SmallCard title="Division">
            <CustomButton icon={mdiEyeOutline} label="view method" click={select1}/>
            <CustomButton icon={mdiUndo} label="undo" click={select2}/>
        </SmallCard>
    )
}