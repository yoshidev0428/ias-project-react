import React from 'react'
import SmallCard from "../../../custom/SmallCard"
// import CustomButton from "../../../custom/CustomButton"
import {
    mdiCreation,
    mdiHandPointingUp,
    mdiTrashCanOutline
} from '@mdi/js';
import Icon from '@mdi/react';
export default function ObjectClass() {
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
        <div className=''>
            <SmallCard title="ObjectClass">
                <button className="btn btn-light btn-sm w-33" onClick={onAuto}>
                    <Icon size={0.6}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiCreation}>
                    </Icon>Auto
                </button>
                <button className="btn btn-light btn-sm w-34" onClick={onAdd}>
                    <Icon size={0.6}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiHandPointingUp}>
                    </Icon>Add
                </button>
                <button className="btn btn-light btn-sm w-33" onClick={onErase}>
                    <Icon size={0.6}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiTrashCanOutline}>
                    </Icon>Erase
                </button>
                {/* <CustomButton icon={mdiCreation} label="Auto" onClick={() => onAuto()} />
                <CustomButton icon={mdiHandPointingUp} label="Add" onClick={() => onAdd()} />
                <CustomButton icon={mdiTrashCanOutline} label="Erase" onClick={() => onErase()} /> */}
            </SmallCard>
        </div>
    )
}