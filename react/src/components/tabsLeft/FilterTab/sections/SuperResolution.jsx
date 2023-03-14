import SmallCard from '@/components/custom/SmallCard';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import { useState } from 'react';

export default function SuperResolution() {
  const [scale, setScale] = useState(4);

  const handleProcess = () => {};

  return (
    <SmallCard title="Super Resolution">
      <Box alignItems="center" display="flex" width="100%">
        <Typography component="div">Scale:</Typography>
        <Select
          size="small"
          variant="standard"
          fullWidth
          color="primary"
          sx={{ mx: 1 }}
          value={scale}
          onChange={(e) => setScale(e.target.value)}
        >
          {[4, 5, 6, 7, 8].map((val) => (
            <MenuItem value={val} key={val}>
              <Typography align="center">{val}</Typography>
            </MenuItem>
          ))}
        </Select>
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={handleProcess}
        >
          <CheckIcon />
        </Button>
      </Box>
    </SmallCard>
  );
}
