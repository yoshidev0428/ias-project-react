import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';
import { useFlagsStore } from '@/state';
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
  const select1 = async () => {};
  const select2 = async () => {};
  const select3 = async () => {};
  const select4 = () => {};
  const select5 = async () => {};
  const select6 = () => {};
  const select7 = () => {};
  return (
    <div className="">
      <SmallCard title="Box &#38; Select">
        <div className="d-flex flex-row justify-content-around w-100 ">
          <CustomButton icon={mdiNearMe} click={() => select1()} />
          <CustomButton icon={mdiPencil} click={() => select2()} />
          <CustomButton
            icon={mdiCheckboxBlankCircleOutline}
            click={() => select3()}
          />
          <CustomButton icon={mdiDotsVertical} click={() => select4()} />
          <CustomButton icon={mdiVectorRectangle} click={() => select5()} />
          <CustomButton icon={mdiSquareEditOutline} click={() => select6()} />
          <CustomButton icon={mdiTrashCanOutline} click={() => select7()} />
        </div>
      </SmallCard>
    </div>
  );
}
