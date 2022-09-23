import * as React from 'react';
import { Col } from 'react-bootstrap';
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import Slider from '@mui/material/Slider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from "../../../../state";

const Dec2dDialog = () => {

    const dialogFlag = useFlagsStore(store => store.dialogFlag);

    const close = () => {
        useFlagsStore.setState({ dialogFlag: false });
        console.log("flag Status--->" + dialogFlag);
    };

    const action = () => {
        console.log("flag Status---> Action");
    };

    const selectROI = () => {
        console.log("selectROI");
    };

    return (
        <>
            <Dialog open={dialogFlag} onClose={close} maxWidth={"350"} >
                <div className="d-flex border-bottom">
                    <DialogTitle>2D Deconvolution</DialogTitle>
                    <button className="dialog-close-btn" color="primary" size="small" onClick={close}>&times;</button>
                </div>
                <div className='d-flex justify-content-around mx-5 my-2' style={{ width: 350 }}>
                    <Col className="d-flex justify-center align-center pa-0">
                        <Button variant="contained" color="info" size="md" style={{width:"80%"}} onClick={selectROI}>ROI</Button>
                    </Col>
                    <Col className="pa-0">
                        <ListSubheader>Effectiveness</ListSubheader>
                        <Slider size="small" defaultValue={50} />
                    </Col>
                </div>
                <div className='border-top mt-2'>
                    <DialogActions>
                        <Button className="" variant="contained" color="success" size="medium" onClick={action}>Action</Button>
                        <Button className="" variant="contained" color="primary" size="medium" onClick={close}>OK</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    );
}
export default Dec2dDialog;