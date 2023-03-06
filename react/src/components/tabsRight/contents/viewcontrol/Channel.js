import React, { useState } from 'react';
import { Checkbox, Button } from '@mui/material';
import { mdiPlus, mdiMenuUp, mdiMenuDown, mdiPalette } from '@mdi/js';
import shallow from 'zustand/shallow';
import { connect } from 'react-redux';
import Icon from '@mdi/react';
import { useChannelsStore, useImageSettingsStore } from '@/viv/state';
import SmallCard from '@/components/custom/SmallCard';
import { COLORMAP_SLIDER_CHECKBOX_COLOR } from '@/components/constant/constants';
import { useSelector } from 'react-redux';
import CHANNELS from '@/utils/constants/channels';

const toRgb = (on, arr) => {
  const color = on ? COLORMAP_SLIDER_CHECKBOX_COLOR : arr;
  return `rgb(${color})`;
};
const mapStateToProps = (state) => ({
  viewConfigsObj: state.vessel.viewConfigsObj,
});

const Channel = () => {
  const [colorType, setColorType] = useState(true);
  const { channelsVisible, colors, toggleIsOn } = useChannelsStore(
    (state) => state,
    shallow,
  );
  const selectedChannel = useSelector((state) => state.vessel.channels);
  const colormap = useImageSettingsStore((store) => store.colormap);

  const handleToggleChannel = (channelId) => {
    toggleIsOn(channelId);
  };

  const handleMonoColor = () => {
    for (let channelIdx = 0; channelIdx < CHANNELS.length; channelIdx++) {
      for (let colorIdx = 0; colorIdx < colors.length; colorIdx++) {
        if (
          colors[colorIdx][0] === CHANNELS[channelIdx].rgbColor[0] &&
          colors[colorIdx][1] === CHANNELS[channelIdx].rgbColor[1] &&
          colors[colorIdx][2] === CHANNELS[channelIdx].rgbColor[2]
        ) {
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

  const renderItems = (channels) => {
    let isLoading = false;
    let rgbColor = toRgb(colormap, [0, 0, 0]);
    if (colors !== null && colors !== undefined) {
      for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < channels.length; j++) {
          if (
            colors[i][0] === channels[j].rgbColor[0] &&
            colors[i][1] === channels[j].rgbColor[1] &&
            colors[i][2] === channels[j].rgbColor[2]
          ) {
            channels[j].current_id = i;
            channels[j].disabled = false;
            channels[j].channelsVisible = channelsVisible[i];
            break;
          }
        }
        rgbColor = toRgb(colormap, colors[i]);
      }
    }
    return channels.map((channel, i) => (
      <div key={i} className="d-flex flex-column channel-box text-center">
        <Checkbox
          onChange={() => handleToggleChannel(i)}
          checked={channel.id === selectedChannel[0]}
          size="small"
          sx={{
            color: isLoading ? rgbColor : channel.color,
            padding: 0,
            '&.Mui-checked': { color: isLoading ? rgbColor : channel.color },
          }}
        />
        <span style={{ color: isLoading ? rgbColor : channel.color }}>
          {channel.label}
        </span>
      </div>
    ));
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
            {renderItems(CHANNELS)}
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

export default connect(mapStateToProps)(Channel);
