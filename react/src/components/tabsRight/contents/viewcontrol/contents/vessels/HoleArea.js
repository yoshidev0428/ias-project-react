import React, {useState} from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

export default function HoleArea() {
const [value, setValue] = useState(30);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const options = Array.from(Array(101).keys());

  return (
    <div
      className="d-flex"
      style={{
        width: "50%",
        margin: "0 auto",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: "36px",
      }}
    >
      <span style={{ width: "30%" }}>Area</span>
      <FormControl sx={{ width: "30%" }}>
        <InputLabel labelid="Percentage-label">30</InputLabel>
        <Select
          value={value}
          onChange={handleChange}
          inputProps={{
            name: "percentage",
            id: "Percentage-select",
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <span style={{ width: "30%" }}>%</span>
    </div>
  );
}
