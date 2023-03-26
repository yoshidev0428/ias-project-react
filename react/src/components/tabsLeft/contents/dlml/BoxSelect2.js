import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';
import {
  mdiNearMe,
  mdiPencil,
  mdiCheckboxBlankCircleOutline,
  mdiDotsVertical,
  mdiVectorRectangle,
  mdiSquareEditOutline,
  mdiTrashCanOutline,
} from '@mdi/js';
export default function BoxSelect() {
  const select1 = () => {};
  const select2 = () => {};
  const select3 = () => {};
  const select4 = () => {};
  const select5 = () => {};
  const select6 = () => {};
  const select7 = () => {};
  return (
    <div className="">
      <SmallCard title="Box Select">
        <div className="d-flex flex-row justify-content-around w-100">
          <CustomButton icon={mdiNearMe} onClick={() => select1()} />
          <CustomButton icon={mdiPencil} onClick={() => select2()} />
          <CustomButton
            icon={mdiCheckboxBlankCircleOutline}
            onClick={() => select3()}
          />
          <CustomButton icon={mdiDotsVertical} onClick={() => select4()} />
          <CustomButton icon={mdiVectorRectangle} onClick={() => select5()} />
          <CustomButton icon={mdiSquareEditOutline} onClick={() => select6()} />
          <CustomButton icon={mdiTrashCanOutline} onClick={() => select7()} />
        </div>
      </SmallCard>
    </div>
  );
}
