import mainApiService from '@/services/mainApiService';

export const getImageByPath = async (folder, imagePath) => {
  const blob = await mainApiService.get(`/static/${folder}/${imagePath}`, {
    responseType: 'blob',
  });
  const file = new File([blob], imagePath, { type: 'image/tiff' });
  file.path = imagePath;
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
