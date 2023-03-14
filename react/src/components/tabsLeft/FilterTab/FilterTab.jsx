import React from 'react';
import Divider from '@mui/material/Divider';
import TabItem from '@/components/custom/TabItem';
import Filters from './sections/Filters';
import AddSub from './sections/AddSub';
import Dec2D from './sections/Dec2D';
import Dec3D from './sections/Dec3D';
import FocusStack from './sections/FocusStack';
import SuperResolution from './sections/SuperResolution';

export default function FilterTab() {
  return (
    <TabItem title="Filter">
      <Filters />
      <Divider />
      <AddSub />
      <Divider />
      <Dec2D />
      <Divider />
      <Dec3D />
      <Divider />
      <FocusStack />
      <Divider />
      <SuperResolution />
    </TabItem>
  );
}
