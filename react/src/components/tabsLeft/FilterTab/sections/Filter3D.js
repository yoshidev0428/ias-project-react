import React from 'react';
import TabItem from '@/components/custom/TabItem';
import PageHeader from './PageHeader';
import Divider from '@mui/material/Divider';

const Filter3D = ({ setFilter }) => {
  return (
    <TabItem title="Filter">
      <PageHeader setFilter={setFilter} currentID={2} />
      <Divider />
      next
    </TabItem>
  );
};
export default Filter3D;
