import * as React from 'react';
import { Col } from 'react-bootstrap';
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import Slider from '@mui/material/Slider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import Draggable from 'react-draggable';
import Paper from '@mui/material/Paper';

const Dec3dDialog = () => {
  const Dialog3dflag = useFlagsStore((store) => store.Dialog3dflag);
  const close = () => {
    useFlagsStore.setState({ Dialog3dflag: false });
  };

  const action = () => {};

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
        open={Dialog3dflag}
        onClose={close}
        maxWidth={'350'}
        PaperComponent={PaperComponent}
        hideBackdrop={true}
        onBackdropClick="false"
        disableScrollLock
        aria-labelledby="draggable-dialog-title"
      >
        <div className="d-flex border-bottom">
          <DialogTitle>3D Deconvolution</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div
          className="d-flex justify-content-around mx-5 my-2"
          style={{ width: 350 }}
        >
          <Col className="pa-0">
            <ListSubheader>Effectiveness</ListSubheader>
            <Slider size="small" defaultValue={50} />
          </Col>
        </div>
        <div className="border-top mt-2">
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
              onClick={action}
            >
              Set
            </Button>
            <Button
              className=""
              variant="contained"
              color="primary"
              size="medium"
              onClick={action}
            >
              Set All
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
export default Dec3dDialog;
