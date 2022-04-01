import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import TabItem from '../custom/TabItem';
import BitConversion from "./contents/adjust/BitConversion";
import MergeSplit from "./contents/adjust/MergeSplit";
import LightSet from "./contents/adjust/LightSet";
import Division from "./contents/adjust/Division";
import Scale from "./contents/adjust/Scale";
import FVO from "./contents/adjust/FVO";

export default function AdjustTab (props) {
  const refresh = () => {
    console.log("click refresh");
  };
  const help = () => {
    console.log("click help");
  };
  return (
    <TabItem title="Adjust" buttons={true} refresh={refresh} help={help}>
      <BitConversion/>
      <Divider/>
      <MergeSplit />
      <Divider/>
      <LightSet />
      <Divider/>
      <Scale />
      <Divider/>
      <FVO />
      <Divider/>
      <Division />
    </TabItem>
  );
};
