import { useMemo } from 'react';
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Box, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

export default function TabImage({ images, onRemoveImage }) {
  const expNames = useMemo(
    () =>
      Object.keys(
        images.reduce(
          (acc, img) => ({ ...acc, [img.path.split('/')[0]]: true }),
          {},
        ),
      ),
    [images],
  );

  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Experiments:{' '}
        <Typography
          component="span"
          fontWeight="bold"
          variant="subtitle1"
          sx={{ textTransform: 'uppercase' }}
        >
          {expNames.join(', ')}
        </Typography>
      </Typography>
      <ImageList sx={{ maxHeight: 280, mb: 0 }} cols={5}>
        {images.map((item) => (
          <ImageListItem key={item.url}>
            {/\.tif?f$/.test(item.url) ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
                bgcolor="lightgray"
                minHeight={120}
              >
                <ImageIcon fontSize="large" />
              </Box>
            ) : (
              <img src={item.url} alt={item.filename} />
            )}

            <ImageListItemBar
              title={item.filename}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.filename}`}
                  onClick={() => onRemoveImage(item.path)}
                >
                  <HighlightOffIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
