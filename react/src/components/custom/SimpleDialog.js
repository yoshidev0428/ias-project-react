import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

const SimpleDialog = (props) => {
    const handleClose = () => {
        console.log("click outside ok");
    };
    const newed = () => {
        console.log("newed");
    };
    const updated = () => {
        console.log("updated");
    };
    const removed = () => {
        console.log("removed");
    };
    const selected = () => {
        console.log("selected");
    };    
    return (
        <>
            <Dialog open={true} onClose={props.click}>
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>
                    <div>{props.children}</div>
                </DialogContent>
                <DialogActions>
                    <div className="spacer"></div>
                    {props.newButton && <Button variant="contained" color="info" onClick={newed}
                        disabled={props.newDisable}
                    >
                        {/* {props.newTitle} */}
                    </Button>}
                    {props.updateButton && <Button variant="contained" color="info" onClick={updated}                         
                        disabled={props.updateDisable}
                    >
                        {props.updateTitle}
                    </Button>}
                    {props.removeButton && <Button variant="contained" color="warning" onClick={removed} 
                        disabled={props.removeDisable}
                    >
                        {/* {props.removeTitle} */}
                    </Button>}
                    <Button variant="contained" color="success" onClick={props.selected} 
                        disabled={props.selectDisable}
                    >
                        {props.okTitle}
                    </Button>
                    {!props.singleButton && <Button variant="contained" color="primary" onClick={props.click}                        
                    >
                        {props.closeTitle}
                    </Button>}
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SimpleDialog