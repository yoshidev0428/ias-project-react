import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Row, Col, Image } from 'react-bootstrap';
import { Button } from '@mui/material';
import Icon from '@mdi/react';
import { mdiCloseCircle } from '@mdi/js';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';

import { useFlagsStore } from '@/state';
import store from '../../../../../reducers';

import pcImg from '../../../../../assets/images/PC.png';
import ocImg from '../../../../../assets/images/OC.png';
import ncImg from '../../../../../assets/images/NC.png';
import LabelItemInput from '../widgets/LabelItemInput';
import LabelColorItem from '../widgets/LabelColorItem';
import '@/styles/ML.css';

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

const MLMethodSelectDialog = () => {
  const MLDialogMethodAddFlag = useFlagsStore(
    (store) => store.MLDialogMethodAddFlag,
  );

  const [selectedMethod, setSelectedMethod] = useState('pc');
  const [methodName, setMethodName] = useState('');
  const [params, setParams] = useState({
    intensity: 0.5,
    thickness: 2,
    objectLabelColor: '#FF0000',
    bgLabelColor: '#00FF00',
  });

  const handleSelectedMethod = (newValue) => {
    setSelectedMethod(newValue);
  };

  const addMLMethod = () => {
    if (methodName === '') {
      toast.error('Please input the method name!', {
        position: 'top-center',
      });
      return;
    }
    const content = {
      type: selectedMethod,
      params: params,
      name: methodName,
    };
    useFlagsStore.setState({ MLDialogMethodAddFlag: false });
    store.dispatch({ type: 'addMLMethod', content: content });
    toast.success('Successfully Added', { position: 'top-center' });
  };

  const close = () => {
    useFlagsStore.setState({ MLDialogMethodAddFlag: false });
  };

  function valuetext(value) {
    return `${value}°C`;
  }

  const imgArray = {
    pc: pcImg,
    oc: ocImg,
    nc: ncImg,
  };

  const ImageBox = (props) => {
    return (
      <div
        className={
          selectedMethod !== props.methodName
            ? 'border method-img'
            : 'ml-method-img-selected'
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
      <Dialog open={MLDialogMethodAddFlag} onClose={close} maxWidth={'450'}>
        <div className="d-flex border-bottom flex-row justify-content-between">
          <DialogTitle>{`Add the Method`}</DialogTitle>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            onClick={close}
          >
            <Icon path={mdiCloseCircle} size={1} />
          </IconButton>
        </div>
        <div className="mx-3 my-2" style={{ width: 450 }}>
          <Row>
            <Col xs={12}>
              <div className="overflow-auto d-flex  flex-row justify-content-around p-2">
                <div style={{ width: '65px' }} className="mr-3">
                  <ImageBox methodName="pc" />
                  <div className="label-text text-center">
                    Pixel Classification
                  </div>
                </div>
                <div style={{ width: '65px' }} className="mr-3">
                  <ImageBox methodName="oc" />
                  <div className="label-text text-center">
                    Object Classification
                  </div>
                </div>
                <div style={{ width: '65px' }} className="mr-3">
                  <ImageBox methodName="nc" />
                  <div className="label-text text-center">Neutral Network</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="mx-auto my-2" style={{ width: 400 }}>
          <TextField
            variant="outlined"
            label="Method Name"
            size="small"
            fullWidth
            value={methodName}
            onChange={(e) => setMethodName(e.target.value)}
          />
        </div>
        <div className="mx-3 my-2" style={{ width: 450 }}>
          <Box sx={{ width: 400, margin: 'auto' }}>
            <Typography>Intensity</Typography>
            <Slider
              aria-label="intensity"
              sx={{ color: '#0F9688' }}
              defaultValue={0.5}
              value={params.intensity}
              getAriaValueText={valuetext}
              onChange={(e, val) => {
                setParams({
                  ...params,
                  intensity: val,
                });
              }}
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={0}
              max={10}
            />
          </Box>
        </div>
        <div className="mx-3 my-2" style={{ width: 450 }}>
          <Box
            className="d-flex  flex-row justify-content-around"
            sx={{ width: 400, margin: 'auto' }}
          >
            <LabelColorItem
              label={{ name: 'Object', color: params.objectLabelColor }}
              onColorChange={(val) =>
                setParams({ ...params, objectLabelColor: val })
              }
            />
            <LabelColorItem
              label={{ name: 'Background', color: params.bgLabelColor }}
              onColorChange={(val) =>
                setParams({ ...params, bgLabelColor: val })
              }
            />
            <TextField
              type="number"
              id="thickness"
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              size="small"
              // sx={{padding: 0,}}
              label="Thickness"
              variant="outlined"
              onChange={(e) =>
                setParams({ ...params, thickness: e.target.value })
              }
              value={params.thickness}
            />
          </Box>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
            <Button
              sx={{ marginRight: '8px' }}
              variant="outlined"
              component="label"
              onClick={addMLMethod}
            >
              Add
            </Button>
            <Button variant="outlined" onClick={close}>
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
export default MLMethodSelectDialog;
