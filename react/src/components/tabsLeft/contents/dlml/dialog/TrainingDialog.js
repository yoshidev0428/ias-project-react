import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import { Row, Col, Button, Form } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import store from '@/reducers';
import { connect } from 'react-redux';
import * as api_experiment from '@/api/experiment';
import { isNull } from 'lodash';

const mapStateToProps = (state) => ({
  selectedModel: state.experiment.current_model,
});

const TrainingDialog = (props) => {
  const DialogTrainingFlag = useFlagsStore((store) => store.DialogTrainingFlag);
  const state = store.getState();
  const [selectedMethod, setSelectedMethod] = React.useState(
    state.experiment.method,
  );
  const [customName] = React.useState(state.experiment.custom_name);
  const train_info = state.experiment.train_info;
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

  const getImageByUrl = async function (imagePath) {
    try {
      const state = store.getState();

      const response = await fetch(
        process.env.REACT_APP_BASE_API_URL +
          'static/' +
          state.auth.user._id +
          '/' +
          imagePath,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
              'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers':
              'Origin, Content-Type, X-Auth-Token',
            Authorization: state.auth.tokenType + ' ' + state.auth.token,
          },
        },
      );
      const blob = await response.blob();
      const file = new File([blob], imagePath, { type: 'image/tiff' });
      file.path = imagePath;
      return file;
    } catch (err) {
      return null;
    }
  };

  const close = (_event, reason) => {
    if (reason !== 'backdropClick') {
      useFlagsStore.setState({ DialogTrainingFlag: false });
    }
  };

  const action = async () => {
    train_info.init_model = init_model;
    train_info.model_name = model_name;
    train_info.segment = segment;
    train_info.chan2 = chan2;
    train_info.learning_rate = learning_rate;
    train_info.weight_decay = weight_decay;
    train_info.n_epochs = n_epochs;
    store.dispatch({ type: 'set_train_info', content: train_info });
    const state = store.getState();
    if (isNull(state.files.imagePathForAvivator)) {
      alert('Please enter your image file!');
      return;
    }
    let imgPath = state.files.imagePathForAvivator[0].path;
    let exp_name = imgPath.split('/');
    exp_name = exp_name[0];
    useFlagsStore.setState({ DialogTrainingFlag: false });
    useFlagsStore.setState({ DialogLoadingFlag: true });
    let result = await api_experiment.train_model(
      imgPath,
      exp_name,
      train_info
    );
    if (result.data.success === 'OK') {
      alert(
        'Your model is successfully trained!',
      );
      useFlagsStore.setState({ DialogLoadingFlag: false });
      return;
    }
  };

  const [init_model, setInitModel] = React.useState('tissuenet');
  const handleInitModel = (event) => {
    setInitModel(event.target.value);
    console.log(`InitModel: ${event.target.value}`);
  };

  const [model_name, setModelName] = React.useState('');
  const handleModelName = (event) => {
    setModelName(event.target.value);
  };

  const [segment, setSegment] = React.useState(0);

  const handleChangeSegment = (event) => {
    setSegment(event.target.value);
  };
  const [chan2, setChan2] = React.useState(0);

  const handleChangeChan2 = (event) => {
    setChan2(event.target.value);
  };

  const [learning_rate, setLearningRate] = React.useState(0.1);
  const handleLearningRate = (event) => {
    setLearningRate(event.target.value);
  };

  const [weight_decay, setWeightDecay] = React.useState(0.0001);
  const handleWeightDecay = (event) => {
    setWeightDecay(event.target.value);
  };

  const [n_epochs, setEpochs] = React.useState(100);
  const handleEpochs = (event) => {
    setEpochs(event.target.value);
  };

  const handleBackdropClick = (e) => {
    //these fail to keep the modal open
    e.stopPropagation();
    return false;
  };

  const ModelBox = () => {
    return (
      <>
        <InputLabel id="segment-label">initial model</InputLabel>
        <Select
          labelId="segment-label"
          id="segment-label-select"
          value={init_model}
          label="result type"
          onChange={handleInitModel}
        >
          {Object.keys(methods).map((model) => (
            <MenuItem key={model} value={model}>{methods[model]}</MenuItem>
            ))}
        </Select>
      </>
    )
  }

  useEffect(() => {
    // initCanvas();
    // SetCanvasInfo(props.canvas_info)
    console.log('model_info', props.selectedModel);
    setInitModel(props.selectedModel.custom_method);
    setModelName(props.selectedModel.custom_name);
    setSegment(props.selectedModel.chan_segment);
    setChan2(props.selectedModel.chan_2);
  }, [props]);



  return (
    <>
      <Dialog
        open={DialogTrainingFlag}
        onClose={close}
        hideBackdrop={true}
        onBackdropClick={handleBackdropClick}
        disableScrollLock
        aria-labelledby="draggable-dialog-title"
        maxWidth={'450'}
        maxheight={'800'}
      >
        <div className="d-flex border-bottom">
          <DialogTitle>Train Settings</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div className="mx-3 my-2" style={{ width: 350 }}>
          <Row>
            <Col xs={12}>
              <div className="pt-3 px-3 pb-1 border-bottom">
                {/* <h6>Drawing</h6> */}
                <h6>Select the model</h6>
                <div>
                  <Row className="mt-3">
                    <Col xs={6} className="mt-3">
                      <FormControl fullWidth>
                          <ModelBox/>
                      </FormControl>
                    </Col>
                    <Col xs={6}>
                      <Form.Label>model_name</Form.Label>
                      <Form.Control
                        type="text"
                        value={model_name}
                        onChange={handleModelName}
                      />
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
                    <Form.Label className="mt-1">learning_rate</Form.Label>
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Control
                      type="text"
                      value={learning_rate}
                      onChange={(e) => handleLearningRate(e)}
                    />
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Label className="mt-1">weight_decay</Form.Label>
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Control
                      type="text"
                      value={weight_decay}
                      onChange={(e) => handleWeightDecay(e)}
                    />
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Label className="mt-1">n_epochs</Form.Label>
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Control
                      type="text"
                      value={n_epochs}
                      onChange={(e) => handleEpochs(e)}
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
              OK
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
export default connect(mapStateToProps)(TrainingDialog);
