import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import Button from '@mui/material/Button';
import { useFlagsStore } from '@/state';
import BasicDialog from './dialog/BasicDialog';
import CustomDialog from './dialog/CustomDialog';
import CustomNameDialog from './dialog/CustomNameDialog';
import CellposeDialog from './dialog/CellposeDialog';
export default function MethodSelect() {
  const DialogCellposeFlag = useFlagsStore((store) => store.DialogCellposeFlag);
  const DialogBasicFlag = useFlagsStore((store) => store.DialogBasicFlag);
  const DialogCustomFlag = useFlagsStore((store) => store.DialogCustomFlag);
  const DialogCustomNameFlag = useFlagsStore(
    (store) => store.DialogCustomNameFlag,
  );

  const showBasicDialog = () => {
    useFlagsStore.setState({ DialogBasicFlag: true });
  };
  const showCustomDialog = () => {
    useFlagsStore.setState({ DialogCustomFlag: true });
  };
  const onCall = () => {
    useFlagsStore.setState({ DialogLockFlag: true });
  };

  return (
    <div className="">
      <SmallCard title="Method Select">
        <Button
          style={{ color: 'rgb(15, 150, 136)' }}
          onClick={showBasicDialog}
        >
          Basic
        </Button>
        <Button style={{ color: 'rgb(15, 150, 136)' }} onClick={onCall}>
          Advance
        </Button>
        <Button
          style={{ color: 'rgb(15, 150, 136)' }}
          onClick={showCustomDialog}
        >
          Custom
        </Button>
      </SmallCard>
      {DialogBasicFlag && <BasicDialog />}
      {DialogCellposeFlag && <CellposeDialog />}
      {DialogCustomNameFlag && <CustomNameDialog />}
      {DialogCustomFlag && <CustomDialog />}
    </div>
  );
}
