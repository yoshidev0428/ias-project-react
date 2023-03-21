import React from 'react';
import SmallCard from '../../../custom/SmallCard';
// import CustomButton from "../../../custom/CustomButton"
import RectangleButton from '../../../custom/RectangleButton';
import { mdiCalculator, mdiReplay, mdiArrowCollapseVertical } from '@mdi/js';
export default function Count() {
  const onCount = () => {};
  const onBack = () => {};
  const onSplit = () => {};
  return (
    <div className="">
      <SmallCard title="Count">
        <RectangleButton
          icon={mdiCalculator}
          label="Count"
          width="34"
          onClick={() => onCount()}
        ></RectangleButton>
        <RectangleButton
          icon={mdiReplay}
          label="Back"
          width="34"
          onClick={() => onBack()}
        ></RectangleButton>
        <RectangleButton
          icon={mdiArrowCollapseVertical}
          label="Split"
          width="34"
          onClick={() => onSplit()}
        ></RectangleButton>
        {/* <CustomButton icon={mdiCalculator} label="Count" onClick={() => onCount()} />
                <CustomButton icon={mdiReplay} label="Back" onClick={() => onBack()} />  
                <CustomButton icon={mdiArrowCollapseVertical} label="Split" onClick={() => onSplit()} />*/}
      </SmallCard>
    </div>
  );
}
