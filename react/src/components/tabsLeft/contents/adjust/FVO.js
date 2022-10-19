import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'
import { 
    mdiCog,
    mdiChartAreaspline,
    mdiContrastCircle,
    mdiAlphaWBoxOutline,
    mdiAlphaBBoxOutline
} from '@mdi/js';
export default function FVO(){
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
        <SmallCard title="Field of View Optimization">
          <CustomButton icon={mdiChartAreaspline} label="AVG" click={select1}/>
          <CustomButton icon={mdiContrastCircle} label="DPC" click={select2}/>
          <CustomButton icon={mdiAlphaWBoxOutline} label="WB" click={select3}/>
          <CustomButton icon={mdiAlphaBBoxOutline} label="BB" click={select4}/>
          <CustomButton icon={mdiCog} label="Set" click={select5}/>
        </SmallCard>
    )
}