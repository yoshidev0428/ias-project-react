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
import store from '@/reducers';

const Avivator = function ({ source }) {
  const isImageLoading = useSelector((state) => state.files.isImageLoading);
  const isViewerLoading = useViewerStore((state) => state.isViewerLoading);
  const { viewState, setViewState } = useViewerStore((state) => state);
  const [isFullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (!source) {
      useViewerStore.setState({ source });
    }
  }, [source]);

  useImage(source);

  const handleFullscreen = (isFullScreenEnabled) => {
    setFullScreen(isFullScreenEnabled);
  };

  const handleZoomIn = () => {
    let deck_width = localStorage.getItem('imageViewSizeWidth');
    let deck_height = localStorage.getItem('imageViewSizeHeight');
    setViewState({ ...viewState, zoom: viewState.zoom + VIEWER_ZOOM_FACTOR });
    const state = store.getState();
    let canvas_info = state.experiment.canvas_info;
    let canv_info = {
      ...canvas_info,
      zoom: viewState.zoom + VIEWER_ZOOM_FACTOR,
      top:
        deck_height / 2 -
        viewState.target[1] * Math.pow(2, viewState.zoom + VIEWER_ZOOM_FACTOR),
      left:
        deck_width / 2 -
        viewState.target[0] * Math.pow(2, viewState.zoom + VIEWER_ZOOM_FACTOR),
    };
    localStorage.setItem(
      'CANV_TOP',
      deck_height / 2 - viewState.target[1] * Math.pow(2, viewState.zoom),
    );
    localStorage.setItem(
      'CANV_LEFT',
      deck_width / 2 - viewState.target[0] * Math.pow(2, viewState.zoom),
    );
    store.dispatch({
      type: 'set_canvas',
      content: canv_info,
    });
  };

  const handleZoomOut = () => {
    let deck_width = localStorage.getItem('imageViewSizeWidth');
    let deck_height = localStorage.getItem('imageViewSizeHeight');
    setViewState({ ...viewState, zoom: viewState.zoom - VIEWER_ZOOM_FACTOR });
    const state = store.getState();
    let canvas_info = state.experiment.canvas_info;
    let canv_info = {
      ...canvas_info,
      zoom: viewState.zoom - VIEWER_ZOOM_FACTOR,
      top:
        deck_height / 2 -
        viewState.target[1] * Math.pow(2, viewState.zoom - VIEWER_ZOOM_FACTOR),
      left:
        deck_width / 2 -
        viewState.target[0] * Math.pow(2, viewState.zoom - VIEWER_ZOOM_FACTOR),
    };
    localStorage.setItem(
      'CANV_TOP',
      deck_height / 2 - viewState.target[1] * Math.pow(2, viewState.zoom),
    );
    localStorage.setItem(
      'CANV_LEFT',
      deck_width / 2 - viewState.target[0] * Math.pow(2, viewState.zoom),
    );
    store.dispatch({
      type: 'set_canvas',
      content: canv_info,
    });
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
