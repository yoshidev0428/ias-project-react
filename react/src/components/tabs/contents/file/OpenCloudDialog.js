import * as React from 'react';
import PropTypes from 'prop-types';
import SimpleDialog from "../../../custom/SimpleDialog";
import { Col } from 'react-bootstrap';
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import Slider from '@mui/material/Slider';
const OpenCloudDialog = (props) => {

  const selectROI = () => {
    console.log("selectROI");
  };

  return (
    <>
    
      <SimpleDialog title="Cloud"
        singleButton={false}
        okTitle = "View the cloud"
        closeTitle = "Cancel"
        newTitle = ""
        // // select="action"
        // close="visibleDialog = false"
        click={props.handleClose}
      >
        
      </SimpleDialog>
    </>
  );
}
OpenCloudDialog.propTypes = {
  handleClose: PropTypes.func.isRequired
};
export default OpenCloudDialog;