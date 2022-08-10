import SmallCard from '../../../custom/SmallCard'
// import CustomButton from '../../../custom/CustomButton'
import {
    mdiPlayCircle,
    mdiCog
} from '@mdi/js'
import Icon from '@mdi/react';
import * as React from 'react';
import Dec2dDialog from "./dialog/Dec2dDialog";
import { useFlagsStore } from "../../../state";

export default function Dec2D() {

    const dialogFlag = useFlagsStore(store => store.dialogFlag);

    const select2 = () => {
        console.log("Select-2")
    }
    const show2Ddialog = () => {
        useFlagsStore.setState({ dialogFlag: true });
    };

    return (
        <div className=''>
            <SmallCard title="2D Deconvolution">
                <button className="btn btn-light btn-sm w-50" onClick={show2Ddialog}>
                    <Icon size={0.8}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529" 
                        path={mdiPlayCircle}>
                    </Icon>2DGo
                </button>
                <button className="btn btn-light btn-sm w-50" onClick={select2}>
                    <Icon size={0.8}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiCog}>
                    </Icon>2DSet
                </button>
                {/* <CustomButton icon={mdiPlayCircle} label="2DGo" click={show2Ddialog} />
                <CustomButton icon={mdiCog} label="2DSet" click={select2} /> */}
            </SmallCard>
            {dialogFlag && <Dec2dDialog />}
        </div>
    )
}