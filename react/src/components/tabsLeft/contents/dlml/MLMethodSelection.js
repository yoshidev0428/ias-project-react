import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';
import { mdiPlusBox, mdiPlayBox } from '@mdi/js';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function MLMethodSelection() {
  const onNew = () => {};
  const onCall = () => {};

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div className="">
      <SmallCard title="">
        <FormControl sx={{ m: 1, minWidth: 120, fontSize: '0.8rem' }}>
          <InputLabel id="demo-select-small" sx={{ fontSize: '0.8rem' }}>
            Method
          </InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={age}
            label="Method"
            onChange={handleChange}
            sx={{ fontSize: '0.8rem', paddingY: '0px', p: 1 }}
            style={{ padding: '0px' }}
          >
            <MenuItem value={1} sx={{ fontSize: '0.8rem' }}>
              Pixel Classification
            </MenuItem>
            <MenuItem value={2} sx={{ fontSize: '0.8rem' }}>
              Object Classification
            </MenuItem>
            <MenuItem value={3} sx={{ fontSize: '0.8rem' }}>
              Boundary Based Classification
            </MenuItem>
          </Select>
        </FormControl>
      </SmallCard>
      <div
        className="d-flex justify-content-around"
        style={{ paddingBottom: '4px' }}
      >
        <CustomButton icon={mdiPlusBox} onClick={() => onNew()} />
        <CustomButton icon={mdiPlayBox} onClick={() => onCall()} />
      </div>
    </div>
  );
}
