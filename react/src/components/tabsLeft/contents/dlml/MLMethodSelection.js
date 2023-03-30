import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';
import { mdiPlusBox, mdiPlayBox } from '@mdi/js';
import { useFlagsStore } from '@/state';
import MLMethodSelectDialog from './dialog/MLMethodSelectDialog';
import MLMethodAddDialog from './dialog/MLMethodAddDialog';

export default function MLMethodSelection() {
  const showMLDialogMethodSelect = () => {
    useFlagsStore.setState({ MLDialogMethodSelectFlag: true });
  };
  const showMLDialogMethodAdd = () => {
    useFlagsStore.setState({ MLDialogMethodAddFlag: true });
  };
  // const closeMLDialogMethodSelect = () => {
  //   useFlagsStore.setState({MLDialogMethodSelecFlag: false})
  // }

  return (
    <SmallCard title="Method Selection">
      <div
        className="d-flex flex-row justify-content-around  w-100"
        style={{ paddingBottom: '4px' }}
      >
        <CustomButton
          icon={mdiPlusBox}
          label={`New`}
          click={() => showMLDialogMethodAdd()}
        />
        <CustomButton
          icon={mdiPlayBox}
          label={`Set`}
          click={() => showMLDialogMethodSelect()}
        />
      </div>
      {<MLMethodAddDialog />}
      {<MLMethodSelectDialog />}
    </SmallCard>
  );
}
