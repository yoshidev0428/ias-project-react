import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
// import Slider from '@mui/material/Slider';
// import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import shallow from 'zustand/shallow';
import ChannelOptions from './ChannelOptions';
import { FILL_PIXEL_VALUE } from '../../../constants';
import {
  useLoader,
  useImageSettingsStore,
  useViewerStore,
} from '../../../state';
import { truncateDecimalNumber } from '../../../utils';

export const COLORMAP_SLIDER_CHECKBOX_COLOR = [220, 220, 220];

const toRgb = (on, arr) => {
  const color = on ? COLORMAP_SLIDER_CHECKBOX_COLOR : arr;
  return `rgb(${color})`;
};

// If the channel is not on, display nothing.
// If the channel has a not-undefined value, show it.
// Otherwise, show a circular progress animation.
const getPixelValueDisplay = (pixelValue, isLoading, shouldShowPixelValue) => {
  if (isLoading) {
    return <CircularProgress size="50%" />;
  }
  if (!shouldShowPixelValue) {
    return FILL_PIXEL_VALUE;
  }
  // Need to check if it's a number becaue 0 is falsy.
  if (pixelValue || typeof pixelValue === 'number') {
    return truncateDecimalNumber(pixelValue, 7);
  }
  return FILL_PIXEL_VALUE;
};

function ChannelController({
  name,
  onSelectionChange,
  channelsVisible,
  pixelValue,
  toggleIsOn,
  handleSliderChange,
  domain,
  slider,
  color,
  handleRemoveChannel,
  handleColorSelect,
  isLoading,
}) {
  const loader = useLoader();
  const colormap = useImageSettingsStore((store) => store.colormap);
  const [channelOptions, useLinkedView, use3d] = useViewerStore(
    (store) => [store.channelOptions, store.useLinkedView, store.use3d],
    shallow,
  );
  const rgbColor = toRgb(colormap, color);
  const [min, max] = domain;
  // If the min/max range is and the dtype is float, make the step size smaller so contrastLimits are smoother.
  const step =
    max - min < 500 && loader[0]?.dtype === 'Float32' ? (max - min) / 500 : 1;
  const shouldShowPixelValue = !useLinkedView && !use3d;
  const shortName = name ? name?.slice(0, 1) : '';
  return (
    // <Grid container direction="column" m={2} justifyContent="center">
    //   <Grid container direction="row" justifyContent="space-between">
    //     <Grid item xs={11}>
    //       <Select native value={name} onChange={onSelectionChange}>
    //         {channelOptions.map(opt => (
    //           <option disabled={isLoading} key={opt} value={opt}>
    //             {opt}
    //           </option>
    //         ))}
    //       </Select>
    //     </Grid>
    //     <Grid item>
    //       <ChannelOptions
    //         handleRemoveChannel={handleRemoveChannel}
    //         handleColorSelect={handleColorSelect}
    //         disabled={isLoading}
    //       />
    //     </Grid>
    //   </Grid>
    <Grid container className="d-flex" alignItems="center">
      {/* <Grid item xs={2}>
            {getPixelValueDisplay(pixelValue, isLoading, shouldShowPixelValue)}
            </Grid> */}
      {/* <Grid className="flex-column channel-box text-center m-auto" item xs={2} md={2} sm={2}>
                <FormControlLabel
                    control={<Checkbox
                        onChange={toggleIsOn}
                        disabled={isLoading}
                        checked={channelsVisible}
                        style={{
                            margin: "0px",
                            padding: "0px",
                            color: rgbColor,
                            '&$checked': { color: rgbColor },
                        }}
                    />} label={shortName} />
            </Grid> */}
      <div className="d-flex flex-column channel-box text-center">
        <Checkbox
          onChange={toggleIsOn}
          checked={channelsVisible}
          disabled={isLoading}
          size="small"
          // checked={channelsArray.lenght > 0 ? channelsArray.includes(i) : false}
          sx={{
            color: rgbColor,
            padding: 0,
            '&.Mui-checked': { color: rgbColor },
          }}
        />
        <span style={{ color: rgbColor }}>{shortName}</span>
      </div>
      {/* <Grid item xs={7}>
          <Slider
            disabled={isLoading}
            value={slider}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            getAriaLabel={() => `${name}-${color}-${slider}`}
            valueLabelFormat={v => truncateDecimalNumber(v, 5)}
            min={min}
            max={max}
            step={step}
            orientation="horizontal"
            style={{
              color: rgbColor,
              marginTop: '7px'
            }}
          />
        </Grid> */}
    </Grid>
    // </Grid>
  );
}

export default ChannelController;
