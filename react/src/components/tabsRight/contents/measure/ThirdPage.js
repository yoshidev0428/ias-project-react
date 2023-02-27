import React, { useState } from "react";
import { Button } from "react-bootstrap";
import SmallCard from "../../../custom/SmallCard";
import MeasureItemDialog from '../itemSetting/MeasureItemDialog';
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {classSettingColumns, classSettingRows} from '../../../constant/class-setting';
import SortAreaDialog from "../itemSetting/SortAreaDialog";
// import Divider from '@mui/material/Divider';
// import CustomButton from "../../../custom/CustomButton";
// import {
//     mdiContentSave,
//     mdiContentSaveEdit,
//     mdiPlayCircleOutline,
//     mdiStopCircleOutline,
//     mdiContentSaveOutline,
//     mdiCloseCircleOutline,
// } from '@mdi/js'

export default function FourthPage() {
  const [showMeasureItemDialog, setShowMeasureItemDialog] = useState(false);
  const [showSortAreaDialog, setShowSortAreaDialog] = useState(false);

  const onClick1 = () => {
    console.log("onClick Measure Item");
  };
  const onClick2 = () => {
    console.log("onClick Sort Area");
  };
  const onClick3 = () => {
    console.log("onClick Save");
  };
  const onClick4 = () => {
    console.log("onClick Save As");
  };
  const onClick5 = () => {
    console.log("onClick Learning-Method Go");
  };
  const onClick6 = () => {
    console.log("onClick Go");
  };
  const onClick7 = () => {
    console.log("onClick Stop");
  };
  const onClick8 = () => {
    console.log("onClick Stop");
  };
  const onClick9 = () => {
    console.log("onClick Stop");
  };
  const onClick10 = () => {
    console.log("onClick Stop");
  };

  return (
    <>
      <SmallCard title="Class Setting">
        <Box sx={{ height: 320, width: "100%" }}>
          <DataGrid
            rows={classSettingRows}
            columns={classSettingColumns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            // checkboxSelection
            disableSelectionOnClick
          />
        </Box>
      </SmallCard>
      <SmallCard title="Measure Contents">
        {showMeasureItemDialog && (
          <MeasureItemDialog
            open={showMeasureItemDialog}
            closeDialog={() => {
              setShowMeasureItemDialog(false);
            }}
          />
        )}
        {showSortAreaDialog && (
          <SortAreaDialog
            open={showSortAreaDialog}
            closeDialog={() => {
              setShowSortAreaDialog(false);
            }}
          />
        )}
        <Button
          className="btn btn-light btn-sm"
          style={{ width: "49%" }}
          onClick={() => setShowMeasureItemDialog(true)}
        >
          Measure item
        </Button>
        <Button
          className="btn btn-light btn-sm"
          style={{ width: "49%" }}
          onClick={() => setShowSortAreaDialog(true)}
        >
          Sort area
        </Button>
        {/* <Button className="btn btn-light btn-sm w-16" onClick={onClick1}>
          Mi
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick2}>
          Ss
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick3}>
          S
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick4}>
          C
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick5}>
          L
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick6}>
          S
        </Button> */}
      </SmallCard>
      <SmallCard title="Method Save">
        <Button className="btn btn-light btn-sm" style={{ width: "49%" }}>
          Save
        </Button>
        <Button className="btn btn-light btn-sm" style={{ width: "49%" }}>
          Save as
        </Button>
      </SmallCard>
      <SmallCard title="Go">
        <Button className="btn btn-light btn-sm w-3/12" onClick={onClick7}>
          Go
        </Button>
        <Button className="btn btn-light btn-sm w-3/12" onClick={onClick8}>
          Stop
        </Button>
        <Button className="btn btn-light btn-sm w-3/12" onClick={onClick9}>
          Save
        </Button>
        <Button className="btn btn-light btn-sm w-3/12" onClick={onClick10}>
          Cancel
        </Button>
      </SmallCard>
      <p className="mt-4">Time remain</p>
      {/* <SmallCard title=""></SmallCard> */}
    </>
  );
}
