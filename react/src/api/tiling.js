import mainApiService from '@/services/mainApiService';

export const uploadTiles = async (files) => {
  const formData = files.reduce((acc, file) => {
    acc.append('files', file);
    return acc;
  }, new FormData());
  return await mainApiService.post('/image/tile/upload_tiles', formData);
};

export const getTiles = async () => {
  return await mainApiService.get('/image/tile/get_tiles');
};
