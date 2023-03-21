import React from 'react';
import Divider from '@mui/material/Divider';
import TabItem from '../custom/TabItem';
import BitConversion from './contents/adjust/BitConversion';
import MergeSplit from './contents/adjust/MergeSplit';
import LightSet from './contents/adjust/LightSet';
import Scale from './contents/adjust/Scale';
// import Division from "./contents/adjust/Division";
// import FVO from "./contents/adjust/FVO";

export default function AdjustTab() {
  // const refresh = () => {
  //     console.log("click refresh");
  // };
  // const help = () => {
  //     console.log("click help");
  // };
  // buttons={true} refresh={refresh} help={help}
  return (
    <TabItem title="Adjust">
      <BitConversion />
      <Divider />
      <MergeSplit />
      <Divider />
      <LightSet />
      <Divider />
      <Scale />
      <Divider />
      {/* <FVO />
            <Divider />
            <Division /> */}
    </TabItem>
  );
}
