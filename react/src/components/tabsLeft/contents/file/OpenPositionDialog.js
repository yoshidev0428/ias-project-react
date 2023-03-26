import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
// import { useDropzone } from "react-dropzone"
// import { borderBottom } from "@mui/system";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Dropzone } from '@dropzone-ui/react';
import { Row, Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import SearchBar from 'material-ui-search-bar';
import TextField from '@mui/material/TextField';
import store from '@/reducers';
import * as api_tiles from '@/api/tiles';
import * as api_experiment from '@/api/experiment';
import OpenCloudDialog from './OpenCloudDialog';
import OpenCloudUploadNew from './OpenCloudUpload';
import Tiling from './Tiling';
import { FileIcon, defaultStyles } from 'react-file-icon';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { setFolderName } from '@/reducers/actions/filesAction';
var acceptedFiles = [];

const columns = [
  { headerName: 'No', field: 'id', sortable: false },
  { headerName: 'FileName', field: 'filename', sortable: false },
  // {headerName: "Series", field: "series", sortable: false},
  // {headerName: "Frame", field: "frame", sortable: false},
  { headerName: 'DimensionOrder', field: 'dimension_order', sortable: false },
  { headerName: 'SizeC', field: 'size_c', sortable: false },
  { headerName: 'SizeT', field: 'size_t', sortable: false },
  { headerName: 'SizeX', field: 'size_x', sortable: false },
  { headerName: 'SizeY', field: 'size_y', sortable: false },
  { headerName: 'SizeZ', field: 'size_z', sortable: false },
  { headerName: 'Type', field: 'type', sortable: false },
];

const namePatternOrders = [
  'id',
  'filename',
  'series',
  'time',
  'z',
  'row',
  'col',
  'field',
  'channel',
];

const nameTypeTableHeaders = [
  { headerName: 'No', field: 'id' },
  { headerName: 'FileName', field: 'filename' },
  { headerName: 'Series', field: 'series' },
  { headerName: 'Row', field: 'row' },
  { headerName: 'Column', field: 'col' },
  { headerName: 'Field', field: 'field' },
  { headerName: 'Channel', field: 'channel' },
  { headerName: 'Z Position', field: 'z' },
  { headerName: 'Time Point', field: 'time' },
];

const namePatternsPrimary = [
  {
    label: 'Series',
    text: '',
    start: 0,
    end: 17,
    color: '#4caf50',
    field: 'series',
  },
  {
    label: 'Row',
    text: '',
    start: 24,
    end: 25,
    color: '#1976d2',
    field: 'row',
  },
  {
    label: 'Column',
    text: '',
    start: 25,
    end: 27,
    color: '#ff5722',
    field: 'col',
  },
  {
    label: 'Field',
    text: '',
    start: 27,
    end: 30,
    color: '#fb8c00',
    field: 'field',
  },
  {
    label: 'Channel',
    text: '',
    start: 30,
    end: 32,
    color: '#9c27b0',
    field: 'channel',
  },
  {
    label: 'Z Position',
    text: '',
    start: 22,
    end: 23,
    color: '#607d8b',
    field: 'z',
  },
  {
    label: 'Time Point',
    text: '',
    start: 18,
    end: 21,
    color: '#ff5252',
    field: 'time',
  },
];
// const namePatternsPrimary = [
//     {label: "Series", text: "LiveDead2_Plate_R", start: 0, end: 15, color: "#4caf50", field: "series"},
//     {label: "Row", text: "A", start: 25, end: 26, color: "#1976d2", field: "row"},
//     {label: "Column", text: "01", start: 26, end: 28, color: "#ff5722", field: "col"},
//     {label: "Field", text: "f21", start: 28, end: 31, color: "#fb8c00", field: "field"},
//     {label: "Channel", text: "d0", start: 31, end: 33, color: "#9c27b0", field: "channel"},
//     {label: "Z Position", text: "0", start: 23, end: 24, color: "#607d8b", field: "z"},
//     {label: "Time Point", text: "p150", start: 18, end: 22, color: "#ff5252", field: "time"},
// ];
// const namePatternsPrimary = [
//     { label: "Series", text: "LiveDead2_Plate_R", start: 0, end: 17, color: "#4caf50", field: "series" },
//     { label: "Row", text: "A", start: 24, end: 25, color: "#1976d2", field: "row" },
//     { label: "Column", text: "01", start: 25, end: 27, color: "#ff5722", field: "col" },
//     { label: "Field", text: "f00", start: 27, end: 30, color: "#fb8c00", field: "field" },
//     { label: "Channel", text: "d0", start: 30, end: 32, color: "#9c27b0", field: "channel" },
//     { label: "Z Position", text: "0", start: 22, end: 23, color: "#607d8b", field: "z" },
//     { label: "Time Point", text: "p00", start: 18, end: 21, color: "#ff5252", field: "time" },
// ];

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 0 }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
const ImageDropzone = (props) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState(acceptedFiles);

  useEffect(() => {
    const bringFilesByName = async () => {
      const { fileNames, metaDatas } = props;

      let fileRoutes = '';
      let imgRoute = '';
      if (fileNames.length > 0) {
        fileRoutes = fileNames[0].split('\\');
        imgRoute = String(fileRoutes[4]);
        dispatch(setFolderName(imgRoute));
      }

      // props.setLoading(true);
      // let incommingFiles = []
      // incommingFiles = await getImagesByNames(fileNames);
      // let filesPath = fileNames

      let filesName = fileNames.map((fileName) =>
        fileName.replace(/^.*[\\\/]/, ''),
      );
      await updateNew(filesName, metaDatas);
      // await updateFilesNew(incommingFiles.map(file => {return {file: file}}), filesName)
    };
    bringFilesByName();
  }, [props.fileNames]);

  // const updateFilesByNames = (fileNames) => {
  //   store.dispatch({
  //     type: 'files_addFiles',
  //     content: { filesName: fileNames },
  //   });
  // };

  const updateNew = async (fileNames, metaDatas) => {
    let files = [];
    let newAcceptedFiles = [];
    acceptedFiles = [];
    for (let i = 0; i < fileNames.length; i++) {
      let fileName = fileNames[i];
      // function hex2a(hexx) {
      //   var hex = hexx.toString(); //force conversion
      //   var str = '';
      //   for (var i = 0; i < hex.length; i += 2)
      //     str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      //   return str;
      // }
      let f = new File([''], fileName, { type: 'image/tiff' });
      f.path = fileName;
      f.metadata = metaDatas[i];
      newAcceptedFiles.push(f);
      files.push(f);

      if (i == fileNames.length - 1) {
        if (newAcceptedFiles.length > 0) {
          acceptedFiles = acceptedFiles.concat(newAcceptedFiles);
          store.dispatch({
            type: 'files_addFiles',
            content: {
              filesName: acceptedFiles.map((file) => file.name),
              filesPath: fileNames,
            },
          });
        }
        props.setLoading(false);
        setFiles(files);
      }
    }
  };

  // const updateFilesNew = async (incommingFiles, filesPath) => {
  //   props.setLoading(true);
  //   let files = [];
  //   let newAcceptedFiles = [];
  //   for (let i = 0; i < incommingFiles.length; i++) {
  //     if (!files.includes(incommingFiles[i])) {
  //       files.push(incommingFiles[i]);
  //     }
  //     if (!acceptedFiles.includes(incommingFiles[i].file)) {
  //       let file = incommingFiles[i].file;
  //       let newName = file.name.replace(/\s+/g, '');
  //       incommingFiles[i].file = new File([file], newName, { type: file.type });
  //       incommingFiles[i].file['path'] = file.name.replace(/\s+/g, '');
  //       // incommingFiles[i].file.name = incommingFiles[i].file.name.trim()
  //       newAcceptedFiles.push(incommingFiles[i].file);
  //       files.push(file);
  //       setFiles(files);
  //     }
  //   }
  //   if (newAcceptedFiles.length > 0) {
  //     acceptedFiles = acceptedFiles.concat(newAcceptedFiles);
  //     store.dispatch({
  //       type: 'files_addFiles',
  //       content: {
  //         filesName: acceptedFiles.map((file) => file.name),
  //         filesPath: filesPath,
  //       },
  //     });
  //   }
  //   props.setLoading(false);
  // };

  const updateFiles = async (incommingFiles) => {
    props.setLoading(true);
    let files = [];
    let newAcceptedFiles = [];
    for (let i = 0; i < incommingFiles.length; i++) {
      if (!files.includes(incommingFiles[i])) {
        files.push(incommingFiles[i]);
      }
      if (!acceptedFiles.includes(incommingFiles[i].file)) {
        let file = incommingFiles[i].file;
        let newName = file.name.replace(/\s+/g, '');
        incommingFiles[i].file = new File([file], newName, { type: file.type });
        incommingFiles[i].file['path'] = file.name.replace(/\s+/g, '');
        // incommingFiles[i].file.name = incommingFiles[i].file.name.trim()
        newAcceptedFiles.push(incommingFiles[i].file);
      }
    }
    if (newAcceptedFiles.length > 0) {
      let resUpload = await api_tiles.uploadImageFiles(newAcceptedFiles);
      acceptedFiles = acceptedFiles.concat(newAcceptedFiles);
      let imagePath = resUpload.data.path;
      if (resUpload.data !== null && resUpload.data !== undefined) {
        store.dispatch({
          type: 'files_addFiles',
          content: {
            filesName: acceptedFiles.map((file) => file.name),
            path: imagePath,
          },
        });
      }
      setFiles(files);
    }
    props.setLoading(false);
  };

  const startDrop = (_drop) => {
    store.dispatch({ type: 'files_removeAllFiles', content: [] });
    setFiles([]);
    acceptedFiles = [];
  };

  const clickDrop = (e) => {
    e.preventDefault();
    props.handleExperimentDialog();
  };

  return (
    <Dropzone
      key="choose_cloud"
      onChange={(incommingFiles) => updateFiles(incommingFiles)}
      onClick={(e) => clickDrop(e)}
      onReset={() => {
        setFiles([]);
      }}
      onDrop={() => {
        startDrop();
      }}
      label={<div>Choose from the experiment - Cloud</div>}
      value={files}
    >
      {files.map((file, index) => (
        <div
          style={{
            width: '20%',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
          }}
          key={index}
        >
          <FileIcon
            extension={file.name.split('.').pop()}
            {...defaultStyles.tif}
          />
          <label style={{ overflow: 'hidden' }}>{file.name}</label>
        </div>
      ))}
    </Dropzone>
  );
};

const DropzoneMetaData = () => {
  // Pagination
  const [pageSize, setPageSize] = useState(5);
  // Table Rows
  const [loading, setLoading] = useState(false);
  // Search
  const [searchrows, setSearchRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  // Search Bar
  const [searched, setSearched] = useState('');
  const [flag, setFlag] = useState(1);
  const [pagerow, setPageRow] = useState([]);
  const requestSearch = (searchedVal) => {
    if (searchedVal) {
      const filteredRows = allRows.filter((content) => {
        return content.filename
          .toLowerCase()
          .includes(searchedVal.toLowerCase());
      });
      setSearchRows(filteredRows);
    } else {
      setSearchRows(allRows);
    }
  };
  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };
  const backgroundText = loading
    ? 'Loading...'
    : 'Drag and drop files or a folder';

  const fetchMetaData = async () => {
    let response = await api_experiment.getMetaData();
    let acceptedFiles = response.data.data;
    if (acceptedFiles) {
      setSearchRows([]);
      setAllRows([]);
      for (let i = 0; i < acceptedFiles.length; i++) {
        let item = JSON.parse(acceptedFiles[i].metadata);
        if (item) {
          let current_file = {
            id: (i + 1).toString(),
            filename: acceptedFiles[i].file_name,
            // series: "",
            // frame: "",
            acquisitionDate: item['metadata']['acquisitionDate'],
            dimension_order: item['metadata']['DimensionOrder'],
            size_c: item['metadata']['SizeC'],
            size_t: item['metadata']['SizeT'],
            size_x: item['metadata']['SizeX'],
            size_y: item['metadata']['SizeY'],
            size_z: item['metadata']['SizeZ'],
            type: item['metadata']['Type'],
          };
          setSearchRows((rows) => [...rows, current_file]);
          setAllRows((rows) => [...rows, current_file]);
        }
      }
      setLoading(true);
    }
  };
  const detailFetchMetaData = (props) => {
    setFlag(0);
    setPageRow(props.row);
    // exp_meta_info == null ? (
    //     <div className="d-flex align-center justify-center pt-5">
    //                 {backgroundText}
    //     </div>):
  };
  // const exp_meta_info = useSelector( state => state.experiment.metainfo);
  useEffect(() => {
    fetchMetaData();
  }, []);

  return (
    <div style={{ minHeight: '200px' }}>
      {/* <input {...getInputProps()} /> */}
      {allRows.length === 0 ? (
        <div className="d-flex align-center justify-center pt-5">
          {backgroundText}
        </div>
      ) : flag === 1 ? (
        <Card>
          <CardContent>
            <SearchBar
              value={searched}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
          </CardContent>
          <div
            className=""
            style={{ height: '380px', width: '100%', border: '2px solid gray' }}
          >
            <DataGrid
              className="cell--textCenter"
              style={{ textAlign: 'center', width: '100%' }}
              rows={searchrows}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => {
                if (isNaN(newPageSize)) {
                  setPageSize(searchrows.length);
                } else {
                  setPageSize(newPageSize);
                }
              }}
              rowsPerPageOptions={[2, 5, 10, 20, 25]}
              pagination
              onRowClick={(e) => {
                detailFetchMetaData(e);
              }}
            />
          </div>
        </Card>
      ) : (
        <Box sx={{ minHeight: '200px' }}>
          <h6 className="p-2">Meta Data</h6>
          <nav className="border">
            <List>
              <ListItem disablePadding>
                {/* <ListItemButton>
                                        <ListItemText primary={`VesselNum: ${exp_meta_info.vesselnum}`}></ListItemText>
                                    </ListItemButton> */}
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={`Filename: ${pagerow.filename}`}
                  ></ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={`AcquisitionDate: ${pagerow.acquisitionDate}`}
                  ></ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={`Dimension Order: ${pagerow.dimension_order}`}
                  ></ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={`Size_C: ${pagerow.size_c}`}
                  ></ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={`Size_T: ${pagerow.size_t}`}
                  ></ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={`Size_X: ${pagerow.size_x}`}
                  ></ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={`Size_Y: ${pagerow.size_y}`}
                  ></ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={`Size_Z: ${pagerow.size_z}`}
                  ></ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={`Type: ${pagerow.type}`}
                  ></ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
        </Box>
      )}
    </div>
  );
};

const DropzoneNamesFiles = (props) => {
  // Names & Files Tab
  const exampleBox = useRef(null);

  const [loading, setLoading] = useState(false); // Pagination
  const [pageSize, setPageSize] = useState(5); // Search
  const [contents, setContents] = useState([]);
  const [searchrows, setSearchRows] = useState([]); // Search Bar
  const [searched, setSearched] = useState('');

  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectionRange, setSelectionRange] = useState(null);
  const [namePatterns, setNamePatterns] = useState(namePatternsPrimary);
  //  Search Part
  const requestSearch = (searchedVal) => {
    const filteredRows = contents.filter((content) => {
      return content.filename.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setSearchRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };
  // Select update each fields -> namepattern
  const selectExampleString = () => {
    if (typeof window.getSelection !== 'undefined') {
      try {
        let sel = window.getSelection(),
          range = sel.getRangeAt(0);
        let selectionRect = range.getBoundingClientRect(),
          fullRect = exampleBox.current.getBoundingClientRect();
        let startOffset =
          ((selectionRect.left - fullRect.left) / selectionRect.width) *
          range.toString().length;
        startOffset = Math.round(startOffset);
        let selectionRangeValue = {
          text: range.toString(),
          startOffset: startOffset,
          endOffset: startOffset + range.toString().length,
        };
        setSelectionRange(selectionRangeValue);
      } catch (error) {}
    }
  };

  const getSelectionText = () => {
    var text = '';
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== 'Control') {
      text = document.selection.createRange().text;
    }
    return text.replaceAll('\n', '');
  };

  const clickNamePattern = (index) => {
    let selectedText = getSelectionText();
    if (selectionRange !== null && selectedText !== '') {
      let text = selectionRange.text;
      let startOffset = selectionRange.startOffset;
      let endOffset = selectionRange.endOffset;
      if (text.replace(/\s+/g, '') === selectedText) {
        if (startOffset > -1 && endOffset > -1) {
          let namePatternsPrimaryValue = [...namePatterns];
          for (var i = 0; i < namePatternsPrimaryValue.length; i++) {
            if (index === i) {
              namePatternsPrimaryValue[index].text = text;
              namePatternsPrimaryValue[index].start = startOffset;
              namePatternsPrimaryValue[index].end = endOffset;
              for (let j = startOffset; j < endOffset; j++) {
                document.getElementById('filename' + j.toString()).style.color =
                  namePatternsPrimaryValue[index].color;
              }
            }
          }
          setNamePatterns(namePatternsPrimaryValue);
        }
      }
    }
  };

  const onChangePattern = async (e, index) => {
    let selectedText = '';
    let inputed_value = e.target.value.toString();
    for (let i = 0; i < inputed_value.length; i++) {
      if (inputed_value.substring(i, i + 1) !== ' ') {
        selectedText = selectedText + inputed_value.substring(i, i + 1);
      }
    }
    if (selectionRange !== null) {
      let text = selectionRange.text;
      let startOffset = selectionRange.startOffset;
      let endOffset = selectionRange.endOffset;
      if (text === selectedText) {
        if (startOffset > -1 && endOffset > -1) {
          let namePatternsPrimaryValue = [...namePatterns];
          for (var i = 0; i < namePatternsPrimaryValue.length; i++) {
            if (index === i) {
              namePatternsPrimaryValue[index].text = text;
              namePatternsPrimaryValue[index].start = startOffset;
              namePatternsPrimaryValue[index].end = endOffset;
              for (let j = startOffset; j < endOffset; j++) {
                document.getElementById('filename' + j.toString()).style.color =
                  namePatternsPrimaryValue[index].color;
              }
            }
          }
          setNamePatterns(namePatternsPrimaryValue);
        }
      }
    }
  };
  // ----------------------------------------------------- update button function
  // Convert string to integer of some fields: row, col, field, channel, z, time
  const convertContentStringToInteger = (field, stringData, _moveIndex) => {
    let newField = '';
    let intField = -5;
    if (field === 'row') {
      intField = stringData.charCodeAt(0) - 65;
    } else {
      newField = stringData.replace(/\D/g, '');
      intField = parseInt(newField);
    }
    return intField;
  };

  const getNamePatternPerFileForProcessing = (objectPerFile) => {
    let result = {};
    let resultContent = {};
    let moveIndex = 0;
    result[`dimensionChanged`] = false;
    for (let i = 0; i < namePatternOrders.length; i++) {
      let key = namePatternOrders[i];
      if (key && objectPerFile !== null) {
        let currentIndex = 0;
        for (let k = 0; k < namePatterns.length; k++) {
          if (namePatterns[k].field === key) {
            currentIndex = k;
            break;
          }
        }
        let tempString = objectPerFile.filename.substring(
          namePatterns[currentIndex].start,
          namePatterns[currentIndex].end,
        );
        if (key === 'id') {
          resultContent[`${key}`] = objectPerFile.id;
        } else if (key === 'series') {
          result[`${key}`] = tempString;
          resultContent[`${key}`] = tempString;
        } else if (key === 'filename') {
          result[`${key}`] = objectPerFile.filename;
          resultContent[`${key}`] = objectPerFile.filename;
        } else if (key === 'z') {
          if (tempString === 'z') {
            for (let j = 1; j < 4; j++) {
              tempString = objectPerFile.filename.substring(
                namePatterns[currentIndex].start + j,
                namePatterns[currentIndex].start + j + 1,
              );
              if (tempString === '_') {
                moveIndex = j + 1;
                tempString = objectPerFile.filename.substring(
                  namePatterns[currentIndex].start + 1,
                  namePatterns[currentIndex].start + j,
                );
                result[`${key}`] = parseInt(tempString) + 1;
                resultContent[`${key}`] = objectPerFile.filename.substring(
                  namePatterns[currentIndex].start,
                  namePatterns[currentIndex].start + j,
                );
              }
            }
          } else {
            result[`${key}`] = convertContentStringToInteger(key, tempString);
            resultContent[`${key}`] = tempString;
          }
        } else {
          tempString = objectPerFile.filename.substring(
            namePatterns[currentIndex].start + moveIndex,
            namePatterns[currentIndex].end + moveIndex,
          );
          result[`${key}`] = convertContentStringToInteger(key, tempString);
          resultContent[`${key}`] = tempString;
        }
      }
    }
    return [result, resultContent];
  };

  const updateNameType = () => {
    if (acceptedFiles === null || acceptedFiles === undefined) {
      return '';
    }
    let new_content = [];
    let new_content_processing = [];
    let old_content = [...contents];
    let old_content_p = JSON.parse(JSON.stringify(old_content));
    let channels = [];
    let maxcol = '01',
      maxrow = 'A',
      zposition = 0,
      maxTimeLine = 'p00';
    for (let i = 0; i < old_content.length; i++) {
      let result = getNamePatternPerFileForProcessing(old_content_p[i]);
      new_content.push(result[1]);
      new_content_processing.push(result[0]);
      if (channels.length == 0) {
        channels.push(result[1].channel);
      } else {
        if (
          channels.findIndex((channel) => channel == result[1].channel) == -1
        ) {
          channels.push(result[1].channel);
        }
      }

      if (maxTimeLine.localeCompare(result[1].time) == 1)
        maxTimeLine = result[1].time;
      if (maxcol.localeCompare(result[1].col) == -1) maxcol = result[1].col;
      if (maxrow.localeCompare(result[1].row) == -1) maxrow = result[1].row;
      if (zposition < result[1].z) zposition = result[1].z;
    }
    let vessel = 'Wafer 150mm';
    if (maxcol == '01' && maxrow == 'A') {
      vessel = 'Slide Single';
    } else if (maxrow == 'A') {
      vessel = 'Slide Quattour';
    } else if (maxrow == 'B') {
      vessel = 'Well 4well';
    } else if (
      (maxrow.localeCompare('B') == 1 && maxrow.localeCompare('H') == -1) ||
      maxrow.localeCompare('H') == 0
    ) {
      vessel = 'Well 96well';
    }

    const metainfo = {
      vesselnum: 1,
      vessel: vessel,
      object: new_content[0].series,
      channel: channels,
      zposition: zposition,
      timeline: maxTimeLine,
    };
    store.dispatch({ type: 'setMetaInfo', content: metainfo });
    props.setContents(JSON.parse(JSON.stringify(new_content_processing)));
    setSearchRows(JSON.parse(JSON.stringify(new_content)));
  };

  // clear button + change file name
  const reset_namePatterns = () => {
    let namePatternsPrimaryValue = [...namePatterns];
    for (let i = 0; i < namePatternsPrimaryValue.length; i++) {
      namePatternsPrimaryValue[i].text = '';
      namePatternsPrimaryValue[i].start = 0;
      namePatternsPrimaryValue[i].end = 0;
    }
    setNamePatterns(namePatternsPrimaryValue);
  };

  const clearNameType = () => {
    for (let k = 0; k < selectedFileName.length; k++) {
      document.getElementById('filename' + k.toString()).style.color = '#000';
    }
    reset_namePatterns();
  };

  const updateNativeSelect = (event) => {
    setSelectedFileName(event.target.value.toString().split('.')[0]);
    reset_namePatterns();
  };

  useEffect(() => {
    setContents([]);
    setSearchRows([]);
    for (let i = 0; i < acceptedFiles.length; i++) {
      if (acceptedFiles[i]) {
        let current_file = {
          id: (i + 1).toString(),
          filename: acceptedFiles[i]['name'].toString().replace(/\s+/g, ''),
          series: '',
          row: '',
          col: '',
          field: '',
          channel: '',
          z: '',
          time: '',
          hole: -1,
        };
        setContents((contents) => [...contents, current_file]);
        setSearchRows((rows) => [...rows, current_file]);
      }
    }
    if (acceptedFiles.length > 0) {
      // filename: acceptedFiles[i].file["name"].toString()
      setSelectedFileName(
        acceptedFiles[0]['name'].toString().split('.')[0].replace(/\s+/g, ''),
      );
    }
    setLoading(true);
  }, []);

  return (
    <div style={{ minHeight: '300px' }}>
      {/* <input {...getInputProps()} /> */}
      {acceptedFiles.length === 0 ? (
        <div className="d-flex align-center justify-center pt-5">
          {loading ? 'Drag and drop files or a folder' : 'Loading...'}
        </div>
      ) : (
        <div className="border">
          <Row className="align-center justify-center m-0 border">
            <p className="mb-0 mr-3">Example :</p>
            {/* <input className="mb-0 showFileName form-control shadow-none" ref={exampleBox} onMouseUp={selectExampleString} value={fileName} defaultValue={fileName} /> */}
            <div
              className="showFileName shadow-none mb-0 pb-0 d-flex"
              ref={exampleBox}
              onMouseUp={() => selectExampleString()}
              style={{ height: 'auto !important' }}
            >
              {selectedFileName.split('').map((item, index) => {
                return (
                  <tt key={index}>
                    <strong>
                      <p
                        id={'filename' + index.toString()}
                        className="mb-0 font-bolder font-20"
                        key={index}
                      >
                        {item}
                      </p>
                    </strong>
                  </tt>
                );
              })}
            </div>
            <select
              className="border-none ml-1 mb-0 showOnlyDropDownBtn"
              value={selectedFileName}
              onChange={(event) => updateNativeSelect(event)}
              style={{ border: 'none' }}
            >
              {contents.map((c, index) => {
                return (
                  <option key={index} value={c.filename}>
                    {c.filename}
                  </option>
                );
              })}
            </select>
          </Row>
          <Row className="align-center justify-center name-type-input m-0 border">
            {namePatterns.map((pattern, idx) => {
              return (
                <div key={idx} className="pattern-section border">
                  <Button
                    className="pattern-item-button"
                    variant="contained"
                    onClick={() => {
                      clickNamePattern(idx);
                    }}
                    style={{
                      backgroundColor: pattern.color,
                      borderRadius: '8px',
                    }}
                  >
                    {pattern.label}
                  </Button>
                  <TextField
                    id={pattern.label}
                    value={pattern.text}
                    onChange={(e) => onChangePattern(e, idx)}
                    size="small"
                    variant="standard"
                    className="pattern-item-button"
                  />
                </div>
              );
            })}
          </Row>
          <Container className="pl-1 pr-1 border">
            <div className="d-flex" style={{ height: '40px' }}>
              <Button
                size="medium"
                color="primary"
                variant="contained"
                depressed="true"
                onClick={() => updateNameType()}
                style={{ backgroundColor: '#1565c0' }}
              >
                Update
              </Button>
              <div className="spacer type-spacer"></div>
              <div className="spacer type-spacer"></div>
              <Button
                size="medium"
                color="primary"
                variant="contained"
                depressed="true"
                onClick={() => clearNameType()}
                style={{ backgroundColor: '#1565c0' }}
              >
                Clear
              </Button>
              <div className="spacer"></div>
              <SearchBar
                className="w-50 h-100"
                value={searched}
                onChange={(searchVal) => requestSearch(searchVal)}
                onCancelSearch={() => cancelSearch()}
              />
            </div>
            <div style={{ height: '380px', width: '100%' }}>
              <DataGrid
                style={{ margin: 'auto' }}
                rows={searchrows}
                columns={nameTypeTableHeaders}
                pageSize={pageSize}
                disableExtendRowFullWidth={false}
                onPageSizeChange={(newPageSize) => {
                  if (isNaN(newPageSize)) {
                    setPageSize(acceptedFiles.length);
                  } else {
                    setPageSize(newPageSize);
                  }
                }}
                rowsPerPageOptions={[2, 5, 10, 20, 25]}
                pagination
              />
            </div>
          </Container>
        </div>
      )}
    </div>
  );
};

const DropzoneGroup = () => {
  const [loading] = useState(false);
  const backgroundText = loading
    ? 'Loading...'
    : 'Drag and drop files or a folder';
  return (
    <div style={{ minHeight: '200px' }}>
      <div className="d-flex align-center justify-center pt-5">
        {backgroundText}
      </div>
    </div>
  );
};

const OpenPositionDialog = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(
    props.selectTab ? props.selectTab : 0,
  );
  const [cloudDialog, setCloudDialog] = useState(false);
  const [experimentDialog, setExperimentDialog] = useState(false);

  const [experiment_name] = useState('');
  const [fileNames] = useState([]);
  const [metaDatas] = useState([]);
  const [contents, setContents] = useState([]);
  const onTabChange = (_event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCloudDialog = () => {
    setCloudDialog(!cloudDialog);
  };

  const handleExperimentDialog = () => {
    setExperimentDialog(true);
  };

  // const setDialogStatus = (open) => {
  //   setExperimentDialog(open);
  // };

  // const handleexperiment_nameChange = (name) => {
  //   setexperiment_name(name);
  //   store.dispatch({ type: 'register_experiment_name', content: name });
  //   getExperimentData(name);
  //   setExperimentDialog(false);
  // };

  const handleCloseOpenDlg = () => {
    props.handleClose();
    acceptedFiles = [];
    for (let i = 0; i < namePatternsPrimary.length; i++) {
      namePatternsPrimary[i].text = '';
      namePatternsPrimary[i].start = 0;
      namePatternsPrimary[i].end = 0;
    }
  };
  // const getExperimentData = async (name) => {
  //   try {
  //     let response = await api_experiment.getExperimentData(name);
  //     let data = response.data;
  //     let columns,
  //       rows,
  //       object = '',
  //       filetype = '',
  //       PhysicalSizeZUnit = '',
  //       z_space = 0,
  //       channels = [],
  //       Zposition = 0,
  //       maxTimeLine = 0,
  //       vessel,
  //       planeX = [],
  //       planeY = [];
  //     if (data.success) {
  //       const new_metadata = [];
  //       let new_channels = [];
  //       data.metadata.map((item) => {
  //         new_metadata.push(item.metadata);
  //         new_channels = new_channels.concat(item.channels);
  //       });

  //       setFileNames(data.data);
  //       setMetaDatas(new_metadata);
  //       let comingData = new_metadata;
  //       for (let i = 0; i < new_channels.length; i++) {
  //         if (channels.length == 0) {
  //           if (new_channels[i].Name) {
  //             channels.push(new_channels[i].Name);
  //           } else {
  //             if (comingData[i]) channels.push(comingData[i].SizeC);
  //           }
  //         } else {
  //           if (new_channels[i].Name) {
  //             if (
  //               channels.findIndex(
  //                 (channel) => channel == new_channels[i].Name,
  //               ) == -1
  //             ) {
  //               channels.push(new_channels[i].Name);
  //             }
  //           } else {
  //             if (comingData[i]) {
  //               if (
  //                 channels.findIndex(
  //                   (channel) => channel == comingData[i].SizeC,
  //                 ) == -1
  //               ) {
  //                 channels.push(comingData[i].SizeC);
  //               }
  //             }
  //           }
  //         }
  //       }

  //       let filenames = data.data[0];
  //       filetype = filenames.split('.');
  //       z_space = new_metadata[0].PhysicalSizeZ;
  //       PhysicalSizeZUnit = new_metadata[0].PhysicalSizeZUnit;

  //       for (let i = 0; i < comingData.length; i++) {
  //         if (maxTimeLine < comingData[i].SizeT)
  //           maxTimeLine = comingData[i].SizeT;
  //         if (Zposition < comingData[i].SizeZ) Zposition = comingData[i].SizeZ;
  //       }
  //       const getVesselInfo = (rows, columns) => {
  //         if (rows == 1) {
  //           if (columns == 1) return 'Single';
  //           if (columns == 2) return 'Double';
  //           if (columns == 4) return 'Quater';
  //         } else if (rows == 2) {
  //           if (columns == 2) return '4 Well Plate';
  //           if (columns == 3) return '6 Well Plate';
  //         } else if (rows == 3 && columns == 4) return '12 Well Plate';
  //         else if (rows == 4 && columns == 6) return '24 Well Plate';
  //         else if (rows == 6 && columns == 8) return '48 Well Plate';
  //         else if (rows == 8 && columns == 12) return '96 Well Plate';
  //         else if (rows == 16 && columns == 24) return '384 Well Plate';
  //         return '';
  //       };

  //       let object_model = '',
  //         NA = 0,
  //         WD = 0;
  //       if (data.metadata[0].microscope != {}) {
  //         if (data.metadata[0].microscope.Model != undefined)
  //           object_model = data.metadata[0].microscope.Model;
  //         if (data.metadata[0].objective.length != 0) {
  //           if (data.metadata[0].objective[0].LensNA != undefined)
  //             NA = data.metadata[0].objective[0].LensNA;
  //           if (data.metadata[0].objective[0].WorkingDistance != undefined)
  //             WD = data.metadata[0].objective[0].WorkingDistance;
  //           if (NA != 0 || WD != 0)
  //             object = object_model + ' ' + ' NA' + NA + ' WD' + WD;
  //         }
  //       }
  //       if (data.metadata[0].plates == {}) {
  //         if (data.metadata[0].planes.length != 0) {
  //           await data.metadata.map((item) => {
  //             planeX.push(item.planes[0].PositionX);
  //             planeY.push(item.planes[0].PositionY);
  //           });
  //           let max_x = 0,
  //             max_y = 0,
  //             min_x = 999999999,
  //             min_y = 999999999;
  //           for (let i = 0; i <= planeX.length - 1; i++) {
  //             for (let j = i + 1; j <= planeX.length; j++) {
  //               if (Math.abs(planeX[i] - planeX[j]) < min_x)
  //                 min_x = Math.abs(planeX[i] - planeX[j]);
  //             }
  //           }
  //           for (let i = 0; i <= planeY.length - 1; i++) {
  //             for (let j = i + 1; j <= planeX.length; j++) {
  //               if (Math.abs(planeY[i] - planeY[j]) < min_y)
  //                 min_y = Math.abs(planeY[i] - planeY[j]);
  //             }
  //           }
  //           for (let i = 0; i <= planeX.length - 1; i++) {
  //             for (let j = i + 1; j <= planeX.length; j++) {
  //               if (Math.abs(planeX[i] - planeX[j]) > max_x)
  //                 max_x = Math.abs(planeX[i] - planeX[j]);
  //             }
  //           }
  //           for (let i = 0; i <= planeY.length - 1; i++) {
  //             for (let j = i + 1; j <= planeY.length; j++) {
  //               if (Math.abs(planeY[i] - planeY[j]) > max_y)
  //                 max_y = Math.abs(planeY[i] - planeY[j]);
  //             }
  //           }
  //           if (max_x == 0) rows = 1;
  //           if (max_y == 0) columns = 1;
  //           rows = parseInt(max_x / min_x) + 1;
  //           columns = parseInt(max_y / min_y) + 1;
  //           vessel = await getVesselInfo(rows, columns);
  //         }
  //       } else {
  //         rows = data.metadata[0].plates.Rows;
  //         columns = data.metadata[0].plates.Columns;
  //         vessel = await getVesselInfo(rows, columns);
  //       }

  //       const metainfo = {
  //         filetype: filetype[1],
  //         z_space: z_space,
  //         // vesselnum: vesselNum==0?'undefined': vesselNum,
  //         vessel: vessel,
  //         object: object == '' ? 'undefined' : object,
  //         channel: channels,
  //         zposition: Zposition,
  //         timeline: maxTimeLine,
  //         PhysicalSizeZUnit: PhysicalSizeZUnit,
  //       };
  //       store.dispatch({ type: 'setMetaInfo', content: metainfo });
  //     }
  //     // if (data.success) {
  //     //     setFileNames(data.data)
  //     //     setMetaDatas(data.metadata)
  //     //     let comingData = data.metadata;
  //     //     let channels = [];
  //     //     let maxcol = '0' , maxrow = '0', zposition = 0, maxTimeLine = 0, vesselNum = 0 , Vessel, object = '';

  //     //     for (let i = 0; i < comingData.length; i++) {

  //     //         if (channels.length == 0) {
  //     //             channels.push(comingData[i].SizeC)
  //     //         } else {
  //     //             if (channels.findIndex(channel => channel==comingData[i].SizeC)==-1){
  //     //                 channels.push(comingData[i].SizeC)
  //     //             }
  //     //         }

  //     //         if (maxTimeLine<(comingData[i].SizeT))
  //     //             maxTimeLine = comingData[i].SizeT;
  //     //         if (zposition < comingData[i].SizeZ )
  //     //             zposition = comingData[i].SizeZ
  //     //     }

  //     //     const metainfo = {
  //     //         filetype: filetype[1],
  //     //         vesselnum: vesselNum==0?'undefined': vesselNum,
  //     //         vessel: vessel,
  //     //         object: object==''?'undefined': object,
  //     //         channel: channels,
  //     //         zposition: zposition,
  //     //         timeline: maxTimeLine
  //     //     }

  //     //     store.dispatch({type: "setMetaInfo", content: metainfo});
  //     // data.metadata.map(item => {
  //     //     if (item.vessel) {

  //     //     }
  //     // })
  //     // } else {
  //     // }
  //   } catch (err) {
  //     throw err;
  //   }
  // };

  const handleSetSetting = async () => {
    if (contents !== [] && contents !== null && contents !== undefined) {
      await api_tiles.updateNameFile(JSON.parse(JSON.stringify(contents)));
      store.dispatch({
        type: 'content_addContent',
        content: JSON.parse(JSON.stringify(contents)),
      });
      props.handleClose();
      acceptedFiles = [];
    }
  };

  return (
    <>
      <Dialog
        open={true}
        onClose={handleCloseOpenDlg}
        maxWidth={'1110'}
        className="m-0"
        style={{ top: '0%', bottom: 'auto' }}
      >
        <div className="d-flex border-bottom">
          <DialogTitle>Position Select</DialogTitle>
          <button
            className="dialog-close-btn"
            color="primary"
            size="small"
            onClick={handleCloseOpenDlg}
          >
            &times;
          </button>
        </div>
        <DialogContent
          className="p-0"
          style={{ width: '1100px', display: 'flex', flexDirection: 'row' }}
        >
          <div style={{ width: '100%' }}>
            <Tabs
              className="border"
              variant="fullWidth"
              value={selectedTab}
              onChange={onTabChange}
              aria-label="scrollable auto tabs example"
            >
              <Tab
                className="common-tab-button font-16 primary--text"
                label="Images"
              />
              <Tab
                className="common-tab-button font-16 primary--text"
                label="Tiling"
              />
              <Tab
                className="common-tab-button font-16 primary--text"
                label="Metadata"
              />
              <Tab
                className="common-tab-button font-16 primary--text"
                label="Names &amp; Files"
              />
              <Tab
                className="common-tab-button font-16 primary--text"
                label="Groups"
              />
            </Tabs>
            {selectedTab === 0 && (
              <TabContainer>
                <div className="d-flex">
                  <Button
                    className="cloud-btn"
                    variant="contained"
                    onClick={handleExperimentDialog}
                    color="primary"
                    style={{
                      height: 'fit-content',
                      margin: '10px',
                      marginTop: '50px',
                    }}
                  >
                    Cloud
                  </Button>
                  <ImageDropzone
                    setLoading={(loading) => setIsLoading(loading)}
                    fileNames={fileNames}
                    metaDatas={metaDatas}
                    handleExperimentDialog={handleExperimentDialog}
                  />
                </div>
              </TabContainer>
            )}
            {selectedTab === 1 && (
              <TabContainer>
                <Tiling
                  folderName={
                    experiment_name.includes('experiement') ??
                    experiment_name.replace('experiement', 'upload')
                  }
                  fileNames={acceptedFiles.map((file) => file.name)}
                />
              </TabContainer>
            )}
            {selectedTab === 2 && (
              <TabContainer>
                <DropzoneMetaData />
              </TabContainer>
            )}
            {selectedTab === 3 && (
              <TabContainer>
                <DropzoneNamesFiles
                  setContents={(contents) => {
                    setContents(contents);
                  }}
                />
              </TabContainer>
            )}
            {selectedTab === 4 && (
              <TabContainer>
                <DropzoneGroup />
              </TabContainer>
            )}
          </div>
        </DialogContent>
        <DialogActions className="border">
          {selectedTab === 0 && (
            <div className="d-flex">
              {isLoading ? (
                <div
                  className="progress"
                  style={{ width: '400px', marginRight: '180px' }}
                >
                  <div className="progress-bar"></div>
                </div>
              ) : (
                <div style={{ width: '580px' }}></div>
              )}
              {cloudDialog && (
                <OpenCloudDialog handleClose={handleCloudDialog} />
              )}
            </div>
          )}
          {selectedTab === 3 && (
            <Button
              size="medium"
              color="primary"
              variant="contained"
              onClick={handleSetSetting}
            >
              Set
            </Button>
          )}
          <Button
            size="medium"
            color="primary"
            variant="contained"
            onClick={handleCloseOpenDlg}
          >
            Cancel
          </Button>
        </DialogActions>
        {/*
                    <OpenExperimentDialog
                        onOpen={experimentDialog}
                        cloudDialogClose = {props.cloudDialogClose}
                        setCloudDialog={props.setCloudDialog}
                        setDialogStatus={setDialogStatus}
                        handleexperiment_nameChange={handleexperiment_nameChange}
                    />
                */}
        {experimentDialog && <OpenCloudUploadNew />}
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => ({
  files: state.files.file,
  filesChosen: state.vessel.selectedVesselHole,
});

OpenPositionDialog.propTypes = { handleClose: PropTypes.func.isRequired };
export default connect(mapStateToProps)(OpenPositionDialog);
