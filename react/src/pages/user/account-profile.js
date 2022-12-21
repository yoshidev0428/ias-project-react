import { api } from "../../api/base";
import React, {useState, useEffect, useRef} from "react";
import { connect } from "react-redux";
import store from "../../reducers";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

const userInfo = {
  avatar: '/static/images/avatars/avatar_6.png',
};

const AccountProfile = (props) => {
  const fileInput = React.useRef();
  const user = props.user;

  const uploadAvatar = (file) => {
      const state = store.getState();
      const formData = new FormData();
      formData.append("files", file);
  
      return api.post("image/avatar/upload_avatar/", formData, {
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
              "Content-Type": "multipart/form-data",
              "Authorization": state.auth.tokenType + " " + state.auth.token,
          }
      });
  };
  
  const handleSelectFile = async (e) => {
    if (e.target.files.length > 0) {
        const incommingFiles = [...e.target.files];
        let files = [];
        let newAcceptedFiles = [];

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

        console.log("AccountProfile:", newAcceptedFiles);

        if (newAcceptedFiles.length > 0) {
            let resUpload = await uploadAvatar(newAcceptedFiles[0]);
        }
    }
  }

  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={userInfo.avatar}
            sx={{
              height: 96,
              mb: 2,
              width: 96
            }}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h5"
          >
           {user.fullName}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
           {user.email}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            from {user.createdAt}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <input
            ref={fileInput}
            style={{ display: 'none' }}
            accept="image/*"
            id="contained-button-file"
            type="file"
            onChange={handleSelectFile}
        />
        <Button
          color="primary"
          fullWidth
          variant="text"
          onClick={() => fileInput.current.click()}>
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user,
})

export default connect(mapStateToProps)(AccountProfile);