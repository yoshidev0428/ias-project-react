import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import { Row, Col, Button, Form } from 'react-bootstrap';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import store from '@/reducers';

const CellposeDialog = () => {
  const DialogCellposeFlag = useFlagsStore((store) => store.DialogCellposeFlag);
  const state = store.getState();
  const [selectedMethod, setSelectedMethod] = React.useState(
    state.experiment.method,
  );
  const [customName] = React.useState(state.experiment.custom_name);
  const segInfo = state.experiment.seg_info;
  const methods = {
    tissuenet: 'TissueNet',
    nuclei: 'Nuclei',
    cyto: 'Cyto',
    layer: 'Layer',
    Wafer: 'wafer',
    livecell: 'LiveCell',
    cyto2: 'Cyto2',
    CP: 'CP',
    CPx: 'CPx',
    TN1: 'TN1',
    TN2: 'TN2',
    TN3: 'TN3',
    LC1: 'LC1',
    LC2: 'LC2',
    LC3: 'LC3',
    LC4: 'LC4',
  };

  const close = (_event, reason) => {
    if (reason !== 'backdropClick') {
      useFlagsStore.setState({ DialogBasicFlag: true });
      useFlagsStore.setState({ DialogCellposeFlag: false });
    }
  };

  const action = () => {
    segInfo.custom_name = customName;
    segInfo.custom_method = selectedMethod;
    segInfo.outline = outline;
    segInfo.cell_diam = diameter;
    segInfo.chan_segment = segment;
    segInfo.chan_2 = chan2;
    segInfo.f_threshold = f_threshold;
    segInfo.c_threshold = c_threshold;
    segInfo.s_threshold = s_threshold;
    store.dispatch({ type: 'set_seg_info', content: segInfo });
    useFlagsStore.setState({ DialogCellposeFlag: false });
    useFlagsStore.setState({ DialogCustomNameFlag: true });
  };

  const [outline, setOutline] = React.useState(0);
  const handleOutline = (event) => {
    setOutline(event.target.value);
  };

  const [diameter, setDiameter] = React.useState(30);
  const handleDiam = (event) => {
    setDiameter(event.target.value);
  };

  const [segment, setSegment] = React.useState(0);

  const handleChangeSegment = (event) => {
    setSegment(event.target.value);
  };
  const [chan2, setChan2] = React.useState(0);

  const handleChangeChan2 = (event) => {
    setChan2(event.target.value);
  };

  const [f_threshold, setF_Threshold] = React.useState(0.4);
  const handleF_Threshold = (event) => {
    setF_Threshold(event.target.value);
  };

  const [c_threshold, setC_Threshold] = React.useState(0.0);
  const handleC_Threshold = (event) => {
    setC_Threshold(event.target.value);
  };

  const [s_threshold, setS_Threshold] = React.useState(0.0);
  const handleS_Threshhold = (event) => {
    setS_Threshold(event.target.value);
  };

  const handleBackdropClick = (e) => {
    //these fail to keep the modal open
    e.stopPropagation();
    return false;
  };

  return (
    <>
      <Dialog
        open={DialogCellposeFlag}
        onClose={close}
        hideBackdrop={true}
        onBackdropClick={handleBackdropClick}
        disableScrollLock
        aria-labelledby="draggable-dialog-title"
        maxWidth={'450'}
        maxheight={'800'}
      >
        <div className="d-flex border-bottom">
          <DialogTitle>{`${customName}-${methods[selectedMethod]}`}</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div className="mx-3 my-2" style={{ width: 350 }}>
          <Row>
            <Col xs={12}>
              <div className="pt-3 px-3 pb-1 border-bottom">
                {/* <h6>Drawing</h6> */}
                <h6>Select the result image</h6>
                <div>
                  <Row className="mt-3">
                    <Col xs={6} className="mt-3">
                      <FormControl fullWidth>
                        <InputLabel id="segment-label">Result Image</InputLabel>
                        <Select
                          labelId="segment-label"
                          id="segment-label-select"
                          value={outline}
                          label="result type"
                          onChange={handleOutline}
                        >
                          <MenuItem value={0}>Predicted Outlines</MenuItem>
                          <MenuItem value={1}>Predicted Masks</MenuItem>
                          <MenuItem value={2}>Predicted Cell pose</MenuItem>
                        </Select>
                      </FormControl>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="pt-2 px-3 pb-1 border-bottom">
                <Row>
                  <Col xs={6}>
                    <h6 className="mt-2">Segmentation</h6>
                  </Col>
                  <Col xs={6}>
                    {/*    <FormControlLabel control={<Checkbox/>} label="use GPU"/>*/}
                  </Col>
                </Row>
                <Row className="mt-0">
                  <Col xs={12}>
                    <Form.Label>cell diameter (pixels)</Form.Label>
                  </Col>
                  <Col xs={6}>
                    <Form.Control
                      type="number"
                      value={diameter}
                      onChange={handleDiam}
                    />
                  </Col>
                  <Col xs={6}>
                    {/* <Button variant="primary">callbrate</Button> */}
                  </Col>
                  <Col xs={6} className="mt-3">
                    <FormControl fullWidth>
                      <InputLabel id="segment-label">
                        Segment Color
                      </InputLabel>
                      <Select
                        labelId="segment-label"
                        id="segment-label-select"
                        value={segment}
                        label="chan to segment"
                        onChange={handleChangeSegment}
                      >
                        <MenuItem value={0}>0: gray</MenuItem>
                        <MenuItem value={1}>1: R</MenuItem>
                        <MenuItem value={2}>2: G</MenuItem>
                        <MenuItem value={3}>3: B</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  <Col xs={6} className="mt-3">
                    <FormControl fullWidth>
                      <InputLabel id="chan2-label">Nuclei Color</InputLabel>
                      <Select
                        labelId="chan2-label"
                        id="chan2-select"
                        value={chan2}
                        label="chan2 (optional)"
                        onChange={handleChangeChan2}
                      >
                        <MenuItem value={0}>0: none</MenuItem>
                        <MenuItem value={1}>1: R</MenuItem>
                        <MenuItem value={2}>2: G</MenuItem>
                        <MenuItem value={3}>3: B</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Label className="mt-1">flow_threshold</Form.Label>
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Control
                      type="text"
                      value={f_threshold}
                      onChange={(e) => handleF_Threshold(e)}
                    />
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Label className="mt-1">cellprob_threshold</Form.Label>
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Control
                      type="text"
                      value={c_threshold}
                      onChange={(e) => handleC_Threshold(e)}
                    />
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Label className="mt-1">stitch_threshold</Form.Label>
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Control
                      type="text"
                      value={s_threshold}
                      onChange={(e) => handleS_Threshhold(e)}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
            <Button variant="contained" onClick={action}>
              Set
            </Button>
            <Button variant="contained" onClick={close}>
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
export default CellposeDialog;
