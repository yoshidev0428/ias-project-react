/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState } from 'react';
import shallow from 'zustand/shallow';
import debounce from 'lodash/debounce';
import {
    SideBySideViewer,
    VolumeViewer,
    AdditiveColormapExtension,
    LensExtension
    // eslint-disable-next-line import/no-unresolved
} from '@hms-dbmi/viv';

import PictureInPictureViewer from '@/viv/viewers/PictureInPictureViewer';

import {
    useImageSettingsStore,
    useViewerStore,
    useChannelsStore,
    useLoader
} from '../../state';
import { useWindowSize } from '../../utils';
import { DEFAULT_OVERVIEW } from '../../constants';
import { PostProcessEffect } from '@deck.gl/core';
import viewerShader from './shader';

const Viewer = (props) => {

    const [useLinkedView, use3d, viewState, source] = useViewerStore(store => [store.useLinkedView, store.use3d, store.viewState, store.source], shallow);
    const [colors, contrastLimits, channelsVisible, selections, brightness, contrast, gamma] = useChannelsStore(
        store => [
            store.colors,
            store.contrastLimits,
            store.channelsVisible,
            store.selections,
            store.brightness,
            store.contrast,
            store.gamma
        ],
        shallow
    );
    const [lensSelection, colormap, renderingMode, xSlice, ySlice, zSlice, resolution, lensEnabled, zoomLock, panLock, isOverviewOn, onViewportLoad, useFixedAxis
    ] = useImageSettingsStore(
        store => [
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
            store.useFixedAxis
        ],
        shallow
    );

    const postProcessEffect = useMemo(() => new PostProcessEffect(viewerShader, {
        brightness,
        contrast,
        gamma
      }), [brightness, contrast, gamma]);
      console.log('gamma', gamma)
    const onViewStateChange = ({ viewState: { zoom } }) => {
        const z = Math.min(Math.max(Math.round(-zoom), 0), loader.length - 1);
        useViewerStore.setState({ pyramidResolution: z });
    };
    const loader = useLoader();// <-----here
    const viewSize = useWindowSize(props.isFullScreen, 1, 1);
    // const pictureInPictureViewerRef = React.forwardRef(null);
    const [mouseFlag, setMouseFlag] = useState(props.mouseFlag);
    // console.log("Viewer.jsx : loader, selections, viewState", loader, selections, {...viewState, zomm: 1.5});

    useEffect(() => {
        // console.log("Viewer.jsx : use3d, useLinkedView", use3d, useLinkedView, viewSize);
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
            // height={viewSize.height}
            // width={viewSize.width - 200}
            height={viewSize.height}
            width={viewSize.width}
            onViewportLoad={onViewportLoad}
            useFixedAxis={useFixedAxis}
            viewStates={[viewState]}
            onViewStateChange={debounce(
                ({ viewState: newViewState, viewId }) =>
                    useViewerStore.setState({
                        viewState: { ...newViewState, id: viewId }
                    }),
                250,
                { trailing: true }
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
                handleValue: v => useViewerStore.setState({ pixelValues: v })
            }}
            lensSelection={lensSelection}
            lensEnabled={lensEnabled}
            onViewportLoad={onViewportLoad}
            extensions={[
                colormap ? new AdditiveColormapExtension() : new LensExtension()
            ]}
            colormap={colormap || 'viridis'}
        />
    ) : (
        <PictureInPictureViewer
            // ref={pictureInPictureViewerRef}
            loader={loader}
            contrastLimits={contrastLimits}
            colors={colors}
            channelsVisible={channelsVisible}
            selections={selections}
            height={viewSize.height}
            width={viewSize.width}
            // zoomLock={zoomLock}
            overview={DEFAULT_OVERVIEW}
            overviewOn={isOverviewOn}
            // viewStates={{...viewState, zomm: 1.5}}
            hoverHooks={{ handleValue: v => useViewerStore.setState({ pixelValues: v }) }}
            lensSelection={lensSelection}
            lensEnabled={lensEnabled}
            onViewportLoad={onViewportLoad}
            extensions={[colormap ? new AdditiveColormapExtension() : new LensExtension()]}
            colormap={colormap || 'viridis'}
            onViewStateChange={onViewStateChange}
            deckProps={{
                effects: [postProcessEffect],
            }}
        />
    );
};
export default Viewer;
