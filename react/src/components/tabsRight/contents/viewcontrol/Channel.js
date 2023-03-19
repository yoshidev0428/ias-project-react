import React, { useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import shallow from 'zustand/shallow';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import PaletteIcon from '@mui/icons-material/Palette';
import { useChannelsStore } from '@/state';
import { ChannelColors } from '@/constants/enums';

const Channel = () => {
  const {
    channelsVisible,
    colors,
    selectedChannel,
    setChannleVisible,
    selectChannel,
  } = useChannelsStore((state) => state, shallow);
  const channels = useMemo(
    () =>
      Object.values(ChannelColors).map(({ rgb, symbol }) => {
        const chId = colors.findIndex((c) => c.toString() === rgb.toString());
        return {
          disabled: chId < 0,
          id: chId,
          symbol,
          color: rgb,
          visible: chId >= 0 && channelsVisible[chId],
          cssColor:
            symbol === ChannelColors.white.symbol ? 'gray' : `rgb(${rgb})`,
        };
      }),
    [colors, channelsVisible],
  );

  const handleToggle = (chId) => {
    setChannleVisible(chId);
  };

  const handleSelect = (chId) => {
    selectChannel(chId);
  };

  return (
    <Box px={1}>
      <Typography variant="card-title" gutterBottom>
        Channels
      </Typography>
      <Grid container justifyContent="space-between">
        <Grid item display="flex" direction="column" alignItems="center">
          <Button variant="icon">
            <AddIcon fontSize="1rem" />
          </Button>
          <Button variant="icon">
            <PaletteIcon fontSize="1rem" />
          </Button>
        </Grid>
        {channels.map(
          ({ id, cssColor: color, symbol, disabled, visible }, idx) => (
            <Grid
              key={idx}
              item
              display="flex"
              direction="column"
              alignItems="center"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleToggle(id)}
                    checked={visible}
                    disabled={disabled}
                    size="small"
                    sx={{
                      color,
                      padding: 0,
                      '&.Mui-checked': { color },
                    }}
                  />
                }
                label={symbol}
                labelPlacement="bottom"
                sx={{ m: 0 }}
              />
              <IconButton
                size="small"
                sx={{ p: 0, mt: -1 }}
                disabled={disabled}
                color={id === selectedChannel ? 'info' : 'default'}
                onClick={() => handleSelect(id)}
              >
                <ArrowDropDownIcon fontSize="small" />
              </IconButton>
            </Grid>
          ),
        )}
      </Grid>
      <Divider sx={{ mx: -1 }} />
    </Box>
  );
};

export default Channel;
