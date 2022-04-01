import * as React from 'react';
import Divider from '@mui/material/Divider';
import SmallCard from "../custom/SmallCard";
import CustomButton from "../custom/CustomButton";
import TabItem from "../custom/TabItem";
import {
  mdiCloudUploadOutline,
  mdiMicrosoftExcel,
  mdiFileDelimitedOutline,
  mdiFileCodeOutline,
  mdiChartTimelineVariantShimmer,
  mdiTabletDashboard
}  from '@mdi/js'

export default function ReportTab () {
  const onClick1 = () => {
    console.log("onClick Cloud")
  }
  const onClick2 = () => {
    console.log("onClick Excel")
  }
  const onClick3 = () => {
    console.log("onClick CSV")
  }
  const onClick4 = () => {
    console.log("onClick Save As")
  }
  const onClick5 = () => {
    console.log("onClick Visual")
  }
  const onClick6 = () => {
    console.log("onClick Tableau")
  }
  return (
    <>
      <TabItem title="Report">
        <SmallCard title="Save">
          <CustomButton icon={mdiCloudUploadOutline} label="Cloud" click={onClick1}/>
          <CustomButton icon={mdiMicrosoftExcel} label="Excel" click={onClick2}/>
          <CustomButton icon={mdiFileDelimitedOutline} label="CSV" click={onClick3}/>
          <CustomButton icon={mdiFileCodeOutline} label="HDF5" click={onClick4}/>
        </SmallCard>
        <Divider className="my-2"/>
        <SmallCard title="View">
          <CustomButton icon={mdiChartTimelineVariantShimmer} label="Visual" click={onClick5}/>
          <CustomButton icon={mdiTabletDashboard} label="Tableau" click={onClick6}/>
        </SmallCard>
      </TabItem>
    </>
  );
};
