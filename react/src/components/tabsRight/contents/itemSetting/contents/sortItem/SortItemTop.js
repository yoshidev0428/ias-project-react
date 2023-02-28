import React, { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Icon from "@mdi/react";
import {
  mdiNoteMultipleOutline,
  mdiArrowLeftRight,
  mdiArrowUpDown,
} from "@mdi/js";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";

export default function SortItemTop() {
  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const options = Array.from(Array(31).keys());

  return (
    <Container sx={{ marginBottom: "16px" }}>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Grid item xs={2}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel labelid="measure-class-label">Class</InputLabel>
            <Select labelid="measure-class-label" id="my-select">
              <MenuItem value="Class1">Class1</MenuItem>
              <MenuItem value="Class2">Class2</MenuItem>
              <MenuItem value="Class3">Class3</MenuItem>
              <MenuItem value="Class4">Class4</MenuItem>
              <MenuItem value="Class5">Class5</MenuItem>
              <MenuItem value="Class6">Class6</MenuItem>
              <MenuItem value="Class7">Class7</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          <FormControl sx={{ width: "100%" }}>
            {/* <FormControl sx={{ width: "250px" }}></FormControl> */}
            <InputLabel labelid="measure-selected-item-label">
              Measure Selected Item
            </InputLabel>
            <Select
              labelid="measure-selected-item-label"
              id="measure-selected-item"
            >
              <MenuItem value="Item1">Item 1</MenuItem>
              <MenuItem value="Item2">Item 2</MenuItem>
              <MenuItem value="Item3">Item 3</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel labelid="bins-label">Bins</InputLabel>
            <Select
              value={value}
              onChange={handleChange}
              inputProps={{
                name: "number",
                id: "number-select",
              }}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1} sx={{ display: "flex" }}>
          <Button>
            <Icon
              size={1}
              horizontal
              vertical
              rotate={180}
              color="#000000de"
              path={mdiNoteMultipleOutline}
            ></Icon>
          </Button>
        </Grid>
        <Grid item xs={1} sx={{ display: "flex" }}>
          <Button>
            <Icon
              size={1}
              horizontal
              vertical
              rotate={180}
              color="#000000de"
              path={mdiArrowLeftRight}
            ></Icon>
          </Button>
        </Grid>
        <Grid item xs={1} sx={{ display: "flex" }}>
          <Button>
            <Icon
              size={1}
              horizontal
              vertical
              rotate={180}
              color="#000000de"
              path={mdiArrowUpDown}
            ></Icon>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
