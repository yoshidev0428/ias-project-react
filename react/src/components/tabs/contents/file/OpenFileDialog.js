import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const OpenFileDialog = (props) => {

    const action = () => {

    }

    return (
        <>
            <Dialog open={true} onClose={props.handleClose} maxWidth={"800"} >
                <div className="d-flex border-bottom">
                    <DialogTitle>File Open</DialogTitle>
                    <button className="dialog-close-btn" color="primary" size="small" onClick={props.handleClose}>&times;</button>
                </div>
                <div className='d-flex justify-content-around mx-5 my-2' style={{ width: 800, height: 300 }}>
                </div>
            </Dialog>
        </>
    )

}

export default OpenFileDialog;