import React, { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function SortItemBottom() {
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const minHandleChange = (event) => {
    setMinValue(event.target.value);
  };

  const maxHandleChange = (event) => {
    setMaxValue(event.target.value);
  };

  const minOptions = Array.from(Array(31).keys());

  const maxOptions = Array.from(Array(31).keys());

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={2} sx={{ display: "flex" }}>
          <FormControlLabel
            control={<Checkbox />}
            label="Active"
            sx={{ marginBottom: "0" }}
          />
        </Grid>
        <Grid
          item
          xs={7}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ margin: "0" }}>Min</p>
          <FormControl sx={{ width: "90%" }}>
            <InputLabel labelid="measure-class-label">0</InputLabel>
            <Select
              value={minValue}
              onChange={minHandleChange}
              inputProps={{
                name: "number",
                id: "min-number-select",
              }}
            >
              {minOptions.map((minOptions) => (
                <MenuItem key={minOptions} value={minOptions}>
                  {minOptions}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
          <Button variant="contained" color="inherit" size="small">
            Reset
          </Button>
        </Grid>
        <Grid
          item
          xs={7}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ margin: "0" }}>Max</p>
          <FormControl sx={{ width: "90%" }}>
            <InputLabel labelid="measure-class-label">0</InputLabel>
            <Select
              value={maxValue}
              onChange={maxHandleChange}
              inputProps={{
                name: "number",
                id: "max-number-select",
              }}
            >
              {maxOptions.map((maxOptions) => (
                <MenuItem key={maxOptions} value={maxOptions}>
                  {maxOptions}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
          <Button variant="contained" color="inherit" size="small">
            Apply Filter
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="inherit" size="small">
            ROI
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="inherit" size="small">
            Cancel
          </Button>
        </Grid>
        <Grid item xs={8}></Grid>
      </Grid>
    </Container>
  );
}
