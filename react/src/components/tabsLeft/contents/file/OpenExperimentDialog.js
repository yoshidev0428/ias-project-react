import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from 'react-select';

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from '@mui/material/DialogContentText';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from '@mui/material/ListItemIcon';
import FolderIcon from '@mui/icons-material/Folder';
import * as api_experiment from "../../../../api/experiment"

const OpenExperimentDialog = (props) => {
    const sampleExp = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]

    const [experiment_name, setexperiment_name] = useState(null)
    const [experiments, setExperiments] = useState(sampleExp)
    const [experiment_names, setexperiment_names] = useState([])

    const handleClickOpen = () => {
      props.setDialogStatus(true)
    };
    const handleClose = () => {
        props.setDialogStatus(false)
    };
    const handleChange = (obj) => {
        setexperiment_name(obj.value)
    }
    const handleSelect = () => {
        props.setDialogStatus(false)
        props.handleexperiment_nameChange(experiment_name)
    }

    //change to use reducer, style should be like this
    
    useEffect(() => {
        const fetchExperimentNames = async () => {
            try {
                let response = await api_experiment.getExperimentNames()
                let data = response.data
                if(data.success && data.data) {
                    console.log(data.data)
                    setexperiment_names(data.data)
                    setExperiments(data.data.map(experiment_name => 
                        {
                            return {value: experiment_name, label: experiment_name}
                        }
                    ))
                } else {
                    console.log(response.error)    
                }
            } catch(err) {
                console.log("Error occured while fetching experiment names")
                throw err;
            }
        }
        fetchExperimentNames()
    }, [props.cloudDialogClose])

    const handleListItemClick = (experiment_name) => {
        props.handleexperiment_nameChange(experiment_name)
    };
    
    const handleAddNewExperimentClick = () => {
        props.setCloudDialog()
    }
    return (
        <>
            <Dialog open={props.onOpen}>
                <DialogTitle>Please choose your registered experiment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        In the below list, you can choose the experiment that you have registered already.
                        Each experiment might include the materials of image source/data
                    </DialogContentText>
                    <List sx={{ pt: 0 }} style={{padding: "20px 0px"}}>
                        {experiment_names.map((experiment_name) => (
                          <ListItem style={{padding: "10px 0px"}} button onClick={() => handleListItemClick(experiment_name)} key={experiment_name}
                              >
                            <ListItemIcon>
                              <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary={experiment_name} />
                          </ListItem>
                        ))}
                        <ListItem style={{padding: "10px 0px"}} autoFocus button onClick={() => handleAddNewExperimentClick()}>
                          <ListItemIcon>
                              <FolderIcon />
                            </ListItemIcon>
                          <ListItemText primary="Add New Experiment" />
                        </ListItem>
                    </List>

                    <DialogContentText className="mt-4">
                        Do you want to have a new experiment?
                        <a href="#" className="ml-1" onClick={() => handleAddNewExperimentClick()}>Click here..</a>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={handleSelect}>CHOOSE</Button>
                    <Button variant="outlined" onClick={handleClose}>CANCEl</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default OpenExperimentDialog;