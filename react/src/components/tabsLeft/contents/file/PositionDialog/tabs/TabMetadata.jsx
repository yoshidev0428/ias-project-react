import { useMemo } from 'react';
import BoxCenter from '@/components/mui/BoxCenter';
import useMetadata from '@/hooks/useMetadata';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';
import { METADATA_COLUMNS } from './constants';
import { Box } from '@mui/material';

export default function TabMetadata({ tiles }) {
  const urls = useMemo(
    () => tiles.filter((tile) => /tif?f/.test(tile.path)).map((img) => img.url),
    [tiles],
  );
  const [metadata, loading] = useMetadata(urls);
  const rows = useMemo(
    () =>
      metadata.map((data, idx) => ({
        ...data,
        ...data.Pixels,
        id: idx + 1,
      })),
    [metadata],
  );

  return loading ? (
    <BoxCenter height={300}>
      <CircularProgress />
    </BoxCenter>
  ) : (
    <Box sx={{ height: 300, width: '100%' }}>
      <DataGrid columns={METADATA_COLUMNS} rows={rows} />
    </Box>
  );
}
