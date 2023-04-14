import React, { useEffect, useMemo, useRef, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckIcon from '@mui/icons-material/Check';
import DialogContent from '@/components/mui/DialogContent';
import { Button, DialogActions, Typography } from '@mui/material';
import { createTilesFromCloud, deleteTiles, uploadTiles } from '@/api/tiling';
import useTilingStore from '@/stores/useTilingStore';
import ExperimentDialog from '../../ExperimentDialog';

const DEFAULT_PAGE_SIZE = 48;

export default function TabImage({ onClose }) {
  const [loading, setLoading] = useState(false);
  const { tiles, loading: loadingTiles, loadTiles } = useTilingStore();
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [cloudOpen, setCloudOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [infoMessage, setInfoMessage] = useState('');
  const [page, setPage] = useState(1);
  const pageTiles = useMemo(
    () => tiles.slice(0, page * DEFAULT_PAGE_SIZE),
    [tiles, page],
  );

  useEffect(() => {
    loadTiles().then((tiles) => {
      setInfoMessage(`${tiles.length} tiles loaded`);
    });
  }, [loadTiles]);

  const handleSelectFiles = async (files) => {
    try {
      setLoading(true);
      const res = await createTilesFromCloud(files);
      await loadTiles();
      setInfoMessage(`Successfully uploaded ${res.length} tiles`);
    } catch (err) {
      setInfoMessage(err);
    }
    setFiles([]);
    setLoading(false);
  };

  const handleClickTile = (id) => {
    if (selectedTiles.includes(id)) {
      setSelectedTiles(selectedTiles.filter((tid) => tid !== id));
      setInfoMessage(`Selected ${selectedTiles.length - 1} tiles`);
    } else {
      setSelectedTiles([...selectedTiles, id]);
      setInfoMessage(`Selected ${selectedTiles.length + 1} tiles`);
    }
  };

  const handleDeleteTiles = async () => {
    setLoading(true);
    try {
      const { deleted_count } = await deleteTiles(selectedTiles);
      await loadTiles();
      setSelectedTiles([]);
      setInfoMessage(`Successfully deleted ${deleted_count} tiles`);
    } catch (err) {
      setInfoMessage(err);
    }
    setLoading(false);
  };

  const handleScrollContent = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    setPage((p) => (bottom ? p + 1 : p));
  };

  return (
    <>
      <DialogContent
        sx={{ px: 3, pb: 3 }}
        dividers
        loading={loadingTiles || loading}
        onScroll={handleScrollContent}
      >
        <ImageList sx={{ mb: 0 }} cols={8}>
          {pageTiles.map(({ _id, thumbnail, filename }) => (
            <ImageListItem key={_id}>
              <img src={thumbnail} alt={filename} style={{ minHeight: 100 }} />
              <ImageListItemBar
                title={filename}
                actionIcon={
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255)' }}
                    aria-label={`info about ${filename}`}
                    onClick={() => handleClickTile(_id)}
                  >
                    {selectedTiles.includes(_id) ? (
                      <CheckIcon color="success" />
                    ) : (
                      <HighlightOffIcon color="inherit" />
                    )}
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Typography sx={{ flexGrow: 1 }}>{infoMessage}</Typography>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setCloudOpen(true)}
        >
          Cloud
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleDeleteTiles}
          disabled={!selectedTiles.length}
        >
          Delete
        </Button>
        <Button color="warning" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
      <ExperimentDialog
        title="Clould image dataset"
        open={cloudOpen}
        onClose={() => setCloudOpen(false)}
        onSelectFiles={handleSelectFiles}
      />
    </>
  );
}
