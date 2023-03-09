import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';
import { mdiPlayCircle, mdiCog, mdiFormatAlignCenter } from '@mdi/js';

import FocusDialog from './dialog/FocusDialog';
import { useFlagsStore } from '@/state';
export default function FocusStack() {
  const Focusflag = useFlagsStore((store) => store.Focusflag);
  const select1 = () => {
    console.log('Select-1');
    useFlagsStore.setState({ Focusflag: true });
  };
  const select2 = () => {
    console.log('Select-2');
  };
  return (
    <div className="">
      <SmallCard title="Focus Stack">
        <CustomButton icon={mdiPlayCircle} label="Go" click={select1} />
        <CustomButton
          icon={mdiFormatAlignCenter}
          label="Alignment"
          click={select1}
        />
        <CustomButton icon={mdiCog} label="Set" click={select2} />
      </SmallCard>
      {Focusflag && <FocusDialog />}
    </div>
  );
}
