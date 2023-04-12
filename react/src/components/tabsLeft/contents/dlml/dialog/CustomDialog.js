import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Row, Col, Button, Image } from 'react-bootstrap';
import CustomNameDialog from './CustomNameDialog';
//This is James Wang's code//
import store from '@/reducers';
import * as api_experiment from '@/api/experiment';
import { isNull } from 'lodash';
import * as Icon from './ModelIcons';
import { toTiffPath } from '@/helpers/avivator';
import { getImageUrl } from '@/helpers/file';


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 0 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const CustomDialog = () => {
  const DialogCustomFlag = useFlagsStore((store) => store.DialogCustomFlag);
  const DialogCustomNameFlag = useFlagsStore(
    (store) => store.DialogCustomNameFlag,
  );

  const showCustomNameDialog = async () => {
    const state = store.getState();
    if (isNull(state.files.imagePathForAvivator)) {
      alert('Please enter your image file!');
      return;
    }
    if (selectedIcon === '') {
      alert('Please select your model!');
      useFlagsStore.setState({ DialogLoadingFlag: false });
      return;
    }

    let imgPath = '';
    if(typeof state.files.imagePathForAvivator === 'string') {
      imgPath = state.files.imagePathForAvivator;
    }
    else if (typeof state.files.imagePathForAvivator === 'object') {
      imgPath = state.files.imagePathForAvivator[0].path;
    }
    let exp_name = imgPath.split('/');
    useFlagsStore.setState({ DialogCustomFlag: false });
    useFlagsStore.setState({ DialogLoadingFlag: true });
    let result = await api_experiment.testSegment(
      imgPath,
      exp_name,
      selectedIcon,
      );
    let imagePathForAvivator = null;
    if (result.data.error) {
      //alert("Error occured while getting the tree")
    } else {
      if (result.data.success === 'NO') {
        alert(
          'Your custom model is not suitable for this image. Please choose another model',
        );
        useFlagsStore.setState({ DialogLoadingFlag: false });
        return;
      }
      let file_path = result.data.success;
      exp_name = exp_name[exp_name.length-2];
      console.log('exp_name', exp_name);
      const file = await getImageUrl(exp_name + '/' + file_path, true, true);
      if (file) imagePathForAvivator = file
    }
    // if (imagePathForAvivator.length <= 0) imagePathForAvivator = null;
    store.dispatch({
      type: 'set_image_path_for_avivator',
      content: imagePathForAvivator,
    });
    useFlagsStore.setState({ DialogLoadingFlag: false });
  };

  const close = (event, reason) => {
    if (reason != 'backdropClick') {
      useFlagsStore.setState({ DialogCustomFlag: false });
    }
  };

  const [rightTabVal, setRightTabVal] = useState(0);
  const handleRightTabChange = (newValue) => {
    setRightTabVal(newValue);
  };

  const handleBackdropClick = (e) => {
    //these fail to keep the modal open
    e.stopPropagation();
    return false;
  };

  const [models, setModels] = useState([]);
  const get_models = async () => {
    let response = await api_experiment.get_model('all');
    if (response.data.data) {
      setModels(response.data.data);
      store.dispatch({ type: 'set_models', content: response.data.data });
    }
  };

  useEffect(() => {
    get_models();
  }, []);

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

  const [selectedIcon, setSelectedIcon] = useState('');

  const handleSelectedMethod = (newValue) => {
    setSelectedIcon(newValue.custom_name);
    store.dispatch({ type: 'set_current_model', content: newValue });
  };

  const ImageBox = () => {
    if (models.length > 0)
      return models.map((model) => (
        <div className="m-3" key={model.custom_name} style={{ width: '65px' }}>
          <div
            className={
              selectedIcon !== model.custom_name
                ? 'border method-img'
                : 'method-img-selected'
            }
            onClick={() => handleSelectedMethod(model)}
          >
            <Image
              style={{ margin: '0 auto', width: '65px', height: '65px' }}
              src={imgArray[model.custom_icon]}
              alt="no image"
            />
          </div>
          <div className="label-text text-center">{model.custom_name}</div>
        </div>
      ));
    else
      return (
        <>
          <div className="m-3" style={{ width: '65px' }}>
            <div className="border method-img"></div>
            <div className="label-text text-center">There is no models.</div>
          </div>
        </>
      );
  };

  return (
    <>
      <Dialog
        open={DialogCustomFlag}
        onClose={close}
        maxWidth={'450'}
        onBackdropClick={handleBackdropClick}
      >
        <div className="d-flex border-bottom">
          <DialogTitle>Method Select</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div className="mx-3 my-2" style={{ width: 450 }}>
          <Row>
            <Col xs={12}>
              <div className="card border">
                <Tabs value={rightTabVal}>
                  <Tab
                    style={{ fontSize: '12px' }}
                    className="p-1"
                    label="Custom"
                    onFocus={() => handleRightTabChange(0)}
                  />
                </Tabs>
                {rightTabVal === 0 && (
                  <TabContainer className="d-flex justify-content-center">
                    <div className="img-container p-3 border overflow-auto d-flex p-2">
                      <ImageBox />
                    </div>
                  </TabContainer>
                )}
              </div>
            </Col>
          </Row>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
            <Button variant="contained" onClick={showCustomNameDialog}>
              Select
            </Button>
            <Button variant="contained" onClick={close}>
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {DialogCustomNameFlag && <CustomNameDialog />}
    </>
  );
};
export default CustomDialog;
