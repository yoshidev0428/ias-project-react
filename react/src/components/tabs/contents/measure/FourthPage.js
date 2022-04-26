import * as React from 'react';
import Divider from '@mui/material/Divider';
import { Container } from 'react-bootstrap';
import SmallCard from "../../../custom/SmallCard";
import CustomButton from "../../../custom/CustomButton";
import {
  mdiBookOpenPageVariant,
  mdiPlayCircle,
  mdiContentSave,
  mdiContentSaveEdit,
  mdiPlayCircleOutline,
  mdiStopCircleOutline,
  mdiContentSaveOutline,
  mdiCloseCircleOutline,
  mdiCog
}  from '@mdi/js'

export default function FourthPage () {
  const onClick1 = () => {
    console.log("onClick Measure Item")
  }
  const onClick2 = () => {
    console.log("onClick Sort Area")
  }
  const onClick3 = () => {
    console.log("onClick Save")
  }
  const onClick4 = () => {
    console.log("onClick Save As")
  }
  const onClick5 = () => {
    console.log("onClick Learning-Method Go")
  }
  const onClick6 = () => {
    console.log("onClick Go")
  }
  const onClick7 = () => {
    console.log("onClick Stop")
  }
  return (
    <>
      <Container className="pa-0">
        <SmallCard title="Measure Contents">
          <CustomButton icon={mdiBookOpenPageVariant} label="Measure Item" click={onClick1}/>
          <CustomButton icon={mdiPlayCircle} label="Sort Area" click={onClick2}/>
          <CustomButton icon={mdiCog} label="Set" click={onClick2}/>
        </SmallCard>
        <Divider className="my-2"/>
        <SmallCard title="Save Method">
          <CustomButton icon={mdiContentSave} label="Save" click={onClick3}/>
          <CustomButton icon={mdiContentSaveEdit} label="Save As" click={onClick4}/>
        </SmallCard>
        <Divider className="my-2"/>
        <SmallCard title="Go">
          <CustomButton icon={mdiPlayCircleOutline} label="Go" click={onClick6}/>
          <CustomButton icon={mdiStopCircleOutline} label="Stop" click={onClick7}/>
          <CustomButton icon={mdiContentSaveOutline} label="Save" click={onClick6}/>
          <CustomButton icon={mdiCloseCircleOutline} label="Cancel" click={onClick7}/>
        </SmallCard>
      </Container>
    
    </>
  );
};
