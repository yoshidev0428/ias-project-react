import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import { mdiLightbulbOutline, mdiLightbulb } from '@mdi/js';
import Icon from '@mdi/react';
import store from '@/reducers';
import { useSelector } from 'react-redux';

export default function MLObjectBrightness() {
  const onLight = () => {
    store.dispatch({
      type: 'setMLObjectBrightnessMode',
      content: 'light',
    });
  };
  const onBlack = () => {
    store.dispatch({
      type: 'setMLObjectBrightnessMode',
      content: 'black',
    });
  };
  const MLObjectBrightnessMode = useSelector(
    (state) => state.experiment.MLObjectBrightnessMode,
  );

  return (
    <div className="common-border">
      {/* <h6>Object Select</h6> */}
      <SmallCard title="Prediction Export" child={true}>
        <button
          className="btn btn-light btn-sm w-50"
          style={{
            backgroundColor:
              MLObjectBrightnessMode === 'light' ? 'grey' : 'transparent',
          }}
          onClick={onLight}
        >
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
        <button
          className="btn btn-light btn-sm w-50"
          style={{
            backgroundColor:
              MLObjectBrightnessMode === 'black' ? 'grey' : 'transparent',
          }}
          onClick={onBlack}
        >
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
    </div>
  );
}
