import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'
import {
    mdiCog,
    mdiHdr,
} from '@mdi/js';
import { Image } from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';
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
                <IconButton className="mb-1"
                    // style = {{minWidth:"16px", height:props.label ? '38px' : '28px', color:'#009688'}}
                    style={{ minWidth: "25px", height: '25px', color: '#212529' }}
                    onClick={select1}
                    size="large"
                >
                    <div className="">
                        <Image style={{ margin: '0 auto', width: '15px', height: '15px' }} src={require("../../../../assets/images/auto.png")} alt='no image' />
                    </div>
                </IconButton>
                <IconButton className="mb-1"
                    // style = {{minWidth:"16px", height:props.label ? '38px' : '28px', color:'#009688'}}
                    style={{ minWidth: "25px", height: '22px', color: '#212529' }}
                    onClick={select2}
                    size="large"
                >
                    <div className="">
                        <Image style={{ margin: '0 auto', width: '15px', height: '15px' }} src={require("../../../../assets/images/average.png")} alt='no image' />
                    </div>
                </IconButton>
                <CustomButton icon={mdiHdr} label="" click={select3} />
                <CustomButton icon={mdiCog} label="" click={select4} />
            </SmallCard>
        </div>
    )
}