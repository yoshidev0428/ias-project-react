import * as React from "react";
import { Button } from "react-bootstrap";
import SmallCard from "../../../custom/SmallCard";
// import Divider from '@mui/material/Divider';
// import CustomButton from "../../../custom/CustomButton";
// import {
//     mdiContentSave,
//     mdiContentSaveEdit,
//     mdiPlayCircleOutline,
//     mdiStopCircleOutline,
//     mdiContentSaveOutline,
//     mdiCloseCircleOutline,
// } from '@mdi/js'

export default function FourthPage() {
  const onClick1 = () => {
    console.log("onClick Measure Item");
  };
  const onClick2 = () => {
    console.log("onClick Sort Area");
  };
  const onClick3 = () => {
    console.log("onClick Save");
  };
  const onClick4 = () => {
    console.log("onClick Save As");
  };
  const onClick5 = () => {
    console.log("onClick Learning-Method Go");
  };
  const onClick6 = () => {
    console.log("onClick Go");
  };
  const onClick7 = () => {
    console.log("onClick Stop");
  };
  const onClick8 = () => {
    console.log("onClick Stop");
  };
  const onClick9 = () => {
    console.log("onClick Stop");
  };
  const onClick10 = () => {
    console.log("onClick Stop");
  };

  return (
    <>
      <p>Measure Setting</p>
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
    </>
  );
}
