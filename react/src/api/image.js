import store from '@/reducers';
import mainApiService from '@/services/mainApiService';

export const getImageByPath = async (path) => {
  const userId = store.getState().auth.user._id;
  const blob = await mainApiService.get(`/static/${userId}/${path}`, {
    responseType: 'blob',
  });
  const file = new File([blob], path, { type: 'image/tiff' });
  file.path = path;
  return file;
};

export const getFoucsStackedImage = async (images, onUploadProgress) => {
  const formData = new FormData();
  images.forEach((file) => formData.append('imageFiles', file));
  return mainApiService.post('image/tile/focus-stack', formData, {
    onUploadProgress,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getSuperResoutionImage = async (
  experiment,
  filename,
  scale = 4,
) => {
  return mainApiService.get(
    `image/tile/super-resolution/${experiment}/${filename}/${scale}`,
  );
};
