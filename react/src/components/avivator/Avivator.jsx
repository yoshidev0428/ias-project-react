import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FullScreen } from '@chiragrupani/fullscreen-react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import Viewer from './Viewer';
import Loader from './Loader';
import { useImage } from '@/hooks/use-image';
import { useViewerStore } from '@/state';
import { VIEWER_ZOOM_FACTOR } from '@/constants/avivator';

const Avivator = function () {
  const isImageLoading = useSelector((state) => state.files.isImageLoading);
  const { isViewerLoading, source } = useViewerStore((state) => state);
  const { viewState, setViewState } = useViewerStore((state) => state);
  const [isFullScreen, setFullScreen] = useState(false);

  useImage(source);

  const handleFullscreen = (isFullScreenEnabled) => {
    setFullScreen(isFullScreenEnabled);
  };

  const handleZoomIn = () => {
    setViewState({ ...viewState, zoom: viewState.zoom + VIEWER_ZOOM_FACTOR });
  };

  const handleZoomOut = () => {
    setViewState({ ...viewState, zoom: viewState.zoom - VIEWER_ZOOM_FACTOR });
  };

  return (
    <FullScreen isFullScreen={isFullScreen} onChange={handleFullscreen}>
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
          <Box
            position="absolute"
            top={16}
            left={16}
            zIndex={99}
            display="flex"
            flexDirection="column"
          >
            <IconButton
              onClick={() => setFullScreen(!isFullScreen)}
              color="primary"
              size="small"
              sx={{ bgcolor: 'white', mb: 1 }}
            >
              <FullscreenIcon />
            </IconButton>
            <IconButton
              onClick={handleZoomIn}
              color="primary"
              size="small"
              sx={{ bgcolor: 'white', mb: 1 }}
            >
              <ZoomInIcon />
            </IconButton>
            <IconButton
              onClick={handleZoomOut}
              color="primary"
              size="small"
              sx={{ bgcolor: 'white' }}
            >
              <ZoomOutIcon />
            </IconButton>
          </Box>
          <Viewer isFullScreen={isFullScreen} />
        </>
      )}
    </FullScreen>
  );
};
export default Avivator;
