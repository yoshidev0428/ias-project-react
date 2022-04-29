import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'
import {
    mdiFilter,
} from '@mdi/js';
import Icon from '@mdi/react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
export default function Filters() {

    const select1 = () => {
        console.log("Select-1")

    }
    const select2 = () => {
        console.log("Select-2")
    }
    return (
        <div className=''>
            <SmallCard title="Filter">
                <button className="btn btn-light btn-sm w-50" onClick={select1}>
                    <Icon size={0.8}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiFilter}>
                    </Icon>2D
                </button>
                <button className="btn btn-light btn-sm w-50" onClick={select2}>
                    <Icon size={0.8}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiFilter}>
                    </Icon>3D
                </button>
                {/* <CustomButton icon={mdiNumeric2Box} label="" click={select1}/>
                <CustomButton icon={mdiNumeric3Box} label="" click={select2}/> */}
            </SmallCard>
        </div>
    )
}