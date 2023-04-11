import React, { useEffect, useRef, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Dropzone from 'react-dropzone';
import DialogContent from '@/components/mui/DialogContent';
import { Button, DialogActions, Typography } from '@mui/material';
import { deleteTiles, uploadTiles } from '@/api/tiling';
import useTilingStore from '@/stores/useTilingStore';

export default function TabImage({ onClose }) {
  const [loading, setLoading] = useState(false);
  const { tiles, loading: loadingTiles, loadTiles } = useTilingStore();
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [infoMessage, setInfoMessage] = useState('');
  const forceClickRef = useRef();

  useEffect(() => {
    loadTiles().then((tiles) => {
      setInfoMessage(`${tiles.length} tiles loaded`);
    });
  }, [loadTiles]);

  const handleAddImages = () => {
    forceClickRef.current.click();
  };

  const handleDropFiles = (files) => {
    setFiles(files);
    setInfoMessage(`Picked ${files.length} images to upload`);
  };

  const handleUploadTiles = async () => {
    try {
      setLoading(true);
      const res = await uploadTiles(files);
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

  return (
    <>
      <DialogContent
        sx={{ px: 3, pb: 3 }}
        dividers
        loading={loadingTiles || loading}
      >
        <Dropzone onDrop={handleDropFiles}>
          {({ getRootProps, getInputProps }) => (
            <Box {...getRootProps()} flexGrow={1} ref={forceClickRef}>
              <input {...getInputProps()} multiple />
              {!tiles.length && (
                <Box
                  sx={{
                    p: 2,
                    height: 300,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 'solid lightgray thin',
                    borderRadius: 2,
                  }}
                >
                  Drag 'n' drop tile images here, or click to select images
                </Box>
              )}
            </Box>
          )}
        </Dropzone>
        <ImageList sx={{ mb: 0 }} cols={5}>
          {tiles.map(({ _id, thumbnail, filename }) => (
            <ImageListItem key={_id}>
              <img src={thumbnail} alt={filename} />
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
        <Button color="success" variant="contained" onClick={handleAddImages}>
          Add Images
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleUploadTiles}
          disabled={!files.length}
        >
          Upload
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
    </>
  );
}
