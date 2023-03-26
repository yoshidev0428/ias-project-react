import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import {
  mdiLightbulbOutline,
  mdiLightbulb,
  mdiGestureTap,
  mdiLayersTriple,
  mdiGestureTapButton,
  mdiTrashCanOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
export default function ObjectSelect() {
  const onLight = () => {};
  const onBlack = () => {};
  const onObject = () => {};
  const onArea = () => {};
  const onBack = () => {};
  const onSet = () => {};

  return (
    <div className="common-border">
      {/* <h6>Object Select</h6> */}
      <SmallCard title="Object brightness" child={true}>
        <button className="btn btn-light btn-sm w-50" onClick={onLight}>
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiLightbulbOutline}
          ></Icon>
          LightOB
        </button>
        <button className="btn btn-light btn-sm w-50" onClick={onBlack}>
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiLightbulb}
          ></Icon>
          BlackOB
        </button>
        {/* <CustomButton icon={mdiLightbulbOutline} label="LightOB" onClick={() => onLight()} />
                <CustomButton icon={mdiLightbulb} label="BlackOB" onClick={() => onBlack()} /> */}
      </SmallCard>
      {/* <div style={{ height: "12px" }}></div> */}
      <SmallCard title="Select target" child={true}>
        <button className="btn btn-light btn-sm w-25" onClick={onObject}>
          <Icon
            size={0.7}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiGestureTap}
          ></Icon>
          OB
        </button>
        <button className="btn btn-light btn-sm w-25" onClick={onArea}>
          <Icon
            size={0.7}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiLayersTriple}
          ></Icon>
          Area
        </button>
        <button className="btn btn-light btn-sm w-25" onClick={onBack}>
          <Icon
            size={0.7}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiGestureTapButton}
          ></Icon>
          BG
        </button>
        <button className="btn btn-light btn-sm w-25" onClick={onSet}>
          <Icon
            size={0.6}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiTrashCanOutline}
          ></Icon>
        </button>
      </SmallCard>
    </div>
  );
}
