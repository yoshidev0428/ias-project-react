import * as React from 'react';
import SmallCard from "../../../custom/SmallCard";
import ObjectiveButton from "../../../custom/ObjectiveButton";
export default function Objective (props) {

  const objectives = [
    { id: 0, m: 4, active: true },
    { id: 1, m: 10, active: false },
    { id: 2, m: 20, active: false },
    { id: 3, m: 40, active: false },
    { id: 4, m: 100, active: false }
  ];

  return (
      <SmallCard title="Objective">
          {
              objectives.map((item, i) => {
                  return <ObjectiveButton label={item.m + 'X'} key={item.id} active={item.active} />;
              })
          }
      </SmallCard>
  );
};
