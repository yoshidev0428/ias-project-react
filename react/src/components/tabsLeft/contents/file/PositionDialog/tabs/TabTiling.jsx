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
import { getAvailableDimensions } from './helpers';

export default function TabTiling() {
  const { tiles } = useTilingStore();
  const [align, setAlign] = useState(Alignments.raster);
  const [dir, setDir] = useState(Directions.horizontal);
  const dims = useMemo(() => getAvailableDimensions(tiles.length), [tiles]);
  const [dim, setDim] = useState(dims?.[0]);
  const sorted = useMemo(
    () => tiles.sort((a, b) => a.series - b.series),
    [tiles],
  );

  const tilesAligned = useMemo(() => {
    if (!dim) {
      return sorted;
    }
    const cols = dim[1];
    // Split the array into sub-arrays of cols
    const chunks = [];
    for (let i = 0; i < sorted.length; i += cols) {
      chunks.push(sorted.slice(i, i + cols));
    }

    // Reverse every second sub-array for snake layout
    if (align === Alignments.snake) {
      for (let i = 1; i < chunks.length; i += 2) {
        chunks[i].reverse();
      }
    }

    // Join the sub-arrays back together
    const result = [].concat(...chunks);

    return result;
  }, [sorted, align, dir, dim]);

  return (
    <>
      <DialogContent dividers sx={{ height: '100%' }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid
            item
            container
            xl={2}
            lg={3}
            xs={4}
            sx={{ p: 2, height: 'fit-content' }}
            spacing={2}
          >
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rows and Columns</InputLabel>
                <Select
                  color="primary"
                  label="Rows and Columns"
                  size="small"
                  value={dim.toString()}
                  onChange={(e) =>
                    setDim(e.target.value.split(',').map((v) => Number(v)))
                  }
                >
                  {dims.map((dim) => (
                    <MenuItem value={dim.toString()} key={dim.toString()}>
                      {`Rows: ${dim[0]}, Cols: ${dim[1]}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xl={10} lg={9} xs={8} sx={{ height: '100%' }}>
            <Paper variant="outlined" sx={{ height: '100%' }}>
              <TransformWrapper minScale={0.1}>
                <TransformComponent
                  wrapperStyle={{ width: '100%', height: '100%' }}
                >
                  <ImageList
                    cols={dim[1]}
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
