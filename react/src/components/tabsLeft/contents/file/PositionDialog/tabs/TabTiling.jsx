import DialogContent from '@/components/mui/DialogContent';
import useTilingStore from '@/stores/useTilingStore';
import {
  Button,
  DialogActions,
  FormControl,
  Grid,
  ImageList,
  ImageListItem,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import {
  AlignmentLabels,
  Alignments,
  DirectionLabels,
  Directions,
} from './constants';

export default function TabTiling() {
  const { tiles } = useTilingStore();
  const [align, setAlign] = useState(Alignments.raster);
  const [dir, setDir] = useState(Directions.horizontal);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const tilesAligned = useMemo(() => {
    return [];
  }, [tiles, align, dir, rows, cols]);

  return (
    <>
      <DialogContent dividers sx={{ height: '100%' }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid
            item
            container
            xs={4}
            sx={{ p: 2, height: 'fit-content' }}
            spacing={2}
          >
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Alignment</InputLabel>
                <Select
                  color="primary"
                  label="Alignment"
                  size="small"
                  value={align}
                  onChange={(e) => setAlign(e.target.value)}
                >
                  {Object.values(Alignments).map((align) => (
                    <MenuItem value={align} key={align}>
                      {AlignmentLabels[align]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Direction</InputLabel>
                <Select
                  color="primary"
                  label="Direction"
                  size="small"
                  value={dir}
                  onChange={(e) => setDir(e.target.value)}
                >
                  {Object.values(Directions).map((dir) => (
                    <MenuItem value={dir} key={dir}>
                      {DirectionLabels[dir]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Rows"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Cows"
                value={cols}
                onChange={(e) => setCols(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid item xs={8} sx={{ height: '100%' }}>
            <Paper variant="outlined" sx={{ height: '100%' }}>
              <TransformWrapper minScale={0.1}>
                <TransformComponent
                  wrapperStyle={{ width: '100%', height: '100%' }}
                >
                  <ImageList
                    cols={34}
                    gap={0}
                    sx={{ mb: 0, pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {tilesAligned.map(({ _id, thumbnail, filename }) => (
                      <ImageListItem key={_id}>
                        <img
                          src={thumbnail}
                          alt={filename}
                          style={{ width: 100, height: 'auto' }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </TransformComponent>
              </TransformWrapper>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" color="primary">
          Preview
        </Button>
        <Button variant="outlined" color="warning">
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
