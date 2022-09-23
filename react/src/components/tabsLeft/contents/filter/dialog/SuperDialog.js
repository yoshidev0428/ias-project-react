import * as React from 'react';
import SimpleDialog from "../../../../custom/SimpleDialog";
import { Row, Col } from 'react-bootstrap';
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

import {useFlagsStore} from "../../../../../components/state";

const SuperDialog = () => {
  
  const Superflag = useFlagsStore(store => store.Superflag);
  
  const close = () => {
    useFlagsStore.setState({ Superflag: false });
    console.log("flag Status--->" + Superflag);
  };

  const selectROI = () => {
    console.log("selectROI");
  };

  return (
    <>
      <SimpleDialog title="Super Resolution"
        singleButton={false}
        okTitle = "Action"
        closeTitle = "Cancel"
        // // select="action"
        // close="visibleDialog = false"
        click={close}
      >
        <div fluid={true} className="d-flex justify-space-between mx-3">
          <Row noGutters className="d-flex justify-center align-center pa-0">
            <Col xs={8} className="pa-0">
              <Stack spacing={2} padding={2}>
                <Button fullWidth className="mr-2 text-capitalize" variant="contained" color="info" onClick={selectROI}>Bright Field</Button>
                <Button fullWidth className="mr-2 mt-2 text-capitalize" variant="contained" color="info" onClick={selectROI}>fluorescence</Button>
              </Stack>
            </Col>
            <Col xs={4} className="d-flex justify-center align-center pa-1">
              <Stack spacing={2}/>
              <Button variant="contained" color="info" onClick={selectROI}>ROI</Button>
            </Col>
          </Row>
          <Row noGutters className="pa-0">
            <ListSubheader>Effectiveness</ListSubheader>
            <Slider size="small" defaultValue={50} />
          </Row>
        </div>
      </SimpleDialog>
    </>
  );
}
export default SuperDialog;