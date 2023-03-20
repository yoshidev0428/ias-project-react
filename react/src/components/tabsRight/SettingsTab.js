import * as React from 'react';
import { Button } from 'react-bootstrap';
import SmallCard from '../custom/SmallCard';
import TabItem from '../custom/TabItem';
// import Divider from '@mui/material/Divider';
// import Channnels from "./contents/Settings/ChannelSettings";
// import Objective from './contents/viewcontrol/Objective';

export default function SettingsTab() {
  const onClick1 = () => {};
  const onClick2 = () => {};
  const onClick3 = () => {};
  const onClick4 = () => {};
  const onClick5 = () => {};
  const onClick6 = () => {};
  const onClick7 = () => {};
  const onClick8 = () => {};
  const onClick9 = () => {};
  const onClick10 = () => {};

  return (
    <>
      <TabItem title="Setting">
        <p className="mt-4">Measure Setting</p>
        <SmallCard title="Measure Contents">
          <Button className="btn btn-light btn-sm w-16" onClick={onClick1}>
            Mi
          </Button>
          <Button className="btn btn-light btn-sm w-16" onClick={onClick2}>
            Ss
          </Button>
          <Button className="btn btn-light btn-sm w-16" onClick={onClick3}>
            S
          </Button>
          <Button className="btn btn-light btn-sm w-16" onClick={onClick4}>
            C
          </Button>
          <Button className="btn btn-light btn-sm w-16" onClick={onClick5}>
            L
          </Button>
          <Button className="btn btn-light btn-sm w-16" onClick={onClick6}>
            S
          </Button>
        </SmallCard>
        <SmallCard title="Method Save"></SmallCard>
        <SmallCard title="Go">
          <Button className="btn btn-light btn-sm w-16" onClick={onClick7}>
            Go
          </Button>
          <Button className="btn btn-light btn-sm w-16" onClick={onClick8}>
            Stop
          </Button>
          <Button className="btn btn-light btn-sm w-16" onClick={onClick9}>
            Save
          </Button>
          <Button className="btn btn-light btn-sm w-16" onClick={onClick10}>
            Cancel
          </Button>
        </SmallCard>
        <p className="mt-4">Measure Information</p>
        <SmallCard title=""></SmallCard>
      </TabItem>
    </>
  );
}
