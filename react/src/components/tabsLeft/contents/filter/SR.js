import SmallCard from '../../../custom/SmallCard'
import CustomButton from '../../../custom/CustomButton'
import {
    mdiPlayCircle,
    mdiCog,
    mdiFormatAlignCenter
}  from '@mdi/js'

import SuperDialog from "./dialog/SuperDialog";
import {useFlagsStore} from "../../../../components/state";
export default function SR(){
    const Superflag = useFlagsStore(store => store.Superflag);
    const select1 = () => {
        console.log("Select-1");
        useFlagsStore.setState({ Superflag: true });
    }
    const select2 = () => {
        console.log("Select-2")
    }
    return (
        <>
            <SmallCard title="Super Resolution">
                <CustomButton icon={mdiPlayCircle} label="Go" click={select1}/>
                <CustomButton icon={mdiFormatAlignCenter} label="Alignment" click={select1}/>
                <CustomButton icon={mdiCog} label="Setting" click={select2}/>
            </SmallCard>
            {Superflag && <SuperDialog/>}
        </>
    )
}