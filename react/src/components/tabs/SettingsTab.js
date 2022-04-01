import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import TabItem from "../custom/TabItem";
import Channnels from "./contents/Settings/ChannelSettings";
import Objective from './contents/viewcontrol/Objective';
import SmallCard from '../custom/SmallCard';

export default function SettingsTab() {

  return (
    <>
      <TabItem title="Settings">
        <Divider />
        <Objective />
        <Divider />
        <SmallCard title="Channels">
          <Channnels />
        </SmallCard>

      </TabItem>
    </>
  );
};
