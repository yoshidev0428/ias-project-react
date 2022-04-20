import * as React from "react";
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

const Input = styled("input")({
  display: "none",
});

const OpenCloudDialog = (props) => {
  const fileInput = React.useRef();

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
        <div className="mb-4">
          <TextField
            id="experiment-name"
            label="Experiment name"
            variant="outlined"
            fullWidth
          />
        </div>
        <div className="mb-4">
          <Typography component="div">Select Data</Typography>
          <label htmlFor="contained-button-file" style={{width: '100%'}}>
            <Input
              ref={fileInput}
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
            />
            <TextField
              label="Click Here"
              variant="outlined"
              fullWidth
              onClick={() => fileInput.current.click()}
            />
          </label>
        </div>
        <div>
          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
          >
            <TreeItem nodeId="1" label="Applications">
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
            </TreeItem>
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
            <Button variant="contained">
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
