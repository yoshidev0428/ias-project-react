import React from 'react'
import SmallCard from "../../../custom/SmallCard"
import CustomButton from "../../../custom/CustomButton"
import { 
    mdiCreation,
    mdiHandPointingUp,
    mdiTrashCanOutline
} from '@mdi/js';
export default function ObjectClass () {
    const onAuto = () => {
        console.log("Auto")
    }
    const onAdd = () => {
        console.log("Add")
    }
    const onErase = () => {
        console.log("Erase")
    }

    return (
        <>
            <SmallCard title="Method Select">
                <CustomButton icon={mdiCreation} label="Auto" onClick={() => onAuto()} />
                <CustomButton icon={mdiHandPointingUp} label="Add" onClick={() => onAdd()} />
                <CustomButton icon={mdiTrashCanOutline} label="Erase" onClick={() => onErase()} />
            </SmallCard>
        </>
    )
}