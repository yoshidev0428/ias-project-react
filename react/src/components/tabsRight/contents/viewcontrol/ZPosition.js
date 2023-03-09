import React, { useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import debounce from 'lodash/debounce';
import shallow from 'zustand/shallow';

import { range, getMultiSelectionStats } from '@/helpers/avivator';
import {
  useChannelsStore,
  useViewerStore,
  useImageSettingsStore,
  useLoader,
} from '@/state';

export default function ZPosition() {
  const loader = useLoader();
  const { shape, labels } = loader[0];
  const size = shape[labels.indexOf('z')];

  const { selections, setPropertiesForChannel } = useChannelsStore(
    (store) => store,
    shallow,
  );
  const globalSelection = useViewerStore((store) => store.globalSelection);
  // eslint-disable-next-line
  const changeSelection = useCallback(
    debounce(
      (_event, newValue) => {
        useViewerStore.setState({
          isChannelLoading: selections.map(() => true),
        });
        const newSelections = [...selections].map((sel) => ({
          ...sel,
          z: newValue,
        }));
        getMultiSelectionStats({
          loader,
          selections: newSelections,
          use3d: false,
        }).then(({ domains, contrastLimits }) => {
          range(newSelections.length).forEach((channel, j) =>
            setPropertiesForChannel(channel, {
              domains: domains[j],
              contrastLimits: contrastLimits[j],
            }),
          );
          useImageSettingsStore.setState({
            onViewportLoad: () => {
              useImageSettingsStore.setState({
                onViewportLoad: () => {},
              });
              useViewerStore.setState({
                isChannelLoading: selections.map(() => false),
              });
            },
          });
          range(newSelections.length).forEach((channel, j) =>
            setPropertiesForChannel(channel, {
              selections: newSelections[j],
            }),
          );
        });
      },
      50,
      { trailing: true },
    ),
    [loader, selections, setPropertiesForChannel],
  );
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ p: 1 }}
    >
      <Grid item xs={12}>
        <Box component="h6">Z Position</Box>
      </Grid>
      <Grid item xs={12} sx={{ px: 1 }}>
        <Slider
          value={globalSelection.z}
          onChange={(event, newValue) => {
            useViewerStore.setState({
              globalSelection: {
                ...globalSelection,
                z: newValue,
              },
            });
            if (event.type === 'keydown') {
              changeSelection(event, newValue);
            }
          }}
          onChangeCommitted={changeSelection}
          marks={range(size).map((val) => ({ value: val }))}
          min={0}
          max={size}
          orientation="horizontal"
        />
      </Grid>
    </Grid>
  );
}
