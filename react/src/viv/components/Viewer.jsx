import React, { useEffect, useMemo, useState } from 'react';
import shallow from 'zustand/shallow';
import debounce from 'lodash/debounce';
import {
  SideBySideViewer,
  VolumeViewer,
  AdditiveColormapExtension,
  LensExtension,
} from '@hms-dbmi/viv';

import PictureInPictureViewer from './viewers/PictureInPictureViewer';

import {
  useImageSettingsStore,
  useViewerStore,
  useChannelsStore,
  useLoader,
} from '@/viv/state';
import { useWindowSize } from '@/viv/utils';
import { DEFAULT_OVERVIEW } from '@/viv/constants';
import { PostProcessEffect } from '@deck.gl/core';
import generateShaderModule from '@/viv/helpers/generate-module';

const Viewer = (props) => {
  const [useLinkedView, use3d, viewState] = useViewerStore(
    (store) => [
      store.useLinkedView,
      store.use3d,
      store.viewState,
      store.source,
    ],
    shallow,
  );
  const {
    colors,
    contrastLimits,
    channelsVisible,
    selections,
    brightness,
    contrast,
    gamma,
    deblur,
  } = useChannelsStore((state) => state, shallow);
  const [
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
  ] = useImageSettingsStore(
    (store) => [
      store.lensSelection,
      store.colormap,
      store.renderingMode,
      store.xSlice,
      store.ySlice,
      store.zSlice,
      store.resolution,
      store.lensEnabled,
      store.zoomLock,
      store.panLock,
      store.isOverviewOn,
      store.onViewportLoad,
      store.useFixedAxis,
    ],
    shallow,
  );

  console.log('deblur', deblur);
  const shaderModule = useMemo(
    () => generateShaderModule(Math.floor(deblur.size / 2)),
    [deblur],
  );
  const postProcessEffect = useMemo(
    () =>
      new PostProcessEffect(shaderModule, {
        u_brightness: brightness,
        u_contrast: contrast,
        u_gamma: gamma,
        u_deblurKernel: deblur.kernel,
      }),
    [brightness, contrast, gamma, deblur, shaderModule],
  );

  const onViewStateChange = ({ viewState: { zoom } }) => {
    const z = Math.min(Math.max(Math.round(-zoom), 0), loader.length - 1);
    useViewerStore.setState({ pyramidResolution: z });
  };
  const loader = useLoader();
  const viewSize = useWindowSize(props.isFullScreen, 1, 1);
  const [mouseFlag, setMouseFlag] = useState(props.mouseFlag);

  useEffect(() => {
    if (props.mouseFlag !== null && props.mouseFlag !== undefined) {
      if (mouseFlag !== props.mouseFlag) {
        setMouseFlag(props.mouseFlag);
      }
    }
  }, [props, mouseFlag]);

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
      onViewStateChange={onViewStateChange}
      deckProps={{
        effects: [postProcessEffect],
      }}
    />
  );
};
export default Viewer;
