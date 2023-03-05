import * as React from 'react'
import {useState} from 'react'
import Paper from '@material-ui/core/Paper';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
} from '@devexpress/dx-react-chart-material-ui'
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

const VisualLineChart = (props) => {
  const [data, setData] = useState([
    { x: 1, y: 30 },
    { x: 2, y: 40 },
    { x: 3, y: 5 },
    { x: 4, y: 2 },
    { x: 5, y: 21 },
  ])
  const [items, setItem] = useState([
    {id: 0, name: 'hearmap'},
    {id: 1, name: 'histagram'},
    {id: 2, name: 'graph'},
    {id: 3, name: 'vt-NSE'},
    {id: 4, name: 'dotplot'}
  ])

  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (e) => {
    setSelectedIndex(e.target.value)
  }

  return (
    <div className='visual-main-panel-screen-content'>
      <Box sx={{ minWidth: 50 }} style={{position: 'absolute', zIndex:9999, backgroundColor: '#c1c1c1'}}>
        <FormControl>
          <NativeSelect
            defaultValue={0}
            inputProps={{
              name: 'filter',
              id: 'uncontrolled-native',
            }}
            onChange={(event)=>selectItem(event)}
          >
            {items.map((item) => 
              <option key={`item-${item.id}`} value={item.id}>{item.name}</option>
            )}
          </NativeSelect>
        </FormControl>
      </Box>
      <Paper>
        <Chart style={{position: 'absolute', width: '100%'}}
          data={data}
        >
          <ArgumentAxis />
          <ValueAxis />
          <LineSeries valueField="y" argumentField="x" />
        </Chart>
      </Paper>
    </div>
  )
}

export default VisualLineChart