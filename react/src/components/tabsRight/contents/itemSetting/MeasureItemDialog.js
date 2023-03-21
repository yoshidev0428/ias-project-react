import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Candidate from './contents/measureItem/Candidate';
import Selected from './contents/measureItem/Selected';
import Icon from '@mdi/react';
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronDoubleRight,
  mdiTrashCanOutline,
} from '@mdi/js';

export default function MeasureItemDialog(props) {
  const [open] = useState(true);
  const [tab, setTab] = useState(0);
  const maxDialogWidth = 800;

  const handleTabChange = (_event, newValue) => {
    setTab(newValue);
  };

  const handleClose = () => {
    props.closeDialog();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'800'}>
      <div className="d-flex border-bottom">
        <DialogTitle>Measure Item</DialogTitle>
        <button
          className="dialog-close-btn"
          color="primary"
          size="small"
          onClick={handleClose}
        >
          &times;
        </button>
      </div>
      <div style={{ width: maxDialogWidth }} className="border">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} className="">
            <Tab className="common-tab-button" label="Class 1" />
            <Tab className="common-tab-button" label="Class 2" />
            <Tab className="common-tab-button" label="Class 3" />
            <Tab className="common-tab-button" label="Class 4" />
            <Tab className="common-tab-button" label="Class 5" />
            <Tab className="common-tab-button" label="Class 6" />
            <Tab className="common-tab-button" label="Class 7" />
          </Tabs>
          <div
            className="d-flex justify-content-between"
            style={{ margin: '0 12px 12px 12px' }}
          >
            <Candidate />
            <DialogActions
              className="d-flex"
              style={{ flexDirection: 'column', justifyContent: 'center' }}
            >
              <Button>
                <Icon
                  size={1.2}
                  horizontal
                  vertical
                  rotate={180}
                  color="#000000de"
                  path={mdiChevronRight}
                  style={{ border: '1px solid #000000de' }}
                ></Icon>
              </Button>
              <Button style={{ margin: '0' }}>
                <Icon
                  size={1.2}
                  horizontal
                  vertical
                  rotate={180}
                  color="#000000de"
                  path={mdiChevronDoubleRight}
                  style={{ border: '1px solid #000000de' }}
                ></Icon>
              </Button>
              <Button style={{ margin: '0' }}>
                <Icon
                  size={1.2}
                  horizontal
                  vertical
                  rotate={180}
                  color="#000000de"
                  path={mdiChevronLeft}
                  style={{ border: '1px solid #000000de' }}
                ></Icon>
              </Button>
              <Button style={{ margin: '0' }}>
                <Icon
                  size={1.2}
                  horizontal
                  vertical
                  rotate={180}
                  color="#000000de"
                  path={mdiTrashCanOutline}
                  style={{ border: '1px solid #000000de' }}
                ></Icon>
              </Button>
            </DialogActions>
            <Selected />
          </div>
        </Box>
      </div>
      <div>
        <DialogActions>
          {/* <Button
            className=""
            variant="contained"
            color="primary"
            size="small"
            onClick={handleClose}
          >
            OK
          </Button> */}
          <Button
            className=""
            variant="contained"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            Adjust
          </Button>
          <Button
            className=""
            variant="contained"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className=""
            variant="contained"
            color="primary"
            size="small"
            onClick={handleClose}
          >
            Select
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
