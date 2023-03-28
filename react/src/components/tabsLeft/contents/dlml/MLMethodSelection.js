import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';
import { mdiPlusBox, mdiPlayBox } from '@mdi/js';
import { useFlagsStore } from '@/state';
import MLMethodSelectDialog from './dialog/MLMethodSelectDialog';

export default function MLMethodSelection() {
  const MLDialogMethodSelecFlag = useFlagsStore(
    (store) => store.MLDialogMethodSelecFlag,
  );
  const showMLDialogMethodSelect = () => {
    useFlagsStore.setState({ MLDialogMethodSelecFlag: true });
  };
  // const closeMLDialogMethodSelect = () => {
  //   useFlagsStore.setState({MLDialogMethodSelecFlag: false})
  // }

  const onCall = () => {};

  return (
    <SmallCard title="Method Selection">
      <div
        className="d-flex flex-row justify-content-around  w-100"
        style={{ paddingBottom: '4px' }}
      >
        <CustomButton
          icon={mdiPlusBox}
          click={() => showMLDialogMethodSelect()}
          onClick={() => showMLDialogMethodSelect()}
        />
        <CustomButton icon={mdiPlayBox} onClick={() => onCall()} />
      </div>
      {<MLMethodSelectDialog />}
    </SmallCard>
  );
}
