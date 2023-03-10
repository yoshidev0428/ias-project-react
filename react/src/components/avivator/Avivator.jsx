import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FullScreen } from '@chiragrupani/fullscreen-react';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Viewer from './Viewer';
import Loader from './Loader';
import { useImage } from '@/hooks/use-image';
import { useViewerStore } from '@/state';

const Avivator = function ({ source }) {
  const isImageLoading = useSelector((state) => state.files.isImageLoading);
  const isViewerLoading = useViewerStore((store) => store.isViewerLoading);
  const [isFullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (!source) {
      useViewerStore.setState({ source });
    }
  }, [source]);

  useImage(source);

  return (
    <FullScreen
      isFullScreen={isFullScreen}
      onChange={(isFullScreen) => {
        setFullScreen(isFullScreen);
      }}
    >
      {isViewerLoading ? (
        <Box
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          {isImageLoading && <Loader />}
        </Box>
      ) : (
        <>
          <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 99 }}>
            <IconButton
              onClick={() => setFullScreen(!isFullScreen)}
              color="primary"
              sx={{ bgcolor: 'white' }}
            >
              <FullscreenIcon />
            </IconButton>
          </Box>
          <Viewer isFullScreen={isFullScreen} />
        </>
      )}
    </FullScreen>
  );
};
export default Avivator;
