import React from 'react'
import DialogTitle from "@mui/material/DialogTitle";

export default function Candidate() {
  return (
    <div style={{ width: "42%", alignItems: "center", flexDirection: "column"}} className="d-flex">
      <DialogTitle>Candidate</DialogTitle>
      <div
        className="border border-black border-solid border-2"
        style={{ height: "320px", width: "100%" }}
      ></div>
    </div>
  );
}
