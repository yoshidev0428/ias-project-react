import React from 'react';
import TabItem from '../custom/TabItem';
import Vessel from './contents/viewcontrol/Vessel';
import Objective from './contents/viewcontrol/Objective';
import Channel from './contents/viewcontrol/Channel';
import ImageAdjust from './contents/viewcontrol/ImageAdjust';
import ZPosition from './contents/viewcontrol/ZPosition';
import Timeline from './contents/viewcontrol/Timeline';
export default function ViewTab() {
  return (
    <>
      <TabItem title="View Control">
        {/* <Divider className='mt-2 mb-2' /> */}
        <Vessel />
        {/* <Divider className='mt-2 mb-2' /> */}
        <Objective />
        {/* <Divider className='mt-2 mb-2' />
                <LensSelect /> */}
        {/* <Divider className='mt-2 mb-2' /> */}
        <Channel />
        {/* <Divider className='mt-2 mb-2' /> */}
        <ImageAdjust />
        {/* <Divider className='mt-2 mb-2' /> */}
        <ZPosition />
        {/* <Divider className='mt-2 mb-2' /> */}
        <Timeline />
        {/* <Divider className='mt-2 mb-4' /> */}
      </TabItem>
    </>
  );
}
