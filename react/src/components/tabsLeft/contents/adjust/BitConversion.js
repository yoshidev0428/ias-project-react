import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';

export default function BitConversion() {
  const select1 = () => {};

  const select2 = () => {};

  const select3 = () => {};

  const select4 = () => {};

  const select5 = () => {};

  const select6 = () => {};

  return (
    <div className="">
      <SmallCard title="Box Select">
        <CustomButton image="mono" label="8" click={select1} />
        <CustomButton image="mono" label="16" click={select2} />
        <CustomButton image="mono" label="32" click={select3} />
        <CustomButton image="color" label="8" click={select4} />
        <CustomButton image="color" label="16" click={select5} />
        <CustomButton image="color" label="32" click={select6} />
      </SmallCard>
    </div>
  );
}
