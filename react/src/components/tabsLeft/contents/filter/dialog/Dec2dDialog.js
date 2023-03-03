import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Draggable from 'react-draggable';
import Paper from '@mui/material/Paper';
import { useFlagsStore } from '@/components/state';
import { useChannelsStore } from '@/viv/state';
import { DeblurMethods } from '@/viv/constants/enums';

const Dec2dDialog = () => {
  const dialogFlag = useFlagsStore((store) => store.dialogFlag);
  const setDeConv2D = useChannelsStore((state) => state.setDeConv2D);

  const onClose = () => {
    useFlagsStore.setState({ dialogFlag: false });
  };

  const handleSet = () => {
    setDeConv2D(DeblurMethods.laplacian, 3);
    onClose();
  };

  const handleReset = () => {
    setDeConv2D(DeblurMethods.none, 1);
    onClose();
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
    <Dialog
      open={dialogFlag}
      onClose={onClose}
      maxWidth="lg"
      PaperComponent={PaperComponent}
      hideBackdrop={true}
      disableScrollLock
    >
      <DialogTitle>2D Deconvolution</DialogTitle>
      {/* <DialogContent>
        <Grid container spacing={4} itemsCenter>
          <Grid item cols={3}>
            <Typography>Effectiveness</Typography>
          </Grid>
          <Grid item cols={9}>
            <Slider size="small" style={{ width: 200 }} min={1} max={9} step={2} value={size} onChange={(_event, val) => setSize(val)} />
          </Grid>
        </Grid>
      </DialogContent> */}
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          size="medium"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleSet}
        >
          Set
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleReset}
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default Dec2dDialog;
