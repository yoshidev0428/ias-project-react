import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'
import { 
    mdiCog
} from '@mdi/js';
export default function MergeSplit(){
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
    return (
      <SmallCard title="MergeSplit" >
        <CustomButton image="mono" label="8" click={select1}/>
        <CustomButton image="mono" label="16" click={select2}/>
        <CustomButton image="mono" label="32" click={select3}/>
        <CustomButton icon={mdiCog} label="Set" click={select4}/>
      </SmallCard>
    )
}