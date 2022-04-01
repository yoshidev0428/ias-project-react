import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'
import { 
    mdiCog,
    mdiCreation,
    mdiHdr,
    mdiThumbUpOutline
} from '@mdi/js';
export default function LightSet(){
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
        <SmallCard title="Light Set">
          <CustomButton icon={mdiCreation} label="Auto" click={select1}/>
          <CustomButton icon={mdiHdr} label="HDR" click={select2}/>
          <CustomButton icon={mdiThumbUpOutline} label="Go" click={select3}/>
          <CustomButton icon={mdiCog} label="Set" click={select4}/>
        </SmallCard>
    )
}