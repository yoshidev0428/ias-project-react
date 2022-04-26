import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'
import {
    mdiCog,
    mdiHdr,
} from '@mdi/js';
export default function LightSet() {
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
        <div className=''>
            <SmallCard title="Light Set">
                <CustomButton image={"auto"} label="" click={select1} />
                <CustomButton image={"average"} label="" click={select2} />
                <CustomButton icon={mdiHdr} label="" click={select3} />
                <CustomButton icon={mdiCog} label="" click={select4} />
            </SmallCard>
        </div>
    )
}