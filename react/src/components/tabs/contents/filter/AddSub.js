import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'

import {
  mdiPlusThick,
  mdiMinusThick,
  mdiCheckCircle,
  mdiTuneVariant
}  from '@mdi/js'
export default function AddSub(){

    
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
    return (
      <SmallCard title="Addition / Subtraction">
          <CustomButton icon={mdiPlusThick} label="Add" click={select1}/>
          <CustomButton icon={mdiMinusThick} label="Sub" click={select2}/>
          <CustomButton icon={mdiCheckCircle} label="Correction" click={select3}/>
          <CustomButton icon={mdiTuneVariant} label="Options" click={select4}/>
      </SmallCard>
    )
}