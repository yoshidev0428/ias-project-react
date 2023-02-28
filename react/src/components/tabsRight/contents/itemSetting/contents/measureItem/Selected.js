import React from "react";
import DialogTitle from "@mui/material/DialogTitle";

export default function Selected() {
  return (
    <div
      className="d-flex"
      style={{ width: "42%", alignItems: "center", flexDirection: "column" }}
    >
      <DialogTitle>Selected</DialogTitle>
      <div
        className="border border-black border-solid border-2"
        style={{ height: "320px", width: "100%" }}
      ></div>
    </div>
  );
}
