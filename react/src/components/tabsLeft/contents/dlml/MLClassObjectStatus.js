import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import CustomButton from '@/components/custom/CustomButton';
import {
  mdiSquareRoundedOutline,
  mdiPaletteOutline,
  mdiPaletteSwatchOutline,
  mdiCog,
} from '@mdi/js';

const onArea = () => {
  // console.log("onArea");
};
const onColor = () => {
  // console.log("onColor");
};
const onInt = () => {
  // console.log("onInt");
};
const onSet = () => {
  // console.log("onSet");
};

export default function ClassObjectStatus() {
  return (
    <div className="common-border">
      <SmallCard title="Class & Object Status">
        <CustomButton
          icon={mdiSquareRoundedOutline}
          label="Area"
          onClick={() => onArea}
        />
        <CustomButton
          icon={mdiPaletteOutline}
          label="Color"
          onClick={() => onColor()}
        />
        <CustomButton
          icon={mdiPaletteSwatchOutline}
          label="Int"
          onClick={() => onInt()}
        />
        <CustomButton icon={mdiCog} label="Set" onClick={() => onSet} />
      </SmallCard>
    </div>
  );
}
