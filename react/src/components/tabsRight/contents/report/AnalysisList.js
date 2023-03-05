import * as React from 'react'
import {useState} from 'react'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import _6well from '../../../../assets/images/6well.png'
import _12well from '../../../../assets/images/12well.png'
import _24well from '../../../../assets/images/24well.png'
import _35dish from '../../../../assets/images/35dish.png'

const AnalysisList = (props) => {
  const [items, setItem] = useState([
    {id: 0, name: 'area'},
    {id: 1, name: 'number'},
    {id: 2, name: 'max intensity'},
    {id: 3, name: 'min intensity'},
    {id: 4, name: 'avg intensity'},
    {id: 5, name: 'area'},
    {id: 6, name: 'number'},
    {id: 7, name: 'max intensity'},
    {id: 8, name: 'min intensity'},
    {id: 9, name: 'avg intensity'},
    {id: 10, name: 'area'},
    {id: 11, name: 'number'},
    {id: 12, name: 'max intensity'},
    {id: 13, name: 'min intensity'},
    {id: 14, name: 'avg intensity'},
  ])

  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const [selects, setSelects] = useState([
    {id: 0, name: '6well', img: _6well},
    {id: 1, name: '12well', img: _12well},
    {id: 2, name: '24well', img: _24well},
    {id: 3, name: '35well', img: _35dish}
  ])

  const [selectedImg, setSelectedImgx] = useState(0)

  const selectItem = (e) => {
    setSelectedIndex(e.target.value)
  }

  const handleImgCheckboxClick = (e) => {
    setSelectedImgx(e.target.value)
  }


  const handleListItemClick = ( e, number ) => {
    setSelectedIndex(number)
  };

  return (
    <>
      <div className='visual-analysis-items'>
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <List component="nav" aria-label="main mailbox folders">
            {items.map((item) => 
              <ListItemButton
                key={`item-${item.id}`}
                selected={selectedIndex === item.id+1}
                onClick={(event) => handleListItemClick(event, item.id+1)}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            )}
          </List>
        </Box>
      </div>
      <div className='visual-sidebar-filter'>
        <Box className="visual-sidebar-filter-box" sx={{ minWidth: 50 }}>
          <FormControl>
            <NativeSelect
              defaultValue={0}
              inputProps={{
                name: 'filter',
                id: 'uncontrolled-native',
              }}
              onChange={(event)=>handleImgCheckboxClick(event)}
            >
              {selects.map((item) => 
                <option key={`item-${item.id}`} value={item.id}>{item.name}</option>
              )}
            </NativeSelect>
          </FormControl>
        </Box>
        <div className='visual-sidebar-imgBox'>
          <img alt={selects[selectedImg].name} src={selects[selectedImg].img} />        
        </div>
      </div>
    </>
  )
}

export default AnalysisList