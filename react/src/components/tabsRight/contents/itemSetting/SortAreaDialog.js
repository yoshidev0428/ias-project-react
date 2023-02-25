import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Icon from "@mdi/react";
import {
  mdiNoteMultipleOutline,
  mdiArrowLeftRight,
  mdiArrowUpDown,
} from "@mdi/js";
import SortItemTop from "./contents/sortItem/SortItemTop";
import SortItemBottom from "./contents/sortItem/SortItemBottom";

export default function SortAreaDialog(props) {
  const [open, setOpen] = useState(true);
  const maxDialogWidth = 800;

  const handleClose = () => {
    props.closeDialog();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"800"}>
      <div className="d-flex border-bottom">
        <DialogTitle>Sort Area</DialogTitle>
        <button
          className="dialog-close-btn"
          color="primary"
          size="small"
          onClick={handleClose}
        >
          &times;
        </button>
      </div>
      <div style={{ width: maxDialogWidth, margin: "16px 0" }}>
        <SortItemTop />
        <SortItemBottom />
      </div>
      <div className="border-top">
        <DialogActions>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Apply on Close"
            sx={{ marginBottom: "0" }}
          />
          <Button
            className=""
            variant="contained"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleClose}
          >
            Select
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
