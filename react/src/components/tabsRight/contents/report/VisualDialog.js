import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useFlagsStore } from '@/state';
import VisualToolbar from './VisualToolbar';
import AnalysisList from './AnalysisList';
import VisualImageList from './VisualImageList';
import VisualLineChart from './VisualLineChart';
import VisualTable from './VisualTable';

const VisualDialog = () => {
  const DialogVisualFlag = useFlagsStore((store) => store.DialogVisualFlag);
  const close = () => {
    useFlagsStore.setState({ DialogVisualFlag: false });
  };

  return (
    <>
      <Dialog
        open={DialogVisualFlag}
        onClose={close}
        overflow-y="hidden"
        maxWidth="750px"
        style={{ height: 'auto' }}
      >
        <div className="visual-dialog">
          <div className="d-flex justify-content-center visual-title">
            <DialogTitle>Visual</DialogTitle>
            <button
              className="dialog-close-btn"
              style={{ backgroundColor: 'white' }}
              color="primary"
              onClick={close}
            >
              &times;
            </button>
          </div>
          <div
            className="mx-3 my-2 d-flex align-items-center justify-content-center visual-toolbar"
            style={{ width: 750 }}
          >
            <VisualToolbar />
          </div>
          <div className="mx-3 my-2 visual-main-body" style={{ width: 750 }}>
            <div className="mx-1 visual-sidebar">
              <AnalysisList />
            </div>
            <div className="visual-main-panel">
              <div className="visual-main-panel-screen">
                <VisualImageList />
                <VisualLineChart />
              </div>
              <div className="visual-amin-panel-table">
                <VisualTable rowHeaders caption="Grindcore bands" sortable />
              </div>
            </div>
          </div>
          <div className="visual-footer"></div>
        </div>
      </Dialog>
    </>
  );
};

export default VisualDialog;
