import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import { COLORMAP_OPTIONS } from '@/viv/constants';
import { useImageSettingsStore, useViewerStore } from '@/viv/state';

function ColormapSelect() {
  const colormap = useImageSettingsStore((store) => store.colormap);
  const isViewerLoading = useViewerStore((store) => store.isViewerLoading);
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="colormap-select">
        Additive {colormap === '' ? ' Blending' : 'Color Mapping'}
      </InputLabel>
      <Select
        native
        onChange={(e) =>
          useImageSettingsStore.setState({ colormap: e.target.value })
        }
        value={colormap}
        inputProps={{
          name: 'colormap',
          id: 'colormap-select',
        }}
        disabled={isViewerLoading}
      >
        <option aria-label="None" value="" />
        {COLORMAP_OPTIONS.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

export default ColormapSelect;
