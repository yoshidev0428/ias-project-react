import React from 'react'
import SmallCard from "../../../custom/SmallCard"
import CustomButton from "../../../custom/CustomButton"
import { 
    mdiNearMe,
    mdiPencil,
    mdiCheckboxBlankCircleOutline,
    mdiDotsVertical,
    mdiVectorRectangle,
    mdiSquareEditOutline,
    mdiTrashCanOutline
} from '@mdi/js';
export default function BoxSelect () {
    const select1 = () => {
        console.log("Select-1");
    }
    const select2 = () => {
        console.log("Select-2");
    }
    const select3 = () => {
        console.log("Select-3");
    }
    const select4 = () => {
        console.log("Select-4");
    }
    const select5 = () => {
        console.log("Select-5");
    }
    const select6 = () => {
        console.log("Select-6");
    }
    const select7 = () => {
        console.log("Select-7")
    }
    return (
        <SmallCard title="Box Select">
            <CustomButton icon={mdiNearMe} onClick={() => select1()}/>
            <CustomButton icon={mdiPencil} onClick={() => select2()}/>
            <CustomButton icon={mdiCheckboxBlankCircleOutline} onClick={() => select3()}/>
            <CustomButton icon={mdiDotsVertical} onClick={() => select4()}/>
            <CustomButton icon={mdiVectorRectangle} onClick={() => select5()}/>
            <CustomButton icon={mdiSquareEditOutline} onClick={() => select6()}/>
            <CustomButton icon={mdiTrashCanOutline} onClick={() => select7()}/>
        </SmallCard>
    )
}