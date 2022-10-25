import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import SimpleDialog from "../../../custom/SimpleDialog";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import * as api_tiles from "../../../../api/tiles";
import * as api_experiment from "../../../../api/experiment"
import store from "../../../../reducers";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from '@mui/material/DialogContentText';

import CloudPlan from '../../../custom/CloudPlan'

import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdChevronRight,
  MdKeyboardArrowDown,
  MdAddBox,
  MdIndeterminateCheckBox,
  MdFolder,
  MdFolderOpen,
  MdInsertDriveFile
} from "react-icons/md";

function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

const DeleteSureDialog = (props) => {
    const handleClose = () => {
        props.setDialogStatus(false)
    };
    const handleDelete = () => {
        props.setDialogStatus(false)
        props.sureDelete();
    }

    return (
        <>
            <Dialog open={props.open}>
                <DialogTitle>Delete {props.selectedNum} files </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deleted files cannot be recovered forever, are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={handleDelete}>Yes, sure</Button>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const OpenCloudDialog = (props) => {
    const fileInput = React.useRef();

    const expName = "experiement_" + new Date().toISOString()
    const upFName = "upload_" + new Date().toISOString()

    const [experimentName, setExperimentName] = useState(expName);
    const [uploadFolderName, setUploadFolderName] = useState(upFName);
    const [fileName, setFileName] = useState(null);
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [sureDialog, setSureDialog] = useState(false);

    const getTree = async () => {
        let response = await api_experiment.getImageTree()
        let data = response.data
        if(data.error) {
            console.log("Error occured while invoking getImageTree api")
            //alert("Error occured while getting the tree")
        } else {
            store.dispatch({type: "set_experiment_data", content: data.data});
        }
        setUploading(false)
    }
    const deleteFiles = async () => {
        setUploading(true)
        try {
            let response = await api_experiment.deleteImageFiles(checked)
            let data = response.data
            if(data.success) {
                getTree()
            } else {
                console.log(response.error)    
            }
        } catch(err) {
            setUploading(false)
            console.log("Error occured while deleting image files")
            throw err;
        }
    }
    const registerExperimentData = async () => {
        try {
            let response = await api_experiment.registerExperiment(experimentName, checked)
            let data = response.data

            if(data.success) {
                alert("Successfully registered")
            } else {
                alert("Failed to register")
            }
            props.handleClose()
        } catch(err) {
            props.handleClose()
            console.log("Error occured while registering experiment")
            throw err
        }

        // let response = await api_experiment.getExperimentData("experiement_2022-10-20T17:33:15.282Z")
        // let data = response.data

        // if(data.success) {
        //     console.log(data.data)
        //     alert(data.data.length)
        // }
    }

    useEffect(() => {
        setUploading(true)

        const expName = "experiement_" + new Date().toISOString()
        const upFName = "upload_" + new Date().toISOString()

        setExperimentName(expName)
        setUploadFolderName(upFName)

        getTree()
        setUploading(false)
    }, [])

    const icons = {
      check: <MdCheckBox className="rct-icon rct-icon-check" />,
      uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
      halfCheck: (
        <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
      ),
      expandClose: (
        <MdChevronRight className="rct-icon rct-icon-expand-close" />
      ),
      expandOpen: (
        <MdKeyboardArrowDown className="rct-icon rct-icon-expand-open" />
      ),
      expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
      collapseAll: (
        <MdIndeterminateCheckBox className="rct-icon rct-icon-collapse-all" />
      ),
      parentClose: <MdFolder className="rct-icon rct-icon-parent-close" />,
      parentOpen: <MdFolderOpen className="rct-icon rct-icon-parent-open" />,
      leaf: <MdInsertDriveFile className="rct-icon rct-icon-leaf-close" />
    };

    const handleSelectFile = async (e) => {
        if (e.target.files.length > 0) {
            setUploading(true)

            const incommingFiles = [...e.target.files];
            let files = [];
            let newAcceptedFiles = [];
            let acceptedFileCount = 0;

            for (let i = 0; i < incommingFiles.length; i++) {

                if (!files.includes(incommingFiles[i])) {
                    files.push(incommingFiles[i]);
                }

                let file = incommingFiles[i]
                let newName = file.name.replace(/\s+/g, '');
                incommingFiles[i] = new File([file], newName, {type: file.type});
                incommingFiles[i]["path"] = file.name.replace(/\s+/g, "");
                newAcceptedFiles.push(incommingFiles[i]);
            }

            if (newAcceptedFiles.length > 0) {
                //************************************************************************** */
                let resUpload = await api_tiles.uploadImages(newAcceptedFiles, uploadFolderName);
                getTree()
            }
            // setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
        }
    }
    const removeImage = (e) => {
        setSureDialog(true)
    }
    const sureDelete = () => {
        console.log(checked)
        deleteFiles()
    }
    const registerExperiment = () => {
        registerExperimentData()
    }
    return (
        <>
            <SimpleDialog
                title="Cloud"
                singleButton={false}
                fullWidth={true}
                okTitle="REGISTER EXPERIMENT"
                closeTitle="CANCEL"
                newTitle=""
                onCancel={props.handleClose}
                onOK = {registerExperiment}
            >
                <div className="mt-2 mb-4">
                    <TextField
                        label="Experiment name"
                        variant="standard"
                        fullWidth
                        value={experimentName}
                        onChange={e => setExperimentName(e.target.value)}
                    />
                </div>
                <div>
                    <Typography component="div" className="mb-1">View your cloud data</Typography>
                    {props.experiments.length ?
                        <CheckboxTree
                            nodes={props.experiments}
                            checked={checked}
                            expanded={expanded}
                            onCheck={checked => setChecked(checked)}
                            onExpand={expanded => setExpanded(expanded)}
                            icons={icons}
                        /> : <label>No data found, please upload..</label>
                    }
                </div>
                <div className="mt-2 mb-2">
                    {uploading && <LinearProgress />}
                </div>
                <div className="mt-2 mb-4">
                    <div style={{display: 'flex', justifyContent:'flex-end'}}>
                        <label htmlFor="contained-button-file" className="mr-2 mb-0">
                            <input
                                ref={fileInput}
                                style={{ display: 'none' }}
                                accept="image/*"
                                id="contained-button-file"
                                type="file"
                                multiple
                                onChange={handleSelectFile}
                            />
                            <Button
                                label="Click Here"
                                variant="outlined"
                                color="success"
                                fullWidth
                                value={fileName}
                                onClick={() => fileInput.current.click()}
                            >
                                UPLOAD FILES
                            </Button>
                        </label>
                        
                        <Button variant="outlined" color="error" onClick={removeImage}>
                            Remove
                        </Button>
                    </div>
                    <TextField
                        label="New upload foldername"
                        variant="standard"
                        fullWidth
                        value={uploadFolderName}
                        onChange={e => setUploadFolderName(e.target.value)}
                    />
                </div>
            </SimpleDialog>
            <DeleteSureDialog 
                open={sureDialog}
                setDialogStatus={setSureDialog}
                sureDelete={sureDelete}
                selectedNum={checked.length}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    experiments: state.experiment.experiments,
    uploading: state.experiment.uploading,
});
OpenCloudDialog.propTypes = {handleClose: PropTypes.func.isRequired};

export default connect(mapStateToProps)(OpenCloudDialog);

