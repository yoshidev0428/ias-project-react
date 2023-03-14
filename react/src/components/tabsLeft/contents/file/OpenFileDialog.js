import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import SimpleDialog from '@/components/custom/SimpleDialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import * as api_experiment from '@/api/experiment';
import store from '@/reducers';
import { cancelImage } from '@/reducers/actions/filesAction';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { setNullView, initView } from '@/reducers/actions/vesselAction';
import Dropzone from 'react-dropzone';
import TreeViewFoldersExp from './TreeViewFolders';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useViewerStore } from '@/state';

const DeleteSureDialog = (props) => {
  const handleClose = () => {
    props.setDialogStatus(false);
  };
  const handleDelete = () => {
    props.setDialogStatus(false);
    props.sureDelete();
  };

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
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Yes, sure
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const SuccessDialog = (props) => {
  const handleClose = () => {
    props.setsuccessStatus(false);
  };
  return (
    <>
      <Dialog open={props.open}>
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
    </>
  );
};

const OpenFileDialog = (props) => {
  const [experimentName, setExperimentName] = useState('');
  const [fileName] = useState(null);
  const [checked] = useState('');
  const [uploading, setUploading] = useState(false);
  const [sureDialog, setSureDialog] = useState(false);
  const [successDialog, setsuccessDialog] = useState(false);
  const [_imageSrc, setImageSrc] = useState(null);
  const [addedFiles, setAddedFiles] = useState([]);

  const selectedImg = useSelector((state) => state.files.selectedImage);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
  const registerExperimentData = async () => {
    try {
      let response = await api_experiment.registerExperiment(
        experimentName,
        checked,
      );
      let data = response.data;

      if (data.success) {
        alert('Successfully registered');
      } else {
        alert('Failed to register');
      }
      props.handleClose();
    } catch (err) {
      props.handleClose();
      throw err;
    }
  };

  useEffect(() => {
    if (selectedImg !== null) {
      const imgsrc =
        process.env.REACT_APP_BASE_API_URL +
        'image/tile/get_image' +
        selectedImg.split(auth.user._id)[1];
      setImageSrc(imgsrc);
    }
  }, [selectedImg, auth, setImageSrc]);

  useEffect(() => {
    setUploading(true);
    setExperimentName('');
    getTree();
    setUploading(false);
  }, []);

  const sureDelete = () => {
    deleteFiles();
  };
  const registerExperiment = () => {
    registerExperimentData();
  };
  const cancelBtn = () => {
    dispatch(cancelImage());
    props.handleClose();
    dispatch(setNullView());
    setImageSrc(null);
  };
  const setItem = () => {
    dispatch(initView());
  };

  const addFiles = (files) => {
    if (files.length === 0) {
      alert('choose at least one file');
    } else {
      setAddedFiles(files);
    }
  };

  const onClickSelectBtn = () => {
    document.getElementById('file_upload').click();
  };

  const imagePathForTree = useSelector((state) => state.files.imagePathForTree);
  const onClickTreeSelectBtn = async () => {
    if (imagePathForTree.length <= 0) {
      store.dispatch({ type: 'set_image_path_for_avivator', content: null });
      props.handleClose();
      return;
    }
    const imagePathList = imagePathForTree.split(',');
    const imagePathForAvivator = [];
    for (const imagePath of imagePathList) {
      if (imagePath.length > 0) {
        imagePathForAvivator.push(`/api/static/${auth.user._id}/${imagePath}`);
      }
    }
    if (imagePathForAvivator.length <= 0) imagePathForAvivator.splice(0);

    useViewerStore.setState({ source: imagePathForAvivator[0] });

    props.handleClose();
  };

  const uploadExpData = async () => {
    if (experimentName === '' || addedFiles.length === 0) {
      alert('Select experiment and folder');
    } else {
      setUploading(true);
      let response = await api_experiment.setExperiment_folder(
        experimentName,
        addedFiles,
      );
      if (response.status === 200 && response.data === true) {
        setUploading(false);
        setsuccessDialog(true);
        setAddedFiles([]);
        setExperimentName('');
        getTree();
      } else if (response.data.error) {
        alert(response.data.error);
        setUploading(false);
      } else if (response.status !== 200) {
        alert('Server connection is error');
        setUploading(false);
      }
    }
  };

  const eraseFolder = () => {
    setAddedFiles([]);
  };

  return (
    <>
      <SimpleDialog
        title="Files"
        checked={checked}
        singleButton={false}
        fullWidth={true}
        newTitle=""
        register={registerExperiment}
        onCancel={cancelBtn}
        set={setItem}
      >
        <div className="container border">
          <div className="row">
            <div className="col-6 border">
              <h6 className="mt-2">Upload Data Select</h6>
              <div className="mt-2 mb-4">
                <p className="mt-4">New Experiment Name</p>
                <div className="row">
                  <div className="col-4"></div>
                  <div className="col-8">
                    <TextField
                      variant="outlined"
                      label="Experiment Name"
                      size="small"
                      fullWidth
                      value={experimentName}
                      onChange={(e) => setExperimentName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 mb-4">
                <p className="mt-4">Select Upload Data</p>
                <Dropzone onDrop={(files) => addFiles(files)}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} id="file_upload" multiple />
                      {addedFiles.length === 0 ? (
                        <p className="border rounded p-4 text-center">
                          Drag 'n' drop some files here, or click to select
                          files
                        </p>
                      ) : (
                        <p className="border rounded p-4 text-center">
                          Selected {addedFiles.length} files
                        </p>
                      )}
                    </div>
                  )}
                </Dropzone>
                <div className="row">
                  <div className="col-3"></div>
                  <div className="col-3">
                    <Button
                      label="Click Here"
                      variant="outlined"
                      color="success"
                      className="mt-3 mb-3"
                      fullWidth
                      value={fileName}
                      onClick={onClickSelectBtn}
                    >
                      Select
                    </Button>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-3">
                    {addedFiles.length !== 0 ? (
                      <Button
                        label="Click Here"
                        variant="outlined"
                        color="primary"
                        className="mt-3 mb-3"
                        fullWidth
                        onClick={eraseFolder}
                      >
                        Erase
                      </Button>
                    ) : (
                      <Button
                        label="Click Here"
                        disabled
                        variant="outlined"
                        color="primary"
                        className="mt-3 mb-3"
                        fullWidth
                      >
                        Erase
                      </Button>
                    )}
                  </div>
                  <div className="col-2"></div>
                </div>
              </div>
              <div className="row mt-5 mb-3">
                <div className="col-2"></div>
                <div className="col-4">
                  <Button
                    label="Click Here"
                    variant="outlined"
                    color="error"
                    className="mt-3"
                    fullWidth
                    value={fileName}
                    onClick={uploadExpData}
                  >
                    Upload
                  </Button>
                </div>
                <div className="col-1"></div>
                <div className="col-4">
                  <Button
                    label="Click Here"
                    variant="outlined"
                    color="info"
                    className="mt-3"
                    fullWidth
                    onClick={() => props.handleClose()}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="col-1"></div>
              </div>
            </div>
            <div className="col-6 border">
              <div>
                <Typography component="div" className="mb-2 p-2">
                  <h6>Server Data View</h6>
                </Typography>
                <TreeView
                  aria-label="file system navigator"
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  sx={{
                    height: 440,
                    flexGrow: 1,
                    maxWidth: 400,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                  }}
                >
                  {props.experiments.length ? (
                    <TreeViewFoldersExp data={props.experiments} />
                  ) : (
                    <label>No data found, please upload..</label>
                  )}
                </TreeView>
                <Button
                  label="Click Here"
                  variant="outlined"
                  color="success"
                  className="mt-3 mb-3"
                  fullWidth
                  onClick={onClickTreeSelectBtn}
                >
                  SELECT
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="mt-2 mb-2">{uploading && <LinearProgress />}</div>
          </div>
        </div>
      </SimpleDialog>
      <DeleteSureDialog
        open={sureDialog}
        setDialogStatus={setSureDialog}
        sureDelete={sureDelete}
        selectedNum={checked.length}
      />
      <SuccessDialog open={successDialog} setsuccessStatus={setsuccessDialog} />
    </>
  );
};

const mapStateToProps = (state) => ({
  experiments: state.experiment.experiments,
  uploading: state.experiment.uploading,
});
OpenFileDialog.propTypes = { handleClose: PropTypes.func.isRequired };

export default connect(mapStateToProps)(OpenFileDialog);
