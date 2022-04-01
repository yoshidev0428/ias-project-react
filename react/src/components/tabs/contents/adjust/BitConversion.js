import React from 'react'
import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'

export default function BitConversion() {

    const select1 = () => {
        console.log("Select-1")
    }

    const select2 = () => {
        console.log("Select-2")
    }

    const select3 = () => {
        console.log("Select-3")
    }

    const select4 = () => {
        console.log("Select-4")
    }

    const select5 = () => {
        console.log("Select-5")
    }

    const select6 = () => {
        console.log("Select-6")
    }

    return (
        <SmallCard title="Box Select" >
            <CustomButton image="mono" label="8" click={select1}/>
            <CustomButton image="mono" label="16" click={select2}/>
            <CustomButton image="mono" label="32" click={select3}/>
            <CustomButton image="color" label="8" click={select4}/>
            <CustomButton image="color" label="16" click={select5}/>
            <CustomButton image="color" label="32" click={select6}/>
      </SmallCard>
    )
}