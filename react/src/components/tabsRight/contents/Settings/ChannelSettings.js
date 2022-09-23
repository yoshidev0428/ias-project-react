import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Row } from 'react-bootstrap';

export default function ChannelSettings() {
  let channels = [
    { id: 0, label: "S", color: "black", disabled: false },
    { id: 1, label: "B", color: "blue", disabled: false },
    { id: 2, label: "G", color: "green", disabled: false },
    { id: 3, label: "R", color: "red", disabled: false },
    { id: 4, label: "C", color: "cyan", disabled: false },
    { id: 5, label: "Y", color: "#ffc107", disabled: false },
    { id: 6, label: "M", color: "#e91e63", disabled: false }
  ];
  return (
    <>
      <div className="d-flex my-0 justify-space-around" style={{ flex: 1 }}>
        {channels.map((c, i) =>
          <div key={i} className="d-flex flex-column channel-box text-center">
            <Checkbox
              // onChange={toggleIsOn}
              // checked={channelsVisible}
              size="small"
              sx={{
                color: c.color, padding: 0,
                '&.Mui-checked': {
                  color: c.color,
                },
              }}

            />
            <span style={{ color: c.color }}>{c.label}</span>
          </div>
        )
        }
      </div>
    </>
  );
};