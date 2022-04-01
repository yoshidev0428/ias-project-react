import * as React from 'react';
import SimpleDialog from "../../../../custom/SimpleDialog";
import { Col } from 'react-bootstrap';
import Button from '@mui/material/Button';

import {useFlagsStore} from "../../../../../components/state";

const FocusDialog = () => {
    
  const close = () => {
    useFlagsStore.setState({ Focusflag: false });
  };

  const selectROI = () => {
    console.log("selectROI");
  };

  return (
    <>
      <SimpleDialog title="Focus Stack"
        singleButton={false}
        okTitle = "Action"
        closeTitle = "Cancel"
        // // select="action"
        // close="visibleDialog = false"
        click={close}
      >
        <div className="d-flex justify-content-around mx-5 my-2">
          <Col className="d-flex justify-center align-center pa-0">
            <Button variant="contained" color="info" onClick={selectROI}>ROI</Button>
          </Col>
          <Col className="pa-0">
          </Col>
        </div>
      </SimpleDialog>
    </>
  );
}
export default FocusDialog;