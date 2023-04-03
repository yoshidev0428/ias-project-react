import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import { Row, Col, Button, Image, Form } from 'react-bootstrap';
import * as authApi from '@/api/auth';

const LockScreen = () => {
  const DialogLockFlag = useFlagsStore((store) => store.DialogLockFlag);
  const [password, setPassword] = React.useState('');
  
  const close = () => {
    // useFlagsStore.setState({ DialogLockFlag: false });
  };

  const handleInput = (event) => {
    setPassword(event.target.value);
  }

  const handlePasswordInput  = async () => {
    let result = await authApi.confirm_password(
      password
    );
    if (result.data.success === 'NO') {
      alert('Wrong Password');
      return
    }
    useFlagsStore.setState({ DialogLockFlag: false });
  }

  return (
    <>
      <Dialog open={DialogLockFlag} onClose={close} maxWidth={'450'}>
        <div className="d-flex border-bottom">
          <DialogTitle>Password Confirm</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div className="mx-3 my-2" style={{ width: 450 }}>
          <Row>
            <Col xs={12}>
              <Form.Label>You must enter your password to use this "ADVANCE" function.</Form.Label>
            </Col>
            <Col xs={6}>
              <Form.Control
                type="password"
                value={password}
                onChange={handleInput}
              />
            </Col>
            <Col xs={6}>
              {/* <Button variant="primary">callbrate</Button> */}
            </Col>
          </Row>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
            <Button variant="contained" onClick={handlePasswordInput}>
              Confirm
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
export default LockScreen;
