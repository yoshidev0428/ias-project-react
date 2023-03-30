import * as React from 'react';
import SmallCard from '../../../custom/SmallCard';
import { Button } from 'react-bootstrap';

export default function FifthPage() {
  const onClick1 = () => {};
  const onClick2 = () => {};
  const onClick3 = () => {};
  const onClick4 = () => {};
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
