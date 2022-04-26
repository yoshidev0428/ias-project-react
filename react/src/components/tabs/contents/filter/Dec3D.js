import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'
import {
    mdiPlayCircle,
    mdiCog
}  from '@mdi/js'

import Dec3dDialog from "./dialog/Dec3dDialog";
import {useFlagsStore} from "../../../../components/state";

export default function Dec3D(){
    const Dialog3dflag = useFlagsStore(store => store.Dialog3dflag);
    const select1 = () => {
        console.log("Select-1")
        useFlagsStore.setState({ Dialog3dflag: true });
    }
    const select2 = () => {
        console.log("Select-2")
    }
    return (
        <div className=''>
            <SmallCard title="3D Deconvolution">
                <CustomButton icon={mdiPlayCircle} label="3DGo" click={select1}/>
                <CustomButton icon={mdiCog} label="3DSet" click={select2}/>
            </SmallCard>
            {Dialog3dflag && <Dec3dDialog/>}
        </div>
    )
}