import * as React from "react";
// import Divider from '@mui/material/Divider';
import SmallCard from "../../../custom/SmallCard";
import { Button } from "react-bootstrap";

export default function FifthPage() {
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
  return (
    <>
      <SmallCard title="Setting Information"></SmallCard>
      <SmallCard title="Go">
        <Button className="btn btn-light btn-sm w-16" onClick={onClick1}>
          Go
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick2}>
          Stop
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick3}>
          Save
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick4}>
          Cancel
        </Button>
      </SmallCard>
    </>
  );
}
