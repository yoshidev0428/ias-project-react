import BoxCenter from '@/components/mui/BoxCenter';
import DataTable from '@/components/mui/DataTable';
import DialogContent from '@/components/mui/DialogContent';
import useMetadata from '@/hooks/useMetadata';
import useTilingStore from '@/stores/useTilingStore';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useMemo } from 'react';
import { METADATA_COLUMNS } from './constants';

export default function TabMetadata() {
  const { tiles } = useTilingStore();
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

  return (
    <DialogContent dividers sx={{ height: '100%' }}>
      {loading ? (
        <BoxCenter height="100%">
          <CircularProgress />
        </BoxCenter>
      ) : (
        <Box sx={{ height: '100%', width: '100%' }}>
          <DataTable columns={METADATA_COLUMNS} rows={rows} />
        </Box>
      )}
    </DialogContent>
  );
}
