import { useEffect } from 'react';
import { useDropzone as useReactDropzone } from 'react-dropzone';
import { unstable_batchedUpdates } from 'react-dom';
import shallow from 'zustand/shallow';
import store from '../../reducers';
import {
    useChannelsStore,
    useImageSettingsStore,
    useLoader,
    useMetadata,
    useViewerStore
} from './state';
import {
    createLoader,
    buildDefaultSelection,
    guessRgb,
    getMultiSelectionStats,
    getBoundingCube,
    isInterleaved
} from './utils';
import { COLOR_PALLETE, FILL_PIXEL_VALUE } from './constants';

export const useImage = (source) => {

    const [use3d, toggleUse3d, toggleIsOffsetsSnackbarOn, channelMap] = 
        useViewerStore(store => [store.use3d, store.toggleUse3d, store.toggleIsOffsetsSnackbarOn, store.channelMap], shallow);
    const [lensEnabled, toggleLensEnabled] = useImageSettingsStore(store => [store.lensEnabled, store.toggleLensEnabled], shallow);
    const loader = useLoader();
    const metadata = useMetadata();

    useEffect(() => {
        async function changeLoader() {
            // Placeholder
            useViewerStore.setState({ isChannelLoading: [true] });
            useViewerStore.setState({ isViewerLoading: true });
            store.dispatch({type: "image_loading_state_change", content: true});
            if (use3d) toggleUse3d();
            const { urlOrFile, contents } = source;
            console.log("-------- hook.js useEffect urlOrFile : ", urlOrFile, loader);
            const newLoader = await createLoader(urlOrFile, contents, toggleIsOffsetsSnackbarOn, message => useViewerStore.setState({ loaderErrorSnackbar: { on: true, message } }));
            console.log("-------- hook.js useEffect urlOrFile : newLoader : ", newLoader);
            let nextMeta;
            let nextLoader;
            if (Array.isArray(newLoader)) {
                if (newLoader.length > 1) {
                    nextMeta = newLoader.map(l => l.metadata);
                    nextLoader = newLoader.map(l => l.data);
                } else {
                    nextMeta = newLoader[0].metadata;
                    nextLoader = newLoader[0].data;
                }
            } else {
                nextMeta = newLoader.metadata;
                nextLoader = newLoader.data;
            }
            console.log("-------- nextLoader nextMeta useImage hook.js", nextLoader, nextMeta,);
            if (nextLoader) {
                unstable_batchedUpdates(() => {
                    useChannelsStore.setState({ loader: nextLoader });
                    useViewerStore.setState({ metadata: nextMeta });
                });
                if (use3d) toggleUse3d();
            }
        }
        if (source) changeLoader();
    }, [source]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const changeSettings = async () => {
            // Placeholder
            useViewerStore.setState({ isChannelLoading: [true] });
            useViewerStore.setState({ isViewerLoading: true });
            store.dispatch({type: "image_loading_state_change", content: true});
            console.log("-------- hook.js useEffect toggleUse3d : ", toggleUse3d);
            if (use3d) toggleUse3d();
            let newSelections = buildDefaultSelection(loader[0]);
            console.log("-------- hook.js useEffect metadata.Pixels : ", metadata.Pixels);
            const { Channels } = metadata.Pixels;
            console.log("-------- hook.js useEffect Channels : ", Channels);
            const channelOptions = Channels.map((c, i) => c.Name ?? `Channel ${i}`);
            // Default RGB.
            let newContrastLimits = [];
            let newDomains = [];
            let newColors = [];
            const isRgb = guessRgb(metadata);
            console.log("-------- hook.js useEffect isRgb : ", isRgb, metadata, channelOptions, source?.contents);
            if (isRgb) {
                if (isInterleaved(loader[0].shape)) {
                    // These don't matter because the data is interleaved.
                    newContrastLimits = [[0, 255]];
                    newDomains = [[0, 255]];
                    newColors = [[255, 0, 0]];
                } else {
                    newContrastLimits = [
                        [0, 255],
                        [0, 255],
                        [0, 255]
                    ];
                    newDomains = [
                        [0, 255],
                        [0, 255],
                        [0, 255]
                    ];
                    newColors = [
                        [255, 0, 0],
                        [0, 255, 0],
                        [0, 0, 255]
                    ];
                }
                if (lensEnabled) {
                    toggleLensEnabled();
                }
                useViewerStore.setState({ useColormap: false, useLens: false });
            } else {
                console.log("-------- hook.js useEffect getMultiSelectionStats : ", loader, newSelections, source?.contents);
                const stats = await getMultiSelectionStats({ loader, selections: newSelections, use3d: (use3d || source?.is3dView) });
                console.log("-------- hook.js useEffect getMultiSelectionStats newSelections = ", newSelections, ", stats = ", stats);
                newDomains = stats.domains;
                newContrastLimits = stats.contrastLimits;
                // If there is only one channel, use white.
                if (newDomains.length === 1) {
                    newColors = [[255, 255, 255]];
                } else {
                    for (let i = 0; i < newDomains.length; i++) {
                        newColors.push(COLOR_PALLETE[source?.contents[i].channel]);
                    }
                }
                newColors = newDomains.length === 1 ? [[255, 255, 255]] : newDomains.map((_, i) => COLOR_PALLETE[channelMap[i]]);
                console.log("hook.js useEffect newColors", newColors);
                useViewerStore.setState({
                    useLens: channelOptions.length !== 1,
                    useColormap: true
                });
            }
            console.log("-------- hook.js useEffect newColors : ", newColors);
            let channelMapSelections = [];
            for (let i = 0; i < newSelections.length; i++) {
                channelMapSelections.push([{...newSelections[i], 'c': channelMap[newSelections[i]['c']]}]);
            }
            newSelections = channelMapSelections;
            useChannelsStore.setState({
                ids: newDomains.map(() => String(Math.random())),
                selections: newSelections,
                domains: newDomains,
                contrastLimits: newContrastLimits,
                colors: newColors,
                channelsVisible: newColors.map(() => true)
            });
            useViewerStore.setState({
                isChannelLoading: newSelections.map(i => !i),
                isViewerLoading: false,
                pixelValues: new Array(newSelections.length).fill(FILL_PIXEL_VALUE),
                globalSelection: newSelections[0],
                channelOptions
            });
            store.dispatch({type: "image_loading_state_change", content: false});
            const [xSlice, ySlice, zSlice] = getBoundingCube(loader);
            useImageSettingsStore.setState({ xSlice, ySlice, zSlice });
        };
        if (metadata) changeSettings();
    }, [loader, metadata]); // eslint-disable-line react-hooks/exhaustive-deps
};

export const useDropzone = () => {
    const handleSubmitFile = files => {
        let newSource;
        if (files.length === 1) {
            newSource = {
                urlOrFile: files[0],
                // Use the trailing part of the URL (file name, presumably) as the description.
                description: files[0].name
            };
        } else {
            newSource = {
                urlOrFile: files,
                description: 'data.zarr'
            };
        }
        useViewerStore.setState({ source: newSource });
    };
    return useReactDropzone({
        onDrop: handleSubmitFile
    });
};
