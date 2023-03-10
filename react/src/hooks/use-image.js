import { useEffect } from 'react';
import shallow from 'zustand/shallow';
import store from '@/reducers';
import {
  useChannelsStore,
  useImageSettingsStore,
  useLoader,
  useMetadata,
  useViewerStore,
} from '@/state';
import {
  createLoader,
  buildDefaultSelection,
  guessRgb,
  getMultiSelectionStats,
  getBoundingCube,
  isInterleaved,
} from '@/helpers/avivator';
import { COLOR_PALLETE, FILL_PIXEL_VALUE } from '@/constants';

export const useImage = (source) => {
  const { use3d, toggleUse3d, tiffNames, experimentName } = useViewerStore(
    (state) => state,
    shallow,
  );
  const loader = useLoader();
  const metadata = useMetadata();

  useEffect(() => {
    const changeLoader = async () => {
      useViewerStore.setState({ isChannelLoading: [true] });
      useViewerStore.setState({ isViewerLoading: true });
      store.dispatch({ type: 'image_loading_state_change', content: true });
      if (use3d) toggleUse3d();
      const newLoader = await createLoader(source, (message) => {
        useViewerStore.setState({
          loaderErrorSnackbar: { on: true, message },
        });
      });
      let nextMeta;
      let nextLoader;
      if (Array.isArray(newLoader)) {
        if (newLoader.length > 1) {
          nextMeta = newLoader.map((l) => l.metadata);
          nextLoader = newLoader.map((l) => l.data);
        } else {
          nextMeta = newLoader[0].metadata;
          nextLoader = newLoader[0].data;
        }
      } else {
        nextMeta = newLoader.metadata;
        nextLoader = newLoader.data;
      }

      if (nextLoader) {
        useChannelsStore.setState({ loader: nextLoader });
        useViewerStore.setState({ metadata: nextMeta });
      }
      if (nextLoader) {
        useChannelsStore.setState({ loader: nextLoader });
        useViewerStore.setState({
          metadata: nextMeta,
        });
        if (use3d) toggleUse3d();
      }
    };
    if (source) changeLoader();
  }, [source]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const changeSettings = async () => {
      // Placeholder
      useViewerStore.setState({ isChannelLoading: [true] });
      useViewerStore.setState({ isViewerLoading: true });
      store.dispatch({ type: 'image_loading_state_change', content: true });

      let newSelections = buildDefaultSelection(loader[0]);
      const { Channels } = metadata.Pixels;
      const channelOptions = Channels.map((c, i) => c.Name ?? `Channel ${i}`);
      // Default RGB.
      let newContrastLimits = [];
      let newDomains = [];
      let newColors = [];
      const isRgb = guessRgb(metadata);
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
            [0, 255],
          ];
          newDomains = [
            [0, 255],
            [0, 255],
            [0, 255],
          ];
          newColors = [
            [255, 0, 0],
            [0, 255, 0],
            [0, 0, 255],
          ];
        }
        useViewerStore.setState({ useColormap: false, useLens: false });
      } else {
        const stats = await getMultiSelectionStats({
          loader,
          selections: newSelections,
          tiff_names: tiffNames,
          experiment_name: experimentName,
          use3d: use3d || source?.is3dView,
        });
        newDomains = stats.domains;
        newContrastLimits = stats.contrastLimits;
        // If there is only one channel, use white.
        if (newDomains.length === 1) {
          newColors = [[255, 255, 255]];
        } else {
          for (let i = 0; i < newDomains.length; i++) {
            newColors.push(COLOR_PALLETE[i]);
          }
        }
        newColors =
          newDomains.length === 1
            ? [[255, 255, 255]]
            : newDomains.map((_, i) => COLOR_PALLETE[i]);
        useViewerStore.setState({
          useLens: channelOptions.length !== 1,
          useColormap: true,
        });
      }
      useChannelsStore.setState({
        ids: newDomains.map(() => String(Math.random())),
        selections: newSelections,
        domains: newDomains,
        contrastLimits: newContrastLimits,
        colors: newColors,
        channelsVisible: newColors.map(() => true),
      });
      useViewerStore.setState({
        isChannelLoading: newSelections.map((i) => !i),
        isViewerLoading: false,
        pixelValues: new Array(newSelections.length).fill(FILL_PIXEL_VALUE),
        globalSelection: newSelections[0],
        channelOptions,
      });
      store.dispatch({ type: 'image_loading_state_change', content: false });
      const [xSlice, ySlice, zSlice] = getBoundingCube(loader);
      useImageSettingsStore.setState({ xSlice, ySlice, zSlice });
    };
    if (metadata) changeSettings();
  }, [loader, metadata]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useImage;
