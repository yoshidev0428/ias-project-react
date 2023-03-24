import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import SimpleDialog from '../../../custom/SimpleDialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import * as api_experiment from '@/api/experiment';
import store from '@/reducers';
import { selectImage, cancelImage } from '@/reducers/actions/filesAction';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { setNullView, initView } from '@/reducers/actions/vesselAction';
import Dropzone from 'react-dropzone';

import { MdFolderOpen, MdInsertDriveFile } from 'react-icons/md';

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
const ShowTreeList = (props) => {
  return (
    <div>
      <span
        style={{ cursor: 'pointer' }}
        className={
          props.data.value == props.showMother
            ? 'border border-info rounded'
            : ''
        }
        onClick={props.onsetShowMother}
        id={props.data.label}
      >
        <MdFolderOpen />
        {props.data.label}
      </span>
      <ul style={{ listStyleType: 'none' }}>
        {props.data.label == props.showMother &&
          props.data.children.map((item, index) => (
            <li
              style={{ cursor: 'pointer' }}
              onClick={props.checked}
              id={item.value}
              key={index}
            >
              <input
                type="checkbox"
                checked={item.value == props.checkedfile}
              />{' '}
              <MdInsertDriveFile /> {item.label}
            </li>
          ))}
      </ul>
    </div>
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

const OpenCloudDialogExp = (props) => {
  const upFName = 'upload_' + new Date().toISOString().replaceAll(':', '-');

  const [experimentName, setExperimentName] = useState('');
  const [_uploadFolderName, setUploadFolderName] = useState(upFName);
  const [fileName] = useState(null);
  const [checked, setChecked] = useState('');
  const [uploading, setUploading] = useState(false);
  const [sureDialog, setSureDialog] = useState(false);
  const [successDialog, setsuccessDialog] = useState(false);
  const [showMother, setShowMother] = useState('');
  const [_imageSrc, setImageSrc] = useState(null);
  const [addFolderName, setAddFolderName] = useState(null);
  const [addedFiles, setAddedFiles] = useState([]);

  const selectedImg = useSelector((state) => state.files.selectedImage);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // const handleInputChange = (event) => {
  //     setphoto123(URL.createObjectURL(event.target.files[0]));
  //     setFiles(event.target.files)
  // }
  const getTree = async () => {
    let response = await api_experiment.getExperiments();
    let data = response.data;
    // if (data.experiment_name.length!=0) {

    // }
    if (data.error) {
      //alert("Error occured while getting the tree")
    } else {
      let content = [];
      if (data.experiment_name.length != 0) {
        for (let i = 0; i <= data.experiment_name.length - 1; i++) {
          let content_children = [];
          for (let j = 0; j <= data.data[i].length - 1; j++) {
            let filename = '';
            let _label = data.data[i][j].split(auth.user._id)[1];
            if (_label) {
              filename = _label.split('/')[2];
            }
            content_children.push({
              value: data.data[i][j],
              label: filename,
            });
          }
          content.push({
            label: data.experiment_name[i],
            children: content_children,
            value: '/app/mainApi',
          });
        }
      }
      store.dispatch({ type: 'set_experiment_data', content: content });
    }
    setUploading(false);
  };
  const onSetShowMother = (e) => {
    if (showMother == e.target.id) {
      setShowMother('');
    } else {
      setShowMother(e.target.id);
    }
  };
  const deleteFiles = async () => {
    setUploading(true);
    try {
      let response = await api_experiment.deleteImageFiles(checked);
      let data = response.data;
      if (data.success) {
        getTree();
      } else {
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

  // const registerExperimentData = async () => {
  //     try {
  //         let response = await api_experiment.registerExperiment(experimentName, checked)
  //         let data = response.data

  //         if(data.success) {
  //             alert("Successfully registered")
  //         } else {
  //             alert("Failed to register")
  //         }
  //         props.handleClose()
  //     } catch(err) {
  //         props.handleClose()
  //         throw err
  //     }
  // }
  const onsetChecked = (e) => {
    // const length_checked = e.length;
    // const ch =[]
    // ch.push(e[length_checked-1])
    dispatch(selectImage(e.target.id));
    setChecked(e.target.id);
  };
  useEffect(() => {
    if (selectedImg != null) {
      const imgsrc =
        process.env.REACT_APP_BASE_API_URL +
        'image/tile/get_image' +
        selectedImg.split(auth.user._id)[1];
      setImageSrc(imgsrc);
      fetch(imgsrc, {
        method: 'GET',
        headers: { Authorization: auth.tokenType + ' ' + auth.token },
      }).then((_response) => {
        // const data = `data:${response.headers['content-type']};base64,${new Buffer(response.data).toString('base64')}`;
        // setImageSrc(response.body)
      });
    }
  }, [selectedImg, setImageSrc]);
  useEffect(() => {
    setUploading(true);
    setExperimentName('');
    setUploadFolderName('');

    getTree();
    setUploading(false);
  }, []);

  // const icons = {
  //     check: <MdCheckBox className="rct-icon rct-icon-check" />,
  //     uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
  //     halfCheck: (
  //         <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
  //     ),
  //     expandClose: (
  //         <MdChevronRight className="rct-icon rct-icon-expand-close" />
  //     ),
  //     expandOpen: (
  //         <MdKeyboardArrowDown className="rct-icon rct-icon-expand-open" />
  //     ),
  //     expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
  //     collapseAll: (
  //         <MdIndeterminateCheckBox className="rct-icon rct-icon-collapse-all" />
  //     ),
  //     parentClose: <MdFolder className="rct-icon rct-icon-parent-close" />,
  //     parentOpen: <MdFolderOpen className="rct-icon rct-icon-parent-open" />,
  //     leaf: <MdInsertDriveFile className="rct-icon rct-icon-leaf-close" />
  // };

  // const handleSelectFile = async () => {
  //     if (image.length > 0) {
  //         setUploading(true)

  //         const incommingFiles = [...image];
  //         let files = [];
  //         let newAcceptedFiles = [];
  //         let acceptedFileCount = 0;

  //         for (let i = 0; i < incommingFiles.length; i++) {

  //             if (!files.includes(incommingFiles[i])) {
  //                 files.push(incommingFiles[i]);
  //             }

  //             let file = incommingFiles[i]
  //             let newName = file.name.replace(/\s+/g, '');
  //             incommingFiles[i] = new File([file], newName, { type: file.type });
  //             incommingFiles[i]["path"] = file.name.replace(/\s+/g, "");
  //             newAcceptedFiles.push(incommingFiles[i]);
  //         }

  //         if (newAcceptedFiles.length > 0) {
  //             //************************************************************************** */
  //             let resUpload = await api_tiles.uploadImages(newAcceptedFiles, uploadFolderName);
  //             if (resUpload.status == 200)
  //                 setsuccessDialog(true)
  //             setFiles([])
  //             setphoto123(null)
  //             getTree()
  //         }
  //         // setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
  //     }
  // }
  // const removeImage = (e) => {
  //     setSureDialog(true)
  // }
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
    let folderName = '';
    if (files.length == 0) {
      alert('choose at least one file');
    } else {
      setAddedFiles(files);
      folderName = files[0].path.split('/');
      setAddFolderName(folderName[0]);
    }
  };

  const uploadExpData = async () => {
    await api_experiment.setExperiment(
      experimentName,
      addFolderName,
      addedFiles,
    );
  };
  return (
    <>
      <SimpleDialog
        title="Cloud"
        checked={checked}
        singleButton={false}
        fullWidth={true}
        okTitle="REGISTER EXPERIMENT"
        closeTitle="CANCEL"
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
                    <div className="container">
                      <div
                        {...getRootProps({
                          className: 'dropzone',
                          onDrop: (event) => event.stopPropagation(),
                        })}
                      >
                        <input
                          {...getInputProps()}
                          directory=""
                          webkitdirectory=""
                          type="file"
                        />
                        <div className="border rounded p-4 text-center">
                          <p>Upload Here or Selete Btn</p>
                        </div>
                      </div>
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
                      className="mt-3"
                      fullWidth
                      value={fileName}
                      // onClick={() => fileInput.current.click()}
                    >
                      Select
                    </Button>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-3">
                    <Button
                      label="Click Here"
                      variant="outlined"
                      color="primary"
                      className="mt-3"
                      fullWidth
                      // onClick={() => setphoto123(null)}
                    >
                      Erase
                    </Button>
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
                    // onClick={() => setphoto123(null)}
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
                  <h6>View your files</h6>
                </Typography>
                {props.experiments.length ? (
                  // <CheckboxTree
                  //     nodes={props.experiments}
                  //     checked={checked}
                  //     expanded={expanded}
                  //     onCheck={checked => onsetChecked(checked)}
                  //     onExpand={expanded => setExpanded(expanded)}
                  //     icons={icons}
                  // />
                  props.experiments.map((item, index) => (
                    <ShowTreeList
                      showMother={showMother}
                      onsetShowMother={onSetShowMother}
                      checkedfile={checked}
                      key={index}
                      checked={onsetChecked}
                      data={item}
                    />
                  ))
                ) : (
                  <label>No data found, please upload..</label>
                )}
                {/* {imageSrc!=null&&<img src={imageSrc} className="rounded mb-3" alt="Cinque Terre" width="70%" height="220px"/>}
                                        { photo123==null?
                                                <Button
                                                label="Click Here"
                                                variant="outlined"
                                                color="success"
                                                fullWidth
                                                value={fileName}
                                                onClick={() => fileInput.current.click()}
                                            >
                                                Select File
                                            </Button>:<Button
                                                label="Click Here"
                                                variant="outlined"
                                                color="primary"
                                                className="mt-3"
                                                fullWidth
                                                onClick={() => setphoto123(null)}
                                            >
                                                Cancel
                                            </Button>
                                            } */}
              </div>
              {/* <div className="mt-2 mb-4">
                                <div style={{display: 'flex', justifyContent:'flex-end'}}>
                                    <label htmlFor="contained-button-file" className="mr-2 mb-0">
                                        <input
                                            ref={fileInput}
                                            style={{ display: 'none' }}
                                            accept=""
                                            id="contained-button-file"
                                            type="file"
                                            multiple
                                            onChange={handleInputChange}
                                        />

                                        {photo123!=null &&
                                        <Button
                                            label="Click Here"
                                            variant="outlined"
                                            color="success"
                                            className=""
                                            fullWidth
                                            value={fileName}
                                            onClick={handleSelectFile}
                                        >
                                            UPLOAD FILES
                                        </Button>}
                                    </label>
                                    {checked.length!=0 &&
                                    <Button variant="outlined" color="error" onClick={removeImage}>
                                        Remove
                                    </Button>
                                    }
                                </div>
                                <TextField
                                    label="New upload foldername"
                                    variant="standard"
                                    fullWidth
                                    value={uploadFolderName}
                                    onChange={e => setUploadFolderName(e.target.value)}
                                />
                            </div> */}
            </div>
          </div>
        </div>

        <div className="mt-2 mb-2">{uploading && <LinearProgress />}</div>
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
OpenCloudDialogExp.propTypes = { handleClose: PropTypes.func.isRequired };

export default connect(mapStateToProps)(OpenCloudDialogExp);
