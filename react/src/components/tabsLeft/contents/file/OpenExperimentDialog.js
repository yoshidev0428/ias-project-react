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

import * as api_experiment from "../../../../api/experiment"

const OpenExperimentDialog = (props) => {
    const sampleExp = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]

    const [expName, setExpName] = useState(null)
    const [experiments, setExperiments] = useState(sampleExp)
    const [expNames, setExpNames] = useState([])

    const handleClickOpen = () => {
      props.setDialogStatus(true)
    };
    const handleClose = () => {
        props.setDialogStatus(false)
    };
    const handleChange = (obj) => {
        setExpName(obj.value)
    }
    const handleSelect = () => {
        props.setDialogStatus(false)
        props.handleExpNameChange(expName)
    }

    //change to use reducer, style should be like this
    
    useEffect(() => {
        const fetchExperimentNames = async () => {
            try {
                let response = await api_experiment.getExperimentNames()
                let data = response.data
                if(data.success && data.data) {
                    console.log(data.data)
                    setExpNames(data.data)
                    setExperiments(data.data.map(expName => 
                        {
                            return {value: expName, label: expName}
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
    }, [])


    const handleListItemClick = (expName) => {
        props.handleExpNameChange(expName)
    };
    const handleAddNewExperimentClick = () => {
        alert("add new")
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
                        {expNames.map((expName) => (
                          <ListItem style={{padding: "10px 0px"}} button onClick={() => handleListItemClick(expName)} key={expName}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <PersonIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={expName} />
                          </ListItem>
                        ))}
                        <ListItem style={{padding: "10px 0px"}} autoFocus button onClick={() => handleAddNewExperimentClick()}>
                          <ListItemAvatar>
                            <Avatar>
                              <AddIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Add New Experiment" />
                        </ListItem>
                    </List>

                    <DialogContentText className="mt-4">
                        Do you want to have a new experiment?
                        <a href="#" className="ml-1" style={{}}>Click here..</a>
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