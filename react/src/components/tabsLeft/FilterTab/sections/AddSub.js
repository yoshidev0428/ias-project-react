import SmallCard from '@/components/custom/SmallCard';
import CustomButton from '@/components/custom/CustomButton';

import {
  mdiCalculator,
  mdiMinusThick,
  mdiCheckCircle,
  mdiTuneVariant,
} from '@mdi/js';
export default function AddSub() {
  const select1 = () => {
    console.log('Select-1');
  };
  const select2 = () => {
    console.log('Select-2');
  };
  const select3 = () => {
    console.log('Select-3');
  };
  const select4 = () => {
    console.log('Select-4');
  };
  return (
    <div className="">
      <SmallCard title="Addition&Subtraction">
        <CustomButton icon={mdiCalculator} label="" click={select1} />
        <CustomButton icon={mdiMinusThick} label="" click={select2} />
        <CustomButton icon={mdiCheckCircle} label="" click={select3} />
        <CustomButton icon={mdiTuneVariant} label="" click={select4} />
      </SmallCard>
    </div>
  );
}
