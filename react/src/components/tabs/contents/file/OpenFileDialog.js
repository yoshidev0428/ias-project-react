import React, {useState} from 'react';
import { connect  } from 'react-redux';
import store from "../../../../reducers";
import SimpleDialog from "../../../custom/SimpleDialog";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import {Row, Col} from 'react-bootstrap';
import Icon from '@mdi/react';
import { 
  mdiFolderOpen
} from '@mdi/js';
import {
  FileItem,
  FileItemContainer,
  FullScreenPreview,
  InputButton
} from "@dropzone-ui/react";
import {useFlagsStore} from "../../../../components/state";
const OpenFileDialog = (props) => {

  const dialogFlag = useFlagsStore(store => store.dialogFlag);

  const [validatedFiles, setvalidatedFiles] = useState([]);
  const [imgSource, setImgSource] = useState(false);
  const updateFiles = (incommingFiles) => {
    setvalidatedFiles(incommingFiles);
  };
  const onDelete = (id) => {
    setvalidatedFiles(validatedFiles.filter((x) => x.id !== id));
  };
  const onSelect = () => {
    useFlagsStore.setState({ dialogFlag: false });
    if (validatedFiles) {
      var formData = new FormData();
      formData.append("files", validatedFiles);
      store.dispatch({type:"image_setNewFiles", payload: {formData}});
    }
  };
  const onClose = () => {
    useFlagsStore.setState({ dialogFlag: false });
  };
  return (
    <>
      <div style={{width: 1200}}>
        <SimpleDialog
          title="File"
          singleButton={false}
          okTitle = "Select"
          closeTitle = "Cancel"
          newTitle = ""
          click={onClose}
          selected={onSelect}
        >
          <Icon className="mr-3" path={mdiFolderOpen} size={1} color='#1976d2'/>
          <InputButton
            onChange={updateFiles}
            label="Use F for opened files"
            accept="image/*,video/*"
            multiple
            style={{backgroundColor:'#1976d2'}}
          />
          <FileItemContainer view="list">
            {validatedFiles.map((validatedFile) => (
              <FileItem
                {...validatedFile}
                onDelete={onDelete}
                onSee={(src) => {
                  setImgSource(src);
                }}
                preview
                info
                hd
                //localization={"ES-es"}
              />
            ))}
            <FullScreenPreview
              imgSource={imgSource}
              openImage={imgSource}
              onClose={(e) => setImgSource(undefined)}
            />
          </FileItemContainer>
        </SimpleDialog>
      </div>
    </>
  );
  
}

export default OpenFileDialog;