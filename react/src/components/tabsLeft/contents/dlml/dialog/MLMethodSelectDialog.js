import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Row, Col, Image } from 'react-bootstrap';
import { Button } from '@mui/material';
import Icon from '@mdi/react';
import { mdiCloseCircle } from '@mdi/js';
import IconButton from '@mui/material/IconButton';

import store from '../../../../../reducers';
import imgTissueNet from '../../../../../assets/cell/tissue_net.png';
import pcImg from '../../../../../assets/images/PC.png';
import ocImg from '../../../../../assets/images/OC.png';
import ncImg from '../../../../../assets/images/NC.png';

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
  const MLDialogMethodSelecFlag = useFlagsStore(
    (store) => store.MLDialogMethodSelecFlag,
  );
  // const showCellposeDialog = () => {
  //   useFlagsStore.setState({ MLDialogMethodSelecFlag: false });
  //   useFlagsStore.setState({ DialogCellposeFlag: true });
  //   store.dispatch({ type: 'setMethod', content: selectedMethod });
  //   store.dispatch({ type: 'set_custom_name', content: 'New Model' });
  // };
  const setMLMethod = () => {
    useFlagsStore.setState({ MLDialogMethodSelecFlag: false });
    store.dispatch({ type: 'setMLMethod', content: selectedMethod });
  };
  const close = () => {
    useFlagsStore.setState({ MLDialogMethodSelecFlag: false });
  };

  const [selectedMethod, setSelectedMethod] = useState('pc');
  const handleSelectedMethod = (newValue) => {
    setSelectedMethod(newValue);
  };

  const imgArray = {
    tissuenet: imgTissueNet,
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
      <Dialog open={MLDialogMethodSelecFlag} onClose={close} maxWidth={'450'}>
        <div className="d-flex border-bottom flex-row justify-content-between">
          <DialogTitle>{`Select the Method`}</DialogTitle>
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
                    Pixel Classification
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
        <div className="border-top mt-2">
          <DialogActions>
            <Button
              sx={{ marginRight: '8px' }}
              variant="outlined"
              component="label"
              onClick={setMLMethod}
            >
              SET
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
