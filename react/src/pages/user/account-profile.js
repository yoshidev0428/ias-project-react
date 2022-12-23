import { api } from "../../api/base";
import React, {useState, useEffect, useRef} from "react";
import { connect } from "react-redux";
import store from "../../reducers";
import SimpleDialog from "../../components/custom/SimpleDialog";
import CheckboxTree from 'react-checkbox-tree';
import * as api_experiment from "../../api/experiment"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  TextField
} from '@mui/material';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
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




const userInfo = {
  avatar: '/static/images/avatars/avatar_6.png',
};

const AccountProfile = (props) => {
  // const fileInput = React.useRef();
  // const user = props.user;

  // const uploadAvatar = (file) => {
  //     const state = store.getState();
  //     const formData = new FormData();
  //     formData.append("files", file);

  //     return api.post("image/avatar/upload_avatar/", formData, {
  //         headers: {
  //             "Access-Control-Allow-Origin": "*",
  //             "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  //             "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  //             "Content-Type": "multipart/form-data",
  //             "Authorization": state.auth.tokenType + " " + state.auth.token,
  //         }
  //     });
  // };

  // const handleSelectFile = async (e) => {
  //   if (e.target.files.length > 0) {
  //       const incommingFiles = [...e.target.files];
  //       let files = [];
  //       let newAcceptedFiles = [];

  //       for (let i = 0; i < incommingFiles.length; i++) {

  //           if (!files.includes(incommingFiles[i])) {
  //               files.push(incommingFiles[i]);
  //           }

  //           let file = incommingFiles[i]
  //           let newName = file.name.replace(/\s+/g, '');
  //           incommingFiles[i] = new File([file], newName, {type: file.type});
  //           incommingFiles[i]["path"] = file.name.replace(/\s+/g, "");
  //           newAcceptedFiles.push(incommingFiles[i]);
  //       }

  //       console.log("AccountProfile:", newAcceptedFiles);

  //       if (newAcceptedFiles.length > 0) {
  //           let resUpload = await uploadAvatar(newAcceptedFiles[0]);
  //       }
  //   }
  // }

  // return (
  //   <Card {...props}>
  //     <CardContent>
  //       <Box
  //         sx={{
  //           alignItems: 'center',
  //           display: 'flex',
  //           flexDirection: 'column'
  //         }}
  //       >
  //         <Avatar
  //           src={userInfo.avatar}
  //           sx={{
  //             height: 96,
  //             mb: 2,
  //             width: 96
  //           }}
  //         />
  //         <Typography
  //           color="textPrimary"
  //           gutterBottom
  //           variant="h5"
  //         >
  //          {user.fullName}
  //         </Typography>
  //         <Typography
  //           color="textSecondary"
  //           variant="body2"
  //         >
  //          {user.email}
  //         </Typography>
  //         <Typography
  //           color="textSecondary"
  //           variant="body2"
  //         >
  //           from {user.createdAt}
  //         </Typography>
  //       </Box>
  //     </CardContent>
  //     <Divider />
  //     <CardActions>
  //       <input
  //           ref={fileInput}
  //           style={{ display: 'none' }}
  //           accept="image/*"
  //           id="contained-button-file"
  //           type="file"
  //           onChange={handleSelectFile}
  //       />
  //       <Button
  //         color="primary"
  //         fullWidth
  //         variant="text"
  //         onClick={() => fileInput.current.click()}>
  //         Upload picture
  //       </Button>
  //     </CardActions>
  //   </Card>
  // );
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
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

  useEffect(() => {
    const getImages = async () => {
      let response = await api_experiment.getImageTree()
      console.log("account-profile: image_tree->", response)
      let exp_response = api_experiment.getExperimentNames()
      console.log("account-profile: exper_names->", exp_response)
      let data = response.data
      if(data.error) {
          console.log("Error occured while invoking getImageTree api")
          //alert("Error occured while getting the tree")
      } else {
          store.dispatch({type: "set_experiment_data", content: data.data});
      }
    }
    getImages();
  }, [])

  return (
      <div className="w-100 p-5">
          <Typography component="div" className="mb-4 text-center">View your cloud data</Typography>
          {props.experiments.length ?
              <CheckboxTree
                  id={'account-check-tree'}
                  nodes={props.experiments}
                  checked={checked}
                  expanded={expanded}
                  onCheck={checked => setChecked(checked)}
                  onExpand={expanded => setExpanded(expanded)}
                  icons={icons}
              /> : <label>No data found, please upload..</label>
          }
      </div>
  );
};

const mapStateToProps = state => ({
  experiments: state.experiment.experiments,
  // user: state.auth.user,
})

export default connect(mapStateToProps)(AccountProfile);