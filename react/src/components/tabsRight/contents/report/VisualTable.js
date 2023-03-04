import * as React from 'react'
import {useState} from 'react'
import { useTable, useSortBy } from 'react-table'
import Paper from '@mui/material/Paper'
import { Dayjs } from 'dayjs'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Checkbox from '@mui/material/Checkbox'

const  VisualTable = () => {

 const [data, setData] = useState([
    {
      col1: 'Jone Doe',
      col2: '27',
      col3: 'Jondragon',
      col4: true,
    },
    {
      col1: 'Lucas Maki',
      col2: '30',
      col3: 'big ben',
      col4: false,
    },
    {
      col1: 'Niko Rajala',
      col2: '23',
      col3:'tony',
      col4: true 
    },
    {
      col1: 'Jone Doe',
      col2: '27',
      col3: 'Jondragon',
      col4: true,
    },
    {
      col1: 'Lucas Maki',
      col2: '30',
      col3: 'big ben',
      col4: false,
    },
    {
      col1: 'Niko Rajala',
      col2: '23',
      col3:'tony',
      col4: true 
    },
    {
      col1: 'Jone Doe',
      col2: '27',
      col3: 'Jondragon',
      col4: true,
    },
    {
      col1: 'Lucas Maki',
      col2: '30',
      col3: 'big ben',
      col4: false,
    },
    {
      col1: 'Niko Rajala',
      col2: '23',
      col3:'tony',
      col4: true 
    }
  ])

 const [columns, setColumns] = useState([
    {
      Header: 'Name(Job Title)',
      accessor: 'col1', // accessor is the "key" in the data
    },
    {
      Header: '',
      accessor: 'col2',
      isSorted: true
    },
    {
      Header: 'Age',
      accessor: 'col3',
    },
    {
      Header: 'Nick Name',
      accessor: 'col4', // accessor is the "key" in the data
    },
    {
      Header: 'Employ',
      accessor: 'col5', // accessor is the "key" in the data
    },
  ])
  
  const [value, setValue] = useState(null)
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy)

  const userChecked = (e, number) => {
    const newData = data.map((item, i) => {
      if(number === i) {
        return {...item, col4: !item.col4}
      } else {
        return item
      }
    })
    setData(newData)
  }

 return (
     <div>
       <table {...getTableProps()} style={{ border: 'solid 1px black', width: '100%', textAlign: 'center' }}>
         <thead>
         {headerGroups.map(headerGroup => (
             <tr {...headerGroup.getHeaderGroupProps()}>
               {headerGroup.headers.map((column, i) => (
                   <th
                       {...column.getHeaderProps(column.getSortByToggleProps())}
                       style={{
                         borderBottom: 'solid 3px #000',
                         color: 'black',
                         backgroundColor: '#c1c1c1',
                         width: 'auto'
                       }}
                   >
                    {i !==1 && column.render('Header')}
                     {(() => {
                      if(i !== 1) {
                        return (
                          <span>
                            {column.isSorted
                                ? column.isSortedDesc
                                    ? '🔽'
                                    : '🔼'
                                : ''}
                          </span>
                        )
                      } else {
                        return (
                          <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DatePicker
                              value={value}
                              onChange={(newValue) => setValue(newValue)}
                              renderInput={(params) => <TextField
                                onFocus={(e) => {e.stopPropagation()}}
                                onClick={(e) => {e.stopPropagation()}} 
                                style={{padding: 0, width: '50%'}} {...params} variant="standard" />}
                            />
                          </LocalizationProvider>
                        )
                      }
                     })()}
                   </th>
               ))}
             </tr>
         ))}
         </thead>
         <tbody {...getTableBodyProps()}>
         {rows.map((row, i) => {
           prepareRow(row)
           return (
               <tr {...row.getRowProps()}>
                 <td colSpan="2" style={{padding: "10px", border: "solid 1px gray"}}>{row.cells[0].value}</td>
                 <td style={{padding: "10px", border: "solid 1px gray"}}>{row.cells[1].value}</td>
                 <td style={{padding: "10px", border: "solid 1px gray"}}>{row.cells[2].value}</td>
                 <td style={{padding: "10px", border: "solid 1px gray"}}>
                  <Checkbox {...label} 
                    checked={row.cells[3].value}
                    onChange={(e) => userChecked(e,i)}
                  />
                 </td>
               </tr>
           )
         })}
         </tbody>
       </table>
     </div>
 )
}

export default VisualTable;