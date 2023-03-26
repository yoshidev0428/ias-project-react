import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import SmallCard from '../../../custom/SmallCard';
import MeasureItemDialog from '../itemSetting/MeasureItemDialog';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import {
  classSettingColumns,
  classSettingRows,
} from '@/constants/class-setting';
import SortAreaDialog from '../itemSetting/SortAreaDialog';

export default function FourthPage() {
  const [showMeasureItemDialog, setShowMeasureItemDialog] = useState(false);
  const [showSortAreaDialog, setShowSortAreaDialog] = useState(false);

  const onClick7 = () => {};
  const onClick8 = () => {};
  const onClick9 = () => {};
  const onClick10 = () => {};

  return (
    <>
      <SmallCard title="Class Setting">
        <Box sx={{ height: 320, width: '100%' }}>
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
          style={{ width: '49%' }}
          onClick={() => setShowMeasureItemDialog(true)}
        >
          Measure item
        </Button>
        <Button
          className="btn btn-light btn-sm"
          style={{ width: '49%' }}
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
        <Button className="btn btn-light btn-sm" style={{ width: '49%' }}>
          Save
        </Button>
        <Button className="btn btn-light btn-sm" style={{ width: '49%' }}>
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
