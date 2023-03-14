import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Row, Col, Button, Image } from 'react-bootstrap';
import store from '../../../../../reducers';
import imgTissueNet from '../../../../../assets/cell/tissue_net.png';
import imgNuchel from '../../../../../assets/cell/nuchel.png';
import imgCyto from '../../../../../assets/cell/cyto.png';
import imgLayer from '../../../../../assets/cell/layer.png';
import imgWafer from '../../../../../assets/cell/wafer.png';
import CellposeDialog from './CellposeDialog';
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

const BasicDialog = () => {
  const DialogCellposeFlag = useFlagsStore((store) => store.DialogCellposeFlag);
  const DialogBasicFlag = useFlagsStore((store) => store.DialogBasicFlag);
  const state = store.getState();
  const showCellposeDialog = () => {
    useFlagsStore.setState({ DialogBasicFlag: false });
    useFlagsStore.setState({ DialogCellposeFlag: true });
    store.dispatch({ type: 'setMethod', content: selectedMethod });
    store.dispatch({ type: 'set_custom_name', content: 'New Model' });
  };
  const close = () => {
    useFlagsStore.setState({ DialogBasicFlag: false });
    console.log('flag Status--->' + DialogBasicFlag);
  };

  const [rightTabVal, setRightTabVal] = useState(0);
  const handleRightTabChange = (newValue) => {
    setRightTabVal(newValue);
  };
  const [selectedMethod, setSelectedMethod] = useState('tissuenet');
  const handleSelectedMethod = (newValue) => {
    setSelectedMethod(newValue);
  };

  const imgArray = {
    tissuenet: imgTissueNet,
    nuclei: imgNuchel,
    cyto: imgCyto,
    layer: imgLayer,
    wafer: imgWafer,
    livecell: imgCyto,
    cyto2: imgCyto,
    cp: imgLayer,
    cpx: imgWafer,
    tn1: imgTissueNet,
    tn2: imgNuchel,
    tn3: imgTissueNet,
    lc1: imgLayer,
    lc2: imgCyto,
    lc3: imgTissueNet,
    lc4: imgWafer,
  };

  const ImageBox = (props) => {
    return (
      <div
        className={
          selectedMethod !== props.methodName
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
      <Dialog open={DialogBasicFlag} onClose={close} maxWidth={'450'}>
        <div className="d-flex border-bottom">
          <DialogTitle>Method Select</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div className="mx-3 my-2" style={{ width: 450 }}>
          <Row>
            <Col xs={12}>
              <div className="card border overflow-auto d-flex p-2">
                <Tabs value={rightTabVal}>
                  <Tab
                    style={{ fontSize: '12px' }}
                    className="p-1"
                    label="Tissue"
                    onFocus={() => handleRightTabChange(0)}
                  />
                  <Tab
                    style={{ fontSize: '12px' }}
                    className="p-1"
                    label="Cell"
                    onFocus={() => handleRightTabChange(1)}
                  />
                  <Tab
                    style={{ fontSize: '12px' }}
                    className="p-1"
                    label="Material"
                    onFocus={() => handleRightTabChange(2)}
                  />
                  <Tab
                    style={{ fontSize: '12px' }}
                    className="p-1"
                    label="Semicon"
                    onFocus={() => handleRightTabChange(3)}
                  />
                </Tabs>
                {rightTabVal === 0 && (
                  <TabContainer>
                    <div className="p-3">
                      <div style={{ width: '65px' }}>
                        <ImageBox methodName="tissuenet" />
                        <div className="label-text text-center">TissueNet</div>
                      </div>
                    </div>
                  </TabContainer>
                )}
                {rightTabVal === 1 && (
                  <TabContainer>
                    <div className="p-3 d-flex">
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="nuclei" />
                        <div className="label-text text-center">Nuclei</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="cyto" />
                        <div className="label-text text-center">Cyto</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="livecell" />
                        <div className="label-text text-center">Livecell</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="cyto2" />
                        <div className="label-text text-center">Cyto2</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="cp" />
                        <div className="label-text text-center">CP</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="cpx" />
                        <div className="label-text text-center">CPx</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="tn1" />
                        <div className="label-text text-center">TN1</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="tn2" />
                        <div className="label-text text-center">TN2</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="tn3" />
                        <div className="label-text text-center">TN3</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="lc1" />
                        <div className="label-text text-center">LC1</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="lc2" />
                        <div className="label-text text-center">LC2</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="lc3" />
                        <div className="label-text text-center">LC3</div>
                      </div>
                      <div style={{ width: '65px' }} className="mr-2">
                        <ImageBox methodName="lc4" />
                        <div className="label-text text-center">LC4</div>
                      </div>
                    </div>
                  </TabContainer>
                )}
                {rightTabVal === 2 && (
                  <TabContainer>
                    <div className="p-3">
                      <div style={{ width: '65px' }}>
                        <ImageBox methodName="layer" />
                        <div className="label-text text-center">Layer</div>
                      </div>
                    </div>
                  </TabContainer>
                )}
                {rightTabVal === 3 && (
                  <TabContainer>
                    <div className="p-3">
                      <div style={{ width: '65px' }}>
                        <ImageBox methodName="wafer" />
                        <div className="label-text text-center">Wafer</div>
                      </div>
                    </div>
                  </TabContainer>
                )}
              </div>
            </Col>
          </Row>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
            <Button variant="contained" onClick={showCellposeDialog}>
              Custom
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
export default BasicDialog;
