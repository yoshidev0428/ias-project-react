import * as React from 'react';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import LightModeIcon from '@mui/icons-material/LightMode';
import ContrastIcon from '@mui/icons-material/Contrast';
import { useChannelsStore } from '@/state';

export default function ImageAdjust() {
  const {
    selectedChannel: channel,
    brightness,
    contrast,
    gamma,
    setPropertiesForChannel,
  } = useChannelsStore((state) => state);

  const handleSlide = (event, newValue) => {
    setPropertiesForChannel(channel, {
      [event.target.name]: newValue ? Number(newValue) : 0,
    });
  };
  const handleInput = (event) => {
    const newValue = Number(event.target.value);
    setPropertiesForChannel(channel, { [event.target.name]: newValue ?? 0 });
  };

  return (
    <Box mb={1}>
      <Typography variant="card-title" gutterBottom mx={1}>
        Image Adjust
      </Typography>
      <Grid container>
        <Grid
          item
          xs={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton
            size="small"
            disabled={channel < 0}
            onClick={() => setPropertiesForChannel(channel, { brightness: 0 })}
          >
            <BrightnessLowIcon fontSize="1rem" />
          </IconButton>
        </Grid>
        <Grid
          item
          xs={7}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Slider
            name="brightness"
            sx={{ py: 1 }}
            value={brightness[channel] || 0}
            disabled={channel < 0}
            onChange={handleSlide}
            aria-labelledby="input-slider"
            min={-1}
            max={1}
            step={0.1}
            size="small"
          />
        </Grid>
        <Grid
          item
          xs={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <InputBase
            name="brightness"
            value={brightness[channel] || 0}
            disabled={channel < 0}
            size="small"
            onChange={handleInput}
            inputProps={{
              step: 0.1,
              min: -1,
              max: 1,
              type: 'number',
              style: { textAlign: 'center', padding: 0, height: 'unset' },
            }}
          />
        </Grid>
        <Grid
          item
          xs={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton
            size="small"
            disabled={channel < 0}
            onClick={() => setPropertiesForChannel(channel, { contrast: 0 })}
          >
            <ContrastIcon fontSize="1rem" />
          </IconButton>
        </Grid>
        <Grid
          item
          xs={7}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Slider
            name="contrast"
            sx={{ py: 1 }}
            value={contrast[channel] || 0}
            disabled={channel < 0}
            onChange={handleSlide}
            aria-labelledby="input-slider"
            min={-1}
            max={1}
            step={0.1}
            size="small"
          />
        </Grid>
        <Grid
          item
          xs={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <InputBase
            name="contrast"
            value={contrast[channel] || 0}
            disabled={channel < 0}
            size="small"
            onChange={handleInput}
            inputProps={{
              step: 0.1,
              min: -1,
              max: 1,
              type: 'number',
              style: { textAlign: 'center', padding: 0, height: 'unset' },
            }}
          />
        </Grid>
        <Grid
          item
          xs={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton
            size="small"
            disabled={channel < 0}
            onClick={() => setPropertiesForChannel(channel, { gamma: 50 })}
          >
            <LightModeIcon fontSize="1rem" />
          </IconButton>
        </Grid>
        <Grid
          item
          xs={7}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Slider
            name="gamma"
            sx={{ py: 1 }}
            value={gamma[channel] || 50}
            disabled={channel < 0}
            onChange={handleSlide}
            aria-labelledby="input-slider"
            min={0}
            max={100}
            step={1}
            size="small"
          />
        </Grid>
        <Grid
          item
          xs={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <InputBase
            name="gamma"
            value={gamma[channel] || 50}
            disabled={channel < 0}
            onChange={handleInput}
            inputProps={{
              step: 1,
              min: 0,
              max: 100,
              type: 'number',
              style: { textAlign: 'center', padding: 0, height: 'unset' },
            }}
          />
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );
}
