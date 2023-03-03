import React from 'react';
import Button from '@mui/material/Button';
import { useDropzone } from '../../../hooks/use-dropzone';

export default function DropzoneButton() {
  const { getRootProps, getInputProps } = useDropzone();

  return (
    <Button
      fullWidth
      variant="outlined"
      style={{
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
        height: '2rem',
      }}
      size="small"
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...getRootProps()}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input {...getInputProps({ accept: '.tif, .tiff' })} />
      Choose a file
    </Button>
  );
}
