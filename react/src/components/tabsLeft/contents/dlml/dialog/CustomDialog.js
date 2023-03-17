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
import store from '../../../../../reducers';
import * as api_experiment from '@/api/experiment';
import { isNull } from 'lodash';
import { mdiConsoleLine } from '@mdi/js';
import imgTissueNet from '../../../../../assets/cell/tissue_net.png';
import imgNuchel from '../../../../../assets/cell/nuchel.png';
import imgCyto from '../../../../../assets/cell/cyto.png';
import imgLayer from '../../../../../assets/cell/layer.png';
import imgWafer from '../../../../../assets/cell/wafer.png';
import imgAnimal from '../../../../../assets/cell/animal.png';
import imgBacteria from '../../../../../assets/cell/bacteria.png';
import imgHuman from '../../../../../assets/cell/human.png';
import imgStem from '../../../../../assets/cell/embryonic_stem.png';

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

  const DialogCustomFlag = useFlagsStore((store) => store.DialogCustomFlag);
  const DialogCustomNameFlag = useFlagsStore(
    (store) => store.DialogCustomNameFlag,
  );
  const DialogLoadingFlag = useFlagsStore((store) => store.DialogLoadingFlag);

  const showCustomNameDialog = async () => {
    const state = store.getState();
    if (isNull(state.files.imagePathForAvivator)) {
      alert('Please enter your image file!');
      return;
    }
    if(selectedIcon === '') {
      alert('Please select your model!');
      useFlagsStore.setState({ DialogLoadingFlag: false });
      return;
    }
    
    console.log('image-path', state.files.imagePathForAvivator[0].path);
    let imgPath = state.files.imagePathForAvivator[0].path;
    let exp_name = imgPath.split('/');
    exp_name = exp_name[0];
    console.log('experiment', exp_name);
    useFlagsStore.setState({ DialogCustomFlag: false });
    useFlagsStore.setState({ DialogLoadingFlag: true });
    let result = await api_experiment.testSegment(
      imgPath,
      exp_name,
      selectedIcon,
    );
    const imagePathForAvivator = [];
    if (result.data.error) {
      console.log('Error occured while invoking getImageTree api');
      //alert("Error occured while getting the tree")
    } else {
      if(result.data.success == 'NO') {
        alert('Your custom model is not suitable for this image. Please choose another model')
        useFlagsStore.setState({ DialogLoadingFlag: false });
        return
      }
      let file_path = result.data.success;

      console.log('cell-segmant', file_path);
      const file = await getImageByUrl(exp_name + '/' + file_path);
      console.log('file', file);
      if (file) imagePathForAvivator.push(file);
    }
    if (imagePathForAvivator.length <= 0) imagePathForAvivator = null;
    store.dispatch({
      type: 'set_image_path_for_avivator',
      content: imagePathForAvivator,
    });
    useFlagsStore.setState({ DialogLoadingFlag: false });
  };

  const close = (event, reason) => {
    if (reason != 'backdropClick') {
      useFlagsStore.setState({ DialogCustomFlag: false });
      console.log('flag Status--->' + DialogCustomFlag);
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
    const state = store.getState();
    console.log('models-store', models);
  };

  useEffect(() => {
    get_models();
  }, []);

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

  const [selectedIcon, setSelectedIcon] = useState('');

  const handleSelectedMethod = (newValue) => {
    setSelectedIcon(newValue);
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
            onClick={() => handleSelectedMethod(model.custom_name)}
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
          <div className="m-3"style={{ width: '65px' }}>
            <div className="border method-img">
            </div>
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
