import store from '@/reducers';
import { FILE_TYPES } from '../constants/file-types';

export const getFileName = (fname) => {
  const regex = /(.*)\.[^\.]+/g; /* eslint-disable-line */
  let filename = regex.exec(fname);

  return filename ? filename[1] : '';
};

export const getFileExtension = (filename) => {
  const regex = /(?:\.([^.]+))?$/;
  let extension = regex.exec(filename);

  return extension ? '.' + extension[1] : '';
};

export const checkFileType = (filename) => {
  const extension = getFileExtension(filename);

  return FILE_TYPES.includes(extension.toLowerCase());
};

export const base64ToArrayBuffer = (base64) => {
  var binary_string = atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

export const readEntriesAsync = (reader) => {
  return new Promise((resolve, reject) => {
    reader.readEntries(
      (entries) => {
        resolve(entries);
      },
      (error) => reject(error),
    );
  });
};

export const enumerateDirectory = async (directoryEntry) => {
  let reader = directoryEntry.createReader();
  let resultEntries = [];

  let read = async function () {
    let entries = await readEntriesAsync(reader);
    if (entries.length > 0) {
      resultEntries = resultEntries.concat(entries);
      await read();
    }
  };

  await read();
  return resultEntries;
};

export const isOverlapped = (a, b) => {
  return (
    Math.max(a[1], b[1]) - Math.min(a[0], b[0]) < a[1] - a[0] + (b[1] - b[0])
  );
};

export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    let _image = new Image();
    _image.onload = () => resolve(_image);
    _image.onerror = reject;
    _image.src = src;
  });
};

export const getStaticPath = (path, userDir = false) => {
  let newPath = path;

  if (userDir) {
    const userId = store.getState().auth.user._id;
    newPath = `${userId}/${path}`;
  }

  return `${process.env.REACT_APP_BASE_API_URL}/static/${newPath}`.replaceAll(
    /\/+/g,
    '/',
  );
};
