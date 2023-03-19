import React, { useEffect } from 'react';
import shallow from 'zustand/shallow';
import debounce from 'lodash/debounce';
import {
  PictureInPictureViewer,
  SideBySideViewer,
  VolumeViewer,
  AdditiveColormapExtension,
  LensExtension,
  DETAIL_VIEW_ID,
  getDefaultInitialViewState,
} from '@hms-dbmi/viv';

import {
  useImageSettingsStore,
  useViewerStore,
  useChannelsStore,
  useLoader,
} from '@/state';
import { useWindowSize } from '@/helpers/avivator';
import { DEFAULT_OVERVIEW } from '@/constants';

const Viewer = ({ isFullScreen }) => {
  const { useLinkedView, use3d, viewState, setViewState } = useViewerStore(
    (state) => state,
    shallow,
  );
  const { colors, contrastLimits, channelsVisible, selections } =
    useChannelsStore((state) => state, shallow);
  const {
    lensSelection,
    colormap,
    renderingMode,
    xSlice,
    ySlice,
    zSlice,
    resolution,
    lensEnabled,
    zoomLock,
    panLock,
    isOverviewOn,
    onViewportLoad,
    useFixedAxis,
  } = useImageSettingsStore((store) => store, shallow);

  const loader = useLoader();
  const viewSize = useWindowSize(isFullScreen, 1, 1);

  useEffect(() => {
    const initialViewState = getDefaultInitialViewState(loader, viewSize);
    setViewState(initialViewState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onViewStateChange = ({ viewState }) => {
    const { zoom } = viewState;
    const z = Math.min(Math.max(Math.round(-zoom), 0), loader.length - 1);
    useViewerStore.setState({ pyramidResolution: z, viewState });
  };

  return use3d ? (
    <VolumeViewer
      loader={loader}
      contrastLimits={contrastLimits}
      colors={colors}
      channelsVisible={channelsVisible}
      selections={selections}
      colormap={colormap}
      xSlice={xSlice}
      ySlice={ySlice}
      zSlice={zSlice}
      resolution={resolution}
      renderingMode={renderingMode}
      height={viewSize.height}
      width={viewSize.width}
      onViewportLoad={onViewportLoad}
      useFixedAxis={useFixedAxis}
      viewStates={[viewState]}
      onViewStateChange={debounce(
        ({ viewState: newViewState, viewId }) =>
          useViewerStore.setState({
            viewState: { ...newViewState, id: viewId },
          }),
        250,
        { trailing: true },
      )}
    />
  ) : useLinkedView ? (
    <SideBySideViewer
      loader={loader}
      contrastLimits={contrastLimits}
      colors={colors}
      channelsVisible={channelsVisible}
      selections={selections}
      height={viewSize.height}
      width={viewSize.width}
      zoomLock={zoomLock}
      panLock={panLock}
      hoverHooks={{
        handleValue: (v) => useViewerStore.setState({ pixelValues: v }),
      }}
      lensSelection={lensSelection}
      lensEnabled={lensEnabled}
      onViewportLoad={onViewportLoad}
      extensions={[
        colormap ? new AdditiveColormapExtension() : new LensExtension(),
      ]}
      colormap={colormap || 'viridis'}
    />
  ) : (
    <PictureInPictureViewer
      loader={loader}
      contrastLimits={contrastLimits}
      colors={colors}
      channelsVisible={channelsVisible}
      selections={selections}
      height={viewSize.height}
      width={viewSize.width}
      overview={DEFAULT_OVERVIEW}
      overviewOn={isOverviewOn}
      hoverHooks={{
        handleValue: (v) => useViewerStore.setState({ pixelValues: v }),
      }}
      lensSelection={lensSelection}
      lensEnabled={lensEnabled}
      onViewportLoad={onViewportLoad}
      extensions={[
        colormap ? new AdditiveColormapExtension() : new LensExtension(),
      ]}
      colormap={colormap || 'viridis'}
      viewStates={[{ ...viewState, id: DETAIL_VIEW_ID }]}
      onViewStateChange={onViewStateChange}
    />
  );
};
export default Viewer;
