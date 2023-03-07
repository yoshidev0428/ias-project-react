import React, { useState } from 'react';
import { Checkbox, Button } from '@mui/material';
import { mdiPlus, mdiMenuUp, mdiMenuDown, mdiPalette } from '@mdi/js';
import shallow from 'zustand/shallow';
import Icon from '@mdi/react';
import SmallCard from '@/components/custom/SmallCard';
import { useChannelsStore } from '@/viv/state';
import { useSelector } from 'react-redux';
import CHANNELS from '@/utils/constants/channels';

const Channel = () => {
  const [colorType, setColorType] = useState(true);
  const { channelsVisible, colors, toggleIsOn } = useChannelsStore(
    (state) => state,
    shallow,
  );
  const selectedChannel = useSelector((state) => state.vessel.channels);

  const handleToggleChannel = (channelId) => {
    toggleIsOn(channelId);
  };

  const handleMonoColor = () => {
    for (let channelIdx = 0; channelIdx < CHANNELS.length; channelIdx++) {
      for (let colorIdx = 0; colorIdx < colors.length; colorIdx++) {
        if (colors[colorIdx].toString() === CHANNELS[channelIdx].toString()) {
          if (channelIdx === 0) {
            if (channelsVisible[colorIdx] === colorType) {
              toggleIsOn(colorIdx);
            }
          } else {
            if (channelsVisible[colorIdx] !== colorType) {
              toggleIsOn(colorIdx);
            }
          }
          break;
        }
      }
    }
    setColorType(!colorType);
  };

  return (
    <>
      <div className="pa-1 common-border">
        <div className="d-flex justify-space-between align-center">
          <h6>Channels</h6>
          <div>
            <div className="spacer"></div>
            <Button
              className="py-0"
              onClick={handleMonoColor}
              variant="contained"
              color="primary"
              size="small"
            >
              Color/Mono
            </Button>
          </div>
        </div>
        <div>
          <SmallCard>
            <div className="d-block">
              <div
                className="d-block border mx-auto pr-3 pb-3"
                style={{ width: '17px', height: '17px' }}
              >
                {' '}
                <Icon path={mdiPlus} size={0.7} />
              </div>
              <div
                className="d-block border mx-auto pr-3 pb-3 mt-1"
                style={{ width: '17px', height: '17px' }}
              >
                {' '}
                <Icon path={mdiPalette} size={0.7} />
              </div>
            </div>
            {CHANNELS.map((channel, i) => (
              <div
                key={i}
                className="d-flex flex-column channel-box text-center"
              >
                <Checkbox
                  onChange={() => handleToggleChannel(i)}
                  checked={channel.id === selectedChannel[0]}
                  size="small"
                  sx={{
                    color: channel.color,
                    padding: 0,
                    '&.Mui-checked': { color: channel.color },
                  }}
                />
                <span style={{ color: channel.color }}>{channel.label}</span>
              </div>
            ))}
            <div>
              <div
                className="d-block border mx-auto pr-3 pb-3"
                style={{ width: '17px', height: '17px' }}
              >
                {' '}
                <Icon path={mdiMenuUp} size={0.7} />
              </div>
              <div
                className="d-block border mx-auto pr-3 pb-3 mt-1"
                style={{ width: '17px', height: '17px' }}
              >
                {' '}
                <Icon path={mdiMenuDown} size={0.7} />
              </div>
            </div>
          </SmallCard>
        </div>
      </div>
    </>
  );
};

export default Channel;
