import React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Draggable from 'react-draggable';
import Paper from '@mui/material/Paper';
import DialogContent from '@mui/material/DialogContent';
import Dropzone from 'react-dropzone';
import { useFlagsStore } from '@/state';
import { getFoucsStackedImage } from '@/api/image';
import { Typography } from '@mui/material';

const FocusDialog = () => {
  const Focusflag = useFlagsStore((store) => store.Focusflag);
  const [files, setFiles] = React.useState([]);
  const [resultImage, setResultImage] = React.useState();
  const [status, setStatus] = React.useState();

  const close = () => {
    useFlagsStore.setState({ Focusflag: false });
  };

  const handleProcess = async () => {
    const { result } = await getFoucsStackedImage(files, (e) => {
      const prog = !e.total ? 0 : Math.floor((100 * e.loaded) / e.total);
      if (prog === 100) {
        setStatus(`Processing images`);
      } else {
        setStatus(`Upload completed ${prog}%`);
      }
    });
    setResultImage(`${process.env.REACT_APP_BASE_API_URL}/${result}`);
    setStatus(`Calculation completed`);
  };

  function PaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

  return (
    <>
      <Dialog
        open={Focusflag}
        onClose={close}
        maxWidth={'750'}
        PaperComponent={PaperComponent}
        hideBackdrop={true}
        disableScrollLock
      >
        <div className="d-flex border-bottom">
          <DialogTitle>Focus Stack</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <DialogContent>
          {status ? (
            <Typography>{status}</Typography>
          ) : (
            <Dropzone
              onDrop={(files) => setFiles(files)}
              style={{ width: '100%' }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} id="file_upload" multiple />
                  {files.length === 0 ? (
                    <p className="border rounded p-4 text-center">
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  ) : (
                    <p className="border rounded p-4 text-center">
                      Selected {files.length} files
                    </p>
                  )}
                </div>
              )}
            </Dropzone>
          )}
          {resultImage && (
            <img src={resultImage} alt="result" style={{ width: '100%' }} />
          )}
        </DialogContent>
        <div className="mt-2">
          <DialogActions>
            <Button
              className=""
              variant="contained"
              color="success"
              size="medium"
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              className=""
              variant="contained"
              color="primary"
              size="medium"
              onClick={handleProcess}
            >
              Set
            </Button>
            <Button
              className=""
              variant="contained"
              color="primary"
              size="medium"
              onClick={close}
            >
              Set All
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
export default FocusDialog;
