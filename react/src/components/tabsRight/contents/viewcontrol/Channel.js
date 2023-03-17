import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Checkbox, Button } from '@mui/material';
import { mdiPlus, mdiMenuUp, mdiMenuDown, mdiPalette } from '@mdi/js';
import shallow from 'zustand/shallow';
import Icon from '@mdi/react';
import SmallCard from '@/components/custom/SmallCard';
import {
  useChannelsStore,
  useLoader,
  useMetadata,
  useViewerStore,
  useImageSettingsStore,
} from '@/state';
import Colors from '@/constants/colors';
import { getSingleSelectionStats } from '@/helpers/avivator';
import { MAX_CHANNELS, COLOR_PALLETE } from '@/constants';

const Channel = () => {
  const [colorType, setColorType] = useState('color');
  const { channelsVisible, colors, setChannleVisible, setChannelsVisible } =
    useChannelsStore((state) => state, shallow);
  const [selections, addChannel, setPropertiesForChannel] = useChannelsStore(
    (store) => [
      store.selections,
      store.addChannel,
      store.setPropertiesForChannel,
    ],
    shallow,
  );

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
  const loader = useLoader();
  const metadata = useMetadata();
  const { labels } = loader[0];

  const [
    globalSelection,
    isViewerLoading,
    use3d,
    setIsChannelLoading,
    addIsChannelLoading,
  ] = useViewerStore(
    (store) => [
      store.globalSelection,
      store.isViewerLoading,
      store.use3d,
      store.setIsChannelLoading,
      store.addIsChannelLoading,
    ],
    shallow,
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

  const handleChannelAdd = useCallback(() => {
    let selection = Object.fromEntries(labels.map((l) => [l, 0]));
    selection = { ...selection, ...globalSelection };
    console.log('selection:', selection);
    const numSelectionsBeforeAdd = selections.length;
    getSingleSelectionStats({
      loader,
      selection,
      use3d,
    }).then(({ domain, contrastLimits }) => {
      setPropertiesForChannel(numSelectionsBeforeAdd, {
        domains: domain,
        contrastLimits,
        channelsVisible: true,
      });
      useImageSettingsStore.setState({
        onViewportLoad: () => {
          useImageSettingsStore.setState({
            onViewportLoad: () => {},
          });
          setIsChannelLoading(numSelectionsBeforeAdd, false);
        },
      });
      addIsChannelLoading(true);
      const {
        Pixels: { Channels },
      } = metadata;
      const { c } = selection;
      addChannel({
        selections: selection,
        ids: String(Math.random()),
        channelsVisible: false,
        colors:
          (Channels[c].Color && Channels[c].Color.slice(0, -1)) ??
          (COLOR_PALLETE[c] || [255, 255, 255]),
      });
    });
  }, [
    labels,
    loader,
    globalSelection,
    use3d,
    addChannel,
    addIsChannelLoading,
    selections,
    setIsChannelLoading,
    setPropertiesForChannel,
    metadata,
  ]);

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
            {/*<Button*/}
            {/*  className="py-0"*/}
            {/*  onClick={handleColorType}*/}
            {/*  variant="contained"*/}
            {/*  color="primary"*/}
            {/*  size="small"*/}
            {/*>*/}
            {/*  {colorType}*/}
            {/*</Button>*/}
          </div>
        </div>
        <div>
          <SmallCard>
            <div className="d-block">
              <button
                className="d-block border mx-auto"
                style={{ width: '26px', height: '26px', padding: '0' }}
                onClick={handleChannelAdd}
              >
                <Icon path={mdiPlus} size={0.7} />
              </button>
              <button
                className="d-block border mx-auto mt-1"
                style={{ width: '26px', height: '26px', padding: '0' }}
                onClick={handleColorType}
              >
                <Icon path={mdiPalette} size={0.7} />
              </button>
            </div>
            <div className="channel-box-container">
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
            </div>
            {/*<div>*/}
            {/*  <div*/}
            {/*    className="d-block border mx-auto pr-3 pb-3"*/}
            {/*    style={{ width: '17px', height: '17px' }}*/}
            {/*  >*/}
            {/*    {' '}*/}
            {/*    <Icon path={mdiMenuUp} size={0.7} />*/}
            {/*  </div>*/}
            {/*  <div*/}
            {/*    className="d-block border mx-auto pr-3 pb-3 mt-1"*/}
            {/*    style={{ width: '17px', height: '17px' }}*/}
            {/*  >*/}
            {/*    {' '}*/}
            {/*    <Icon path={mdiMenuDown} size={0.7} />*/}
            {/*  </div>*/}
            {/*</div>*/}
          </SmallCard>
        </div>
      </div>
    </>
  );
};

export default Channel;
