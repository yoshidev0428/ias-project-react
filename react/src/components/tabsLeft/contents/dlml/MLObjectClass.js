import React from 'react';
import SmallCard from '../../../custom/SmallCard';
// import CustomButton from "../../../custom/CustomButton"
import {
  mdiCreation,
  mdiHandPointingUp,
  mdiTrashCanOutline,
  mdiPlusBox,
  mdiEraser,
} from '@mdi/js';
import RectangleButton from '../../../custom/RectangleButton';

export default function ObjectClass() {
  const onAuto = () => {};
  const onAdd = () => {};
  const onErase = () => {};

  return (
    <div className="">
      <SmallCard title="ObjectClass">
        <RectangleButton
          icon={mdiCreation}
          label="Auto"
          width="33"
          onClick={() => onAuto()}
        />
        <RectangleButton
          icon={mdiPlusBox}
          label="Add"
          width="33"
          onClick={() => onAdd()}
        />
        <RectangleButton
          icon={mdiEraser}
          label="Delete"
          width="34"
          onClick={() => onErase()}
        />
        {/* <CustomButton icon={mdiCreation} label="Auto" onClick={() => onAuto()} />
                <CustomButton icon={mdiHandPointingUp} label="Add" onClick={() => onAdd()} />
                <CustomButton icon={mdiTrashCanOutline} label="Erase" onClick={() => onErase()} /> */}
      </SmallCard>
    </div>
  );
}
