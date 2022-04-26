import React from 'react'
import SmallCard from "../../../custom/SmallCard"
import CustomButton from "../../../custom/CustomButton"
import { 
    mdiCalculator,
    mdiReplay,
    mdiArrowCollapseVertical
} from '@mdi/js';
export default function Count () {

    const onCount = () => {
        console.log("Count")
    }
    const onBack = () => {
        console.log("Back")
    }
    const onSplit = () => {
        console.log("Split")
    }
    return (
        <div className=''>
            <SmallCard title="Count">
                <CustomButton icon={mdiCalculator} label="Count" onClick={() => onCount()} />
                <CustomButton icon={mdiReplay} label="Back" onClick={() => onBack()} />  
                <CustomButton icon={mdiArrowCollapseVertical} label="Split" onClick={() => onSplit()} />                
            </SmallCard>
        </div>
    )
}