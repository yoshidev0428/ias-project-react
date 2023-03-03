import { useDropzone as useReactDropzone } from 'react-dropzone';
import { useViewerStore } from '../state';

export const useDropzone = () => {
  const handleSubmitFile = (files) => {
    let newSource;
    if (files.length === 1) {
      newSource = {
        urlOrFile: files[0],
        // Use the trailing part of the URL (file name, presumably) as the description.
        description: files[0].name,
      };
    } else {
      newSource = {
        urlOrFile: files,
        description: 'data.zarr',
      };
    }
    useViewerStore.setState({ source: newSource });
  };
  return useReactDropzone({
    onDrop: handleSubmitFile,
  });
};
