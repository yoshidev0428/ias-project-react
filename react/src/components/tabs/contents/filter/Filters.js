import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'
import {
    mdiNumeric2Box,
    mdiNumeric3Box
} from '@mdi/js';

export default function Filters(){
    
    const select1 = () => {
        console.log("Select-1")
        
    }
    const select2 = () => {
        console.log("Select-2")
    }
    return (
        <div className=''>
            <SmallCard title="Filter">
                <CustomButton icon={mdiNumeric2Box} label="" click={select1}/>
                <CustomButton icon={mdiNumeric3Box} label="" click={select2}/>
            </SmallCard>
        </div>
    )
}