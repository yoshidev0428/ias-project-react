import React from 'react';
import SmallCard from '@/components/custom/SmallCard';
import { mdiPlayCircle, mdiCog } from '@mdi/js';
import Icon from '@mdi/react';
import Dec2dDialog from './dialog/Dec2dDialog';
import { useFlagsStore } from '@/state';

export default function Dec2D() {
  const dialogFlag = useFlagsStore((store) => store.dialogFlag);

  const select2 = () => {
    console.log('Select-2');
  };
  const show2Ddialog = () => {
    useFlagsStore.setState({ dialogFlag: true });
  };

  return (
    <div className="">
      <SmallCard title="2D Deconvolution">
        <button className="btn btn-light btn-sm w-50" onClick={show2Ddialog}>
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiPlayCircle}
          ></Icon>
          2DGo
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
          2DSet
        </button>
      </SmallCard>
      {dialogFlag && <Dec2dDialog />}
    </div>
  );
}
