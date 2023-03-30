import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import { Row, Col, Button, Form, Image } from 'react-bootstrap';
import * as Icon from './ModelIcons';
import store from '@/reducers';
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
    }
  };

  const action = async () => {
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
      await api_experiment.get_model('all');
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
    tissuenet: Icon.imgTissueNet,
    nuclei: Icon.imgNuchel,
    cyto: Icon.imgCyto,
    layer: Icon.imgLayer,
    wafer: Icon.imgWafer,
    animal: Icon.imgAnimal,
    bacteria: Icon.imgBacteria,
    human: Icon.imgHuman,
    stem: Icon.imgStem,
    dl: Icon.imgDL,
    dna1: Icon.imgDNA1,
    dna2: Icon.imgDNA2,
    human2: Icon.imgHuman2,
    ml: Icon.imgML,
    noun1: Icon.imgNoun1,
    noun2: Icon.imgNoun2,
    noun3: Icon.imgNoun3,
    noun4: Icon.imgNoun4,
    noun5: Icon.imgNoun5,
    noun6: Icon.imgNoun6,
    noun7: Icon.imgNoun7,
    noun8: Icon.imgNoun8,
    noun9: Icon.imgNoun9,
    noun10: Icon.imgNoun10,
    noun11: Icon.imgNoun11,
    noun12: Icon.imgNoun12,
    noun13: Icon.imgNoun13,
    noun14: Icon.imgNoun14,
    noun15: Icon.imgNoun15,
    noun16: Icon.imgNoun16,
    noun17: Icon.imgNoun17,
    noun18: Icon.imgNoun18,
    noun19: Icon.imgNoun19,
    noun20: Icon.imgNoun20,
    noun21: Icon.imgNoun21,
    noun22: Icon.imgNoun22
  };

  const handleSelectedMethod = (newValue) => {
    setSelectedIcon(newValue);
  };

  const ImageBox = () => {
    let icons = Object.keys(imgArray)
    if (icons.length > 0)
      return icons.map((icon) => (
        <div className="m-2" key={icon} style={{ width: '65px' }}>
          <div
            className={
              selectedIcon !== icon
                ? 'border method-img'
                : 'method-img-selected'
            }
            onClick={() => handleSelectedMethod(icon)}
          >
            <Image
              style={{ margin: '0 auto', width: '65px', height: '65px' }}
              src={imgArray[icon]}
              alt="no image"
            />
          </div>
        </div>
      ));
    else
      return (
        <>
          <div className="m-2" style={{ width: '65px' }}>
            <div className="border method-img"></div>
            <div className="label-text text-center">There is no icons.</div>
          </div>
        </>
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
                      <div className="img-container border p-2">
                        <ImageBox />
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
