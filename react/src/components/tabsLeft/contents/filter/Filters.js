import SmallCard from '../../../custom/SmallCard';
import { mdiFilter } from '@mdi/js';
import Icon from '@mdi/react';
import { useFlagsStore } from '@/state';
import Filter2dDialog from './dialog/Filter2dDialog';
import Filter3dDialog from './dialog/Filter3dDialog';

export default function Filters() {
  const DialogFilter2dflag = useFlagsStore((store) => store.DialogFilter2dflag);
  const DialogFilter3dflag = useFlagsStore((store) => store.DialogFilter3dflag);

  const select1 = () => {
    useFlagsStore.setState({ DialogFilter2dflag: true });
  };

  const select2 = () => {
    useFlagsStore.setState({ DialogFilter3dflag: true });
  };
  return (
    <div className="">
      <SmallCard title="Filter">
        <button className="btn btn-light btn-sm w-50" onClick={select1}>
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiFilter}
          ></Icon>
          2D
        </button>
        <button className="btn btn-light btn-sm w-50" onClick={select2}>
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiFilter}
          ></Icon>
          3D
        </button>
        {DialogFilter2dflag && <Filter2dDialog />}
        {DialogFilter3dflag && <Filter3dDialog />}
      </SmallCard>
    </div>
  );
}
