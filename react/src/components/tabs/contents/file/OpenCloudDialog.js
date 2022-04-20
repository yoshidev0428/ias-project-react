import React, { useState } from "react";
import PropTypes from "prop-types";
import SimpleDialog from "../../../custom/SimpleDialog";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const OpenCloudDialog = (props) => {
  const fileInput = React.useRef();
  const [experimentName, setExperimentName] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [cloudData, setCloudData] = useState([]);
  
  const handleSelectFile = (e) => {
    console.log('handleSelectFile', e.target.files)
    if (e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      setFileName(fileName);
    }
  }

  const addImage = (e) => {
    console.log('addImage', fileName, experimentName)
    cloudData.push({ experimentName, fileName })
    setCloudData([...cloudData]);
    setFileName('');
    setExperimentName('');
  }

  return (
    <>
      <SimpleDialog
        title="Cloud"
        singleButton={false}
        fullWidth={true}
        okTitle="View the cloud"
        closeTitle="Cancel"
        newTitle=""
        click={props.handleClose}
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
        <div className="mb-4">
          <Typography component="div">Select Data</Typography>
          <label htmlFor="contained-button-file" style={{width: '100%'}}>
            <input
              ref={fileInput}
              style={{display: 'none'}}
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={(e) => handleSelectFile(e)}
            />
            <TextField
              label="Click Here"
              variant="standard"
              fullWidth
              value={fileName}
              onClick={() => fileInput.current.click()}
            />
          </label>
        </div>
        <div>
          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ flexGrow: 1, overflowY: "auto" }}
            fullWidth
          >
            { cloudData.map((item, index) => (
              <TreeItem
                key={index}
                nodeId={index * 2}
                label={
                  <FormControlLabel 
                    label={item.experimentName}
                    control={<Checkbox/>}
                  ></FormControlLabel>
                }
              >
                <TreeItem
                  key={index}
                  nodeId={index * 2 + 1}
                  label={
                    <FormControlLabel 
                      label={item.fileName}
                      control={<Checkbox/>}
                    ></FormControlLabel>
                  }
                />
              </TreeItem>
            ))}
            {/* <TreeItem nodeId="1" label="Applications">
              <TreeItem nodeId="2" label="Calendar" />
              <TreeItem
                label={
                  <>
                  <FormControlLabel 
                    control={<Checkbox/>}
                  ></FormControlLabel>
                  AAAA
                  </>
                }
              />
            </TreeItem>
            <TreeItem nodeId="5" label="Documents">
              <TreeItem nodeId="10" label="OSS" />
              <TreeItem nodeId="6" label="MUI">
                <TreeItem nodeId="8" label="index.js" />
              </TreeItem>
            </TreeItem> */}
          </TreeView>
        </div>
        <div>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              borderRadius: 1,
            }}
          >
            <Button variant="contained" className="ml-2">
              Upload
            </Button>
            <Button variant="contained" onClick={addImage}>
              Select Data
            </Button>
          </Box>
        </div>
      </SimpleDialog>
    </>
  );
};
OpenCloudDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
};
export default OpenCloudDialog;
