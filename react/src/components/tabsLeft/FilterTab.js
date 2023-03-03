import React from 'react';
import TabItem from '../custom/TabItem';
import Filters from './contents/filter/Filters';
import AddSub from './contents/filter/AddSub';
import Dec2D from './contents/filter/Dec2D';
import Dec3D from './contents/filter/Dec3D';
import FocusStack from './contents/filter/FocusStack';
import Divider from '@mui/material/Divider';

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
    </TabItem>
  );
}
