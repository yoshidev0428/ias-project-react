import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SimpleDialog from '@/components/custom/SimpleDialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import * as api_experiment from '@/api/experiment';
import store from '@/reducers';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dropzone from 'react-dropzone';
import ExpTreeView from './ExpTreeView';
import {
  Autocomplete,
  Box,
  CircularProgress,
  createFilterOptions,
  Divider,
} from '@mui/material';

const DeleteSureDialog = ({
  open,
  selectedNum,
  setDialogStatus,
  sureDelete,
}) => {
  const handleClose = () => {
    setDialogStatus(false);
  };
  const handleDelete = () => {
    setDialogStatus(false);
    sureDelete();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Delete {selectedNum} files </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deleted files cannot be recovered forever, are you sure?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Yes, sure
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SuccessDialog = ({ open, setsuccessStatus }) => {
  const handleClose = () => {
    setsuccessStatus(false);
  };
  return (
    <Dialog open={open}>
      <DialogTitle>Uploading files </DialogTitle>
      <DialogContent>
        <DialogContentText>Uploading is Successful</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const getImageByUrl = async function (imagePath) {
  try {
    const state = store.getState();

    const response = await fetch(
      process.env.REACT_APP_BASE_API_URL +
        'static/' +
        state.auth.user._id +
        '/' +
        imagePath,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
          Authorization: state.auth.tokenType + ' ' + state.auth.token,
        },
      },
    );
    const blob = await response.blob();
    const file = new File([blob], imagePath, { type: 'image/tiff' });
    file.path = imagePath;
    return file;
  } catch (err) {
    return null;
  }
};

const filter = createFilterOptions();

const OpenFileDialog = ({ experiments, handleClose }) => {
  const [experiment, setExperiment] = useState(null);
  const [checked] = useState('');
  const [uploading, setUploading] = useState(false);
  const [sureDialog, setSureDialog] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedExp, setSelectedExp] = useState(null);

  const getTree = async () => {
    let response = await api_experiment.getExperimentDatas();
    let data = response.data;

    if (!data.error) {
      store.dispatch({ type: 'set_experiment_data', content: data.data });
    }
    setUploading(false);
  };

  const deleteFiles = async () => {
    setUploading(true);
    try {
      let response = await api_experiment.deleteImageFiles(checked);
      let data = response.data;
      if (data.success) {
        getTree();
      }
    } catch (err) {
      setUploading(false);
      throw err;
    }
  };

  useEffect(() => {
    setUploading(true);
    setExperiment('');
    getTree();
    setUploading(false);
  }, []);

  const sureDelete = () => {
    deleteFiles();
  };

  const handleLoadFile = async () => {
    let filePath = selectedFile;
    let pos = filePath.lastIndexOf('.');
    if (!filePath.toLowerCase().endsWith('.ome.tiff') && pos >= 0) {
      filePath = filePath.substring(0, pos) + '.ome.tiff';
    }
    const file = await getImageByUrl(filePath);
    const files = [];
    if (file) files.push(file);
    store.dispatch({ type: 'set_image_path_for_avivator', content: files });
    handleClose();
  };

  const handleDelete = () => {};

  const handleUpload = async () => {
    setUploading(true);

    const response = await api_experiment.setExperiment_folder(
      experiment.experiment_name,
      uploadFiles,
    );

    if (response.status === 200 && response.data === true) {
      setSuccessDialog(true);
      getTree();
    } else if (response.data.error) {
      alert(response.data.error);
    } else if (response.status !== 200) {
      alert('Server connection is error');
    }

    setUploading(false);
  };

  return (
    <>
      <SimpleDialog title="Files" onClose={handleClose} maxWidth="sm">
        <Grid container direction="row">
          <Grid
            container
            item
            xs
            direction="column"
            justifyContent="space-between"
          >
            <Box flexGrow={1} display="flex" flexDirection="column">
              <Typography mb={2}>Upload Experiment data</Typography>
              <Autocomplete
                value={experiment}
                fullWidth
                sx={{ mb: 2 }}
                onChange={(_event, newValue) => {
                  if (typeof newValue === 'string') {
                    setExperiment({
                      experiment_name: newValue,
                    });
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setExperiment({
                      experiment_name: newValue.inputValue,
                    });
                  } else {
                    setExperiment(newValue);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option.experiment_name,
                  );
                  if (inputValue !== '' && !isExisting) {
                    filtered.push({
                      inputValue,
                      experiment_name: `Add "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={experiments}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === 'string') {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.experiment_name;
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option.experiment_name}</li>
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select experiment"
                    size="small"
                  />
                )}
              />
              <Dropzone onDrop={(files) => setUploadFiles(files)}>
                {({ getRootProps, getInputProps }) => (
                  <Box {...getRootProps()} flexGrow={1} mb={2}>
                    <input {...getInputProps()} multiple />
                    <Box
                      sx={{
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        textAlign: 'center',
                        alignItems: 'center',
                        border: 'solid lightgray thin',
                        borderRadius: 2,
                      }}
                    >
                      {uploadFiles.length === 0 ? (
                        <span>
                          Drag 'n' drop some files here, or click to select
                          files
                        </span>
                      ) : (
                        <span>Selected {uploadFiles.length} files</span>
                      )}
                    </Box>
                  </Box>
                )}
              </Dropzone>
            </Box>
            <Button
              variant="outlined"
              color="info"
              fullWidth
              disabled={!experiment || !uploadFiles.length || uploading}
              onClick={handleUpload}
            >
              {uploading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
          </Grid>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ mx: 3, my: -3 }}
          />
          <Grid container item xs spacing={2}>
            <Grid item xs={12}>
              <Typography>Experiment Data Sources</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: 300,
                  pt: 1,
                  overflow: 'auto',
                  border: 'solid lightgray thin',
                  borderRadius: 1,
                }}
              >
                <ExpTreeView
                  data={experiments}
                  onSelectFile={(file) => setSelectedFile(file)}
                  onSelectExp={(exp) => {
                    setSelectedExp(exp);
                    setSelectedFile(null);
                  }}
                />
              </Box>
            </Grid>
            <Grid item container xs={12} spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!selectedFile}
                  onClick={handleLoadFile}
                >
                  Load
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  disabled={!selectedFile && !selectedExp}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SimpleDialog>
      <DeleteSureDialog
        open={sureDialog}
        setDialogStatus={setSureDialog}
        sureDelete={sureDelete}
        selectedNum={checked.length}
      />
      <SuccessDialog open={successDialog} setsuccessStatus={setSuccessDialog} />
    </>
  );
};

const mapStateToProps = (state) => ({
  experiments: state.experiment.experiments,
  uploading: state.experiment.uploading,
});
OpenFileDialog.propTypes = { handleClose: PropTypes.func.isRequired };

export default connect(mapStateToProps)(OpenFileDialog);
