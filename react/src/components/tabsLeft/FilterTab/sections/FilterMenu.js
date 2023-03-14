import React from 'react';
import Divider from '@mui/material/Divider';
import TabItem from '@/components/custom/TabItem';
import SmallCard from '@/components/custom/SmallCard';
import { mdiFilter } from '@mdi/js';
import Icon from '@mdi/react';
import AddSub from './AddSub';
import Dec2D from './Dec2D';
import Dec3D from './Dec3D';
import FocusStack from './FocusStack';
import SuperResolution from './SuperResolution';

const FilterMenu = ({ setFilter }) => {
  const onClickFilter2D = () => {
    setFilter('2D');
  };

  const onClickFilter3D = () => {
    setFilter('3D');
  };
  const Filters = () => {
    return (
      <div className="">
        <SmallCard title="Filter">
          <button
            className="btn btn-light btn-sm w-50"
            name="2D"
            onClick={onClickFilter2D}
          >
            <Icon
              size={0.8}
              horizontal
              vertical
              rotate={180}
              color="#212529"
              path={mdiFilter}
            ></Icon>
            2D
          </button>
          <button
            className="btn btn-light btn-sm w-50"
            name="3D"
            onClick={onClickFilter3D}
          >
            <Icon
              size={0.8}
              horizontal
              vertical
              rotate={180}
              color="#212529"
              path={mdiFilter}
            ></Icon>
            3D
          </button>
          {/* {DialogFilter2dflag && <Filter2dDialog />}
                    {DialogFilter3dflag && <Filter3dDialog />} */}
        </SmallCard>
      </div>
    );
  };

  return (
    <TabItem title="Filter">
      <Filters />
      <Divider />
      <AddSub />
      <Divider />
      <Dec2D />
      <Divider />
      <Dec3D />
      <Divider />
      <FocusStack />
      <Divider />
      <SuperResolution />
    </TabItem>
  );
};

export default FilterMenu;
