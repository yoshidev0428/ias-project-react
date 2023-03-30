import React from 'react';
import { useSelector } from 'react-redux';
import SmallCard from '../../../custom/SmallCard';
import {
  mdiGestureTap,
  mdiLayersTriple,
  mdiGestureTapButton,
  mdiCog,
} from '@mdi/js';
import Icon from '@mdi/react';
import store from '@/reducers';
import {} from '@mdi/js';

export default function MLSelectTarget() {
  const MLSelectTargetMode = useSelector(
    (state) => state.experiment.MLSelectTargetMode,
  );

  const onObject = () => {
    store.dispatch({ type: 'setMLSelectTargetMode', content: 'object' });
  };
  const onArea = () => {
    store.dispatch({ type: 'setMLSelectTargetMode', content: 'area' });
  };
  const onBackground = () => {
    store.dispatch({ type: 'setMLSelectTargetMode', content: 'background' });
  };
  const onSet = () => {
    store.dispatch({ type: 'setMLSelectTargetMode', content: 'set' });
  };

  return (
    <div className="common-border">
      {/* <div style={{ height: "12px" }}></div> */}
      <SmallCard title="Select target" child={true}>
        <button
          className="btn btn-light btn-sm w-25"
          style={{
            backgroundColor:
              MLSelectTargetMode === 'object' ? 'grey' : 'transparent',
          }}
          onClick={onObject}
        >
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
        <button
          className="btn btn-light btn-sm w-25"
          style={{
            backgroundColor:
              MLSelectTargetMode === 'area' ? 'grey' : 'transparent',
          }}
          onClick={onArea}
        >
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
        <button
          className="btn btn-light btn-sm w-25"
          style={{
            backgroundColor:
              MLSelectTargetMode === 'background' ? 'grey' : 'transparent',
          }}
          onClick={onBackground}
        >
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
        <button
          className="btn btn-light btn-sm w-25"
          style={{
            backgroundColor:
              MLSelectTargetMode === 'set' ? 'grey' : 'transparent',
          }}
          onClick={onSet}
        >
          <Icon
            size={0.6}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiCog}
          ></Icon>
          Set
        </button>
      </SmallCard>
    </div>
  );
}
