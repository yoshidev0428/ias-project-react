import SmallCard from '@/components/custom/SmallCard';
import CustomButton from '@/components/custom/CustomButton';
import { mdiPlayCircle, mdiCog } from '@mdi/js';
export default function DPC() {
  const select1 = () => {
    console.log('Select-1');
  };
  const select2 = () => {
    console.log('Select-2');
  };
  return (
    <SmallCard title="Digital Phase Contrast">
      <CustomButton icon={mdiPlayCircle} label="Go" click={select1} />
      <CustomButton icon={mdiCog} label="Set" click={select2} />
    </SmallCard>
  );
}
