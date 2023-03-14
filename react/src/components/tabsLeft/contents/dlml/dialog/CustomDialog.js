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
import imgTissueNet from '../../../../../assets/cell/tissue_net.png';
import CustomNameDialog from './CustomNameDialog';

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

  const showCustomNameDialog = () => {
    useFlagsStore.setState({ DialogCustomFlag: false });
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
                  <TabContainer>
                    <div className="p-3">
                      <div style={{ width: '65px' }}>
                        <div className="border">
                          <Image
                            style={{
                              margin: '0 auto',
                              width: '65px',
                              height: '65px',
                            }}
                            src={imgTissueNet}
                            alt="no image"
                          />
                        </div>
                        <div className="label-text text-center">name</div>
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
