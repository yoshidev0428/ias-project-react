import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Box from '@mui/material/Box';
import Dropzone from 'react-dropzone';

export default function TabImage({ tiles, onChange, onRemoveImage }) {
  return tiles.length ? (
    <ImageList sx={{ maxHeight: 280, mb: 0 }} cols={5}>
      {tiles.map(({ thumbnail, path, filename }) => (
        <ImageListItem key={path}>
          <img src={thumbnail} alt={filename} />
          <ImageListItemBar
            title={filename}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${filename}`}
                onClick={() => onRemoveImage(path)}
              >
                <HighlightOffIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  ) : (
    <Dropzone onDrop={(files) => onChange(files)}>
      {({ getRootProps, getInputProps }) => (
        <Box {...getRootProps()} flexGrow={1} mb={2}>
          <input {...getInputProps()} multiple />
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
            Drag 'n' drop some files here, or click to select files
          </Box>
        </Box>
      )}
    </Dropzone>
  );
}
