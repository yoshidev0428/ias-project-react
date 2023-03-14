import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import { Row, Col, Button, Form, Image } from 'react-bootstrap';
import imgTissueNet from '../../../../../assets/cell/tissue_net.png';
import imgNuchel from '../../../../../assets/cell/nuchel.png';
import imgCyto from '../../../../../assets/cell/cyto.png';
import imgLayer from '../../../../../assets/cell/layer.png';
import imgWafer from '../../../../../assets/cell/wafer.png';
import imgAnimal from '../../../../../assets/cell/animal.png';
import imgBacteria from '../../../../../assets/cell/bacteria.png';
import imgHuman from '../../../../../assets/cell/human.png';
import imgStem from '../../../../../assets/cell/embryonic_stem.png';
import store from '../../../../../reducers';
import { useState } from 'react';
import * as api_experiment from '@/api/experiment';

const CustomNameDialog = () => {
  const DialogCustomNameFlag = useFlagsStore(
    (store) => store.DialogCustomNameFlag,
  );
  const [selectedIcon, setSelectedIcon] = useState('tissuenet');
  const state = store.getState();
  const segInfo = state.experiment.seg_info;
  const [modelName, setModelName] = useState('');

  const close = (event, reason) => {
    if (reason != 'backdropClick') {
      useFlagsStore.setState({ DialogCellposeFlag: true });
      useFlagsStore.setState({ DialogCustomNameFlag: false });
      console.log('flag Status--->' + DialogCustomNameFlag);
    }
  };

  const action = async () => {
    console.log('flag Status---> Action');
    if (modelName === '') {
      alert('Please enter your model name.');
      return;
    }
    segInfo.custom_name = modelName;
    segInfo.custom_icon = selectedIcon;
    store.dispatch({ type: 'set_custom_name', content: modelName });
    let respond = await api_experiment.save_model(segInfo);

    if (respond.data.error) {
      alert('Please choose another model name');
      let respond = await api_experiment.get_model('all');
      console.log('models', respond.data.data);
    } else if (respond.data.success == 'OK') {
      useFlagsStore.setState({ DialogCustomNameFlag: false });
      useFlagsStore.setState({ DialogCustomFlag: true });
    }
  };

  const handleBackdropClick = (e) => {
    //these fail to keep the modal open
    e.stopPropagation();
    return false;
  };

  const imgArray = {
    tissuenet: imgTissueNet,
    nuclei: imgNuchel,
    cyto: imgCyto,
    layer: imgLayer,
    wafer: imgWafer,
    animal: imgAnimal,
    bacteria: imgBacteria,
    human: imgHuman,
    stem: imgStem,
  };

  const handleSelectedMethod = (newValue) => {
    setSelectedIcon(newValue);
  };

  const ImageBox = (props) => {
    return (
      <div
        className={
          selectedIcon !== props.methodName
            ? 'border method-img'
            : 'method-img-selected'
        }
        onClick={() => handleSelectedMethod(props.methodName)}
      >
        <Image
          style={{ margin: '0 auto', width: '65px', height: '65px' }}
          src={imgArray[props.methodName]}
          alt="no image"
        />
      </div>
    );
  };

  return (
    <>
      <Dialog
        open={DialogCustomNameFlag}
        onClose={close}
        maxWidth={'450'}
        onBackdropClick={handleBackdropClick}
      >
        <div className="d-flex border-bottom">
          <DialogTitle>Custom Name</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div className="mx-3 my-2" style={{ width: 450 }}>
          <Row>
            <Col xs={12}>
              <div className="p-3">
                <h6>Select</h6>
                <div>
                  <Row className="my-3">
                    <Col xs={3} className="text-right">
                      <p className="mb-0 mt-1">Name</p>
                    </Col>
                    <Col xs={9}>
                      <Form.Control
                        placeholder=""
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={3} className="text-right">
                      <p className="mb-0 mt-1">Icon</p>
                    </Col>
                    <Col xs={9}>
                      <div className="border overflow-auto d-flex p-2">
                        <ImageBox methodName="tissuenet" />
                        <ImageBox methodName="nuclei" />
                        <ImageBox methodName="cyto" />
                        <ImageBox methodName="layer" />
                        <ImageBox methodName="wafer" />
                        <ImageBox methodName="animal" />
                        <ImageBox methodName="bacteria" />
                        <ImageBox methodName="human" />
                        <ImageBox methodName="stem" />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
            <Button variant="contained" onClick={action}>
              Register
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
export default CustomNameDialog;
