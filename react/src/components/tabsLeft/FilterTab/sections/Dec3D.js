import SmallCard from '@/components/custom/SmallCard';
import { mdiPlayCircle, mdiCog } from '@mdi/js';
import Icon from '@mdi/react';
import Dec3dDialog from '../dialogs/Dec3dDialog';
import { useFlagsStore } from '@/state';

export default function Dec3D() {
  const Dialog3dflag = useFlagsStore((store) => store.Dialog3dflag);
  const select1 = () => {
    useFlagsStore.setState({ Dialog3dflag: true });
  };
  const select2 = () => {};
  return (
    <div className="">
      <SmallCard title="3D Deconvolution">
        <button className="btn btn-light btn-sm w-50" onClick={select1}>
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiPlayCircle}
          ></Icon>
          3DGo
        </button>
        <button className="btn btn-light btn-sm w-50" onClick={select2}>
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiCog}
          ></Icon>
          3DSet
        </button>
        {/* <CustomButton icon={mdiPlayCircle} label="3DGo" click={select1} />
                <CustomButton icon={mdiCog} label="3DSet" click={select2} /> */}
      </SmallCard>
      {Dialog3dflag && <Dec3dDialog />}
    </div>
  );
}
