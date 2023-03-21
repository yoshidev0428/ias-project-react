import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';
import { mdiCog, mdiRuler, mdiGrid } from '@mdi/js';
export default function Scale() {
  const select1 = () => {};
  const select2 = () => {};
  const select3 = () => {};
  return (
    <div className="">
      <SmallCard title="Scale">
        <CustomButton icon={mdiRuler} label="ScaleBar" click={select1} />
        <CustomButton icon={mdiGrid} label="Grid" click={select2} />
        <CustomButton icon={mdiCog} label="Set" click={select3} />
      </SmallCard>
    </div>
  );
}
