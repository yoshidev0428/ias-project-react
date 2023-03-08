import mainApiService from '@/services/mainApiService';

export const getImageByPath = async (folder, imagePath) => {
  const blob = await mainApiService.get(`/static/${folder}/${imagePath}`, {
    responseType: 'blob',
  });
  const file = new File([blob], imagePath, { type: 'image/tiff' });
  file.path = imagePath;
  return file;
};
