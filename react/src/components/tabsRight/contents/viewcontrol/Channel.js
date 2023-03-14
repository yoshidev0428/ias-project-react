import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, Button } from '@mui/material';
import { mdiPlus, mdiMenuUp, mdiMenuDown, mdiPalette } from '@mdi/js';
import shallow from 'zustand/shallow';
import Icon from '@mdi/react';
import SmallCard from '@/components/custom/SmallCard';
import { useChannelsStore } from '@/state';
import Colors from '@/constants/colors';

const Channel = () => {
  const [colorType, setColorType] = useState('color');
  const { channelsVisible, colors, setChannleVisible, setChannelsVisible } =
    useChannelsStore((state) => state, shallow);
  const channels = useMemo(
    () =>
      colors.map((color, idx) => ({
        ...Object.values(Colors).find(
          (c) => c.rgbValue.toString() === color.toString(),
        ),
        id: idx,
        color: color.toString() === '255,255,255' ? 'gray' : `rgb(${color})`,
      })),
    [colors],
  );

  const handleToggleChannel = (channelId) => {
    setChannleVisible(channelId);
  };

  const handleColorType = () => {
    if (colorType === 'color') {
      setChannelsVisible(colors.map((_, idx) => (idx === 0 ? true : false)));
    } else {
      setChannelsVisible(colors.map(() => true));
    }
    setColorType(colorType === 'color' ? 'mono' : 'color');
  };

  useEffect(() => {
    const isMonoColor = channelsVisible.reduce((acc, visible, idx) => {
      if (idx === 0) {
        return visible;
      } else {
        return acc && !visible;
      }
    }, true);
    if (isMonoColor) {
      setColorType('mono');
    } else {
      setColorType('color');
    }
  }, [channelsVisible]);

  return (
    <>
      <div className="pa-1 common-border">
        <div className="d-flex justify-space-between align-center">
          <h6>Channels</h6>
          <div>
            <div className="spacer"></div>
            <Button
              className="py-0"
              onClick={handleColorType}
              variant="contained"
              color="primary"
              size="small"
            >
              {colorType}
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
            {channels.map(({ id, color, symbol }) => (
              <div
                key={id}
                className="d-flex flex-column channel-box text-center"
              >
                <Checkbox
                  onChange={() => handleToggleChannel(id)}
                  checked={channelsVisible[id]}
                  size="small"
                  sx={{
                    color,
                    padding: 0,
                    '&.Mui-checked': { color },
                  }}
                />
                <span style={{ color }}>{symbol}</span>
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
