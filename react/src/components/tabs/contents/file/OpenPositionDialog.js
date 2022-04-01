import React, {useState, useCallback} from 'react';
import {useDropzone} from 'react-dropzone'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Dropzone, FileItem } from "@dropzone-ui/react";
import { Row, Col, Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import SearchBar from "material-ui-search-bar";
import NativeSelect from '@mui/material/NativeSelect';
import TextField from '@mui/material/TextField';

import OpenCloudDialog from "./OpenCloudDialog";
import Tiling from "./Tiling";

const rows1 = [{"id":1,"filename":"0.jpg","series":"","frame":"","c":"","size_c":"","size_t":"","size_x":"","size_y":"","size_z":""},{"id":2,"filename":"0.jpg","series":"","frame":"","c":"","size_c":"","size_t":"","size_x":"","size_y":"","size_z":""},{"id":3,"filename":"0input.png","series":"","frame":"","c":"","size_c":"","size_t":"","size_x":"","size_y":"","size_z":""},{"id":4,"filename":"1EDSR.png","series":"","frame":"","c":"","size_c":"","size_t":"","size_x":"","size_y":"","size_z":""},{"id":5,"filename":"2GANSR.png","series":"","frame":"","c":"","size_c":"","size_t":"","size_x":"","size_y":"","size_z":""},{"id":6,"filename":"3WDSR.png","series":"","frame":"","c":"","size_c":"","size_t":"","size_x":"","size_y":"","size_z":""}]

const columns = [
  { headerName: 'No', field: 'id', sortable: false },
  { headerName: 'FileName', field: 'filename', sortable: false },
  { headerName: 'Series', field: 'series', sortable: false },
  { headerName: 'Frame', field: 'frame', sortable: false },
  { headerName: 'C', field: 'c', sortable: false },
  { headerName: 'SizeC', field: 'size_c', sortable: false },
  { headerName: 'SizeT', field: 'size_t', sortable: false },
  { headerName: 'SizeX', field: 'size_x', sortable: false },
  { headerName: 'SizeY', field: 'size_y', sortable: false },
  { headerName: 'SizeZ', field: 'size_z', sortable: false }
];

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 0 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

// const ImageDropzone = () => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const onDrop = useCallback(acceptedFiles => {
//     console.log(acceptedFiles);
//     setLoading(true);
//     setFiles(acceptedFiles)
//   }, [])
//   const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
//   const backgroundText = loading ? "Loading..." : "Drag and drop files or a folder";
//   return (
//     <div {...getRootProps()}>
//       {/* <input {...getInputProps()} /> */}
//       {files.length === 0 ? 
//         <div className="d-flex align-center justify-center fill-height">
//           <p className="text-h4 grey--text text--lighten-2">
//             {backgroundText}
//           </p>
//         </div>:
//         <div>
//             <Row className="align-center">
//             {files.map((file, idx) =>              
//               <Col
//                 key={idx}
//                 cols="2"
//                 className="px-4"
//               >
//                 {file.thumbnailData && <img
//                   id={'images_' + idx}
//                   src={file.thumbnailData}
//                   className="mx-auto"
//                   style={{width:120}}
//                 />}
//                 <p className="ma-2 text-center text-caption">
//                   {file.name }
//                 </p>
//                 <FileItem {...file} preview />
//               </Col>
//               )}
//             </Row>          
//         </div>
//       }
//     </div>
//   )
// }
const ImageDropzone = () => {
  const [files, setFiles] = useState([]);
  const updateFiles = (incommingFiles) => {
    setFiles(incommingFiles);
  };
  return (
    <Dropzone onChange={updateFiles} value={files}>
      {files.map((file) => (
        <FileItem {...file} info preview />
      ))}
    </Dropzone>
  );
}

const DropzoneMetaData = () => {
  
  // Pagination
  const [pageSize, setPageSize] = React.useState(5);
  // Table Rows
  const [contents, setContent] = useState([]);
  const rows = [];
  // Drag & Drop files
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  // Search
  const [searchrows, setRows] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setLoading(true);
    setFiles(acceptedFiles);

    acceptedFiles.forEach(file => {
      rows.push({
        id: rows.length + 1,
        filename: file.name,
        series: '',
        frame: '',
        c: '',
        size_c: '',
        size_t: '',
        size_x: '',
        size_y: '',
        size_z: ''
      });
    });
    setContent(rows);
    setRows(rows);
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  const backgroundText = loading ? "Loading..." : "Drag and drop files or a folder";
  console.log("contents=====>"+JSON.stringify(contents));
  // Search Bar
  const [searched, setSearched] = useState("");
  const requestSearch = (searchedVal) => {
    const filteredRows = contents.filter((content) => {
      return content.filename.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };
  console.log("searchrows=====>"+JSON.stringify(searchrows));

  return (
    <div {...getRootProps()}>
      {/* <input {...getInputProps()} /> */}
      {files.length === 0 ? 
        <div className="d-flex align-center justify-center fill-height">
          <p className="text-h4 grey--text text--lighten-2">
            {backgroundText}
          </p>
        </div>:
        <Card>
          <CardContent>
            <SearchBar
              value={searched}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
          </CardContent> 
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={searchrows}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
            />
          </div> 
        </Card>
      }
    </div>
  )
}

const DropzoneNamesFiles = () => {
  // Names & Files Tab
  // curNameIdx: -1,
  // searchNameType: "",
  // selectedNameContents: [],
  // selectedFileName: "",
  const selectionRange = {
    text: "",
    startOffset: -1,
    endOffset: -1
  };
  const namePatterns = [
    { label: "Series", text: "", start: 0, end: 17, color: "#4caf50" },
    { label: "Row", text: "", start: 24, end: 25, color: "#1976d2" },
    { label: "Column", text: "", start: 25, end: 27, color: "#ff5722" },
    { label: "Field", text: "", start: 27, end: 30, color: "#fb8c00" },
    { label: "Channel", text: "", start: 30, end: 32, color: "#9c27b0" },
    { label: "Z Position", text: "", start: 22, end: 23, color: "#607d8b" },
    { label: "Time Point", text: "", start: 18, end: 21, color: "#ff5252" }
  ];
  const nameTypeTableHeaders = [
    { headerName: "No", field: "id" },
    { headerName: "FileName", field: "filename" },
    { headerName: "Series", field: "series" },
    { headerName: "Row", field: "row" },
    { headerName: "Column", field: "col" },
    { headerName: "Field", field: "field" },
    { headerName: "Channel", field: "channel" },
    { headerName: "Z Position", field: "z" },
    { headerName: "Time Point", field: "timeline" }
  ];
  // Pagination
  const [pageSize, setPageSize] = React.useState(5);
  // Table Rows
  const [contents, setContent] = useState([]);
  const rows = [];
  // Drag & Drop files
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  // Search
  const [searchrows, setRows] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setLoading(true);
    setFiles(acceptedFiles);

    acceptedFiles.forEach(file => {
      rows.push({
        id: rows.length + 1,
        filename: file.name,
        series: '',
        frame: '',
        c: '',
        size_c: '',
        size_t: '',
        size_x: '',
        size_y: '',
        size_z: ''
      });
    });
    setContent(rows);
    setRows(rows);
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  const backgroundText = loading ? "Loading..." : "Drag and drop files or a folder";

  // Search Bar
  const [searched, setSearched] = useState("");
  const requestSearch = (searchedVal) => {
    const filteredRows = contents.filter((content) => {
      return content.filename.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  // Select example string in names&types tab
  // const selectExampleString = () => {
  //   if (typeof window.getSelection !== "undefined") {
  //     try {
  //       let sel = window.getSelection(),
  //         range = sel.getRangeAt(0);
  //       let selectionRect = range.getBoundingClientRect(),
  //         fullRect = $refs.exampleBox.getBoundingClientRect();

  //       selectionRange.text = range.toString();

  //       selectionRange.startOffset = Math.round(
  //         ((selectionRect.left - fullRect.left) / selectionRect.width) *
  //           range.toString().length
  //       );
  //       selectionRange.endOffset =
  //         selectionRange.startOffset + range.toString().length;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  const [fileName, setFileName] = React.useState(contents[0]);
  
  const clickNamePattern = (index) => {
    const { text, startOffset, endOffset } = selectionRange;
    let selectedText = getSelectionText();
    if (text !== "" && selectedText !== "") {
      if (text === selectedText) {
        if (startOffset > -1 && endOffset > -1) {
          document
            .getElementById(text)
            .classList.add(namePatterns[index].color + "--text");
          // const patterns = this.namePatterns.filter(n => n.start > -1);
          // for (var i = 0; i < patterns.length; i++) {
          //   // if (
          //   //   isOverlapped(
          //   //     [patterns[i].start, patterns[i].end],
          //   //     [startOffset, endOffset]
          //   //   )
          //   // ) {
          //   //   break;
          //   // }
          //   console.log(patterns.length);
          //   if (i === patterns.length) {
          namePatterns[index].text = text;
          // this.namePatterns[index].start = startOffset;
          // this.namePatterns[index].end = endOffset;
          // }
          // }
        }
      }
    }
  };
  const getSelectionText = () => {
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
      text = document.selection.createRange().text;
    }
    return text.replaceAll("\n", "");
  };
  return (
    <div {...getRootProps()}>
      {/* <input {...getInputProps()} /> */}
      {files.length === 0 ? 
        <div className="d-flex align-center justify-center fill-height">
          <p className="text-h4 grey--text text--lighten-2">
            {backgroundText}
          </p>
        </div>:
        <div>
          <Row className="justify-center mx-5">
            <div
              className="d-flex align-center justify-center"
              // style={{width: calc(100% - '70px')}}
            >
              <Row className="align-center justify-center">
                <p className="mb-0 mr-8">Example</p>
                {/* <div
                  ref={exampleBox}
                  className="d-flex example-string"
                  onMouseUp={selectExampleString}
                  // v-html="exampleFileName"
                ></div> */}
                <NativeSelect value={fileName} onChange={setFileName} className="filenames-list">
                  {contents.map((c) => (
                    <option  key={c.filename} value={c}>
                      {c.filename}
                    </option >
                  ))}
                </NativeSelect>
              </Row>
            </div>
          </Row>
          <Row className="align-center justify-center name-type-input">
            {namePatterns.map((pattern, idx) => (
              <div key={idx} className="pattern-section">
                <Button className="pattern-item-button" 
                  variant="contained" 
                  // color="#ffffff"
                  
                  // size="small"
                  onClick={clickNamePattern(idx)}
                  style={{backgroundColor: pattern.color, borderRadius:"8px"}}
                >
                  { pattern.label }
                </Button>
                <TextField
                  value={namePatterns[idx].text}
                  size="small"
                  variant="standard"
                  className="pattern-item-button"
                  // label="Row"
                />
              </div>
            ))}
          </Row>
          <Container>
            <div className="d-flex">
              <Button
                className="common"
                // disabled={!canUpdate}
                depressed="true"
                style={{backgroundColor:"#1976d2", borderRadius:"8px"}}
                // onClick={updateNameType}
              >
                Update
              </Button>
              <div className="spacer type-spacer"></div>
              <Button
                className="common"
                // disabled={!canClear}
                depressed="true"
                style={{backgroundColor:"#1976d2", borderRadius:"8px"}}
                // onClick={clearNameType}
              >
                Clear
              </Button>
              <div className="spacer"></div>
              <SearchBar
                value={searched}
                onChange={(searchVal) => requestSearch(searchVal)}
                onCancelSearch={() => cancelSearch()}
              />
            </div> 
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={searchrows}
                columns={nameTypeTableHeaders}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 20]}
                pagination
              />
            </div> 
          </Container>
        </div>
      }
    </div>
  )
}

const OpenPositionDialog = (props) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [cloudDialog, setCloudDialog] = useState(false);
  const [progressBarMaxValue, setProgressBarMaxValue] = useState(0);
  const [progressBarValue, setProgressBarValue] = useState(0);
  const onTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const showCloudDialog = () => {setCloudDialog(true);}
  const handleCloseDialog = () => {setCloudDialog(false);}
  const handleDrag = (e) => {
    e.preventDefault();
    console.log("e.dataTransfer.items");
  };
  const setProgressMax = (maxValue) => {
    console.log("in setProgressMax: " + maxValue);
    setProgressBarMaxValue(maxValue);
  };
  const setProgressCurrent = (currValue) => {
    setProgressBarValue(currValue);
  };
  return (
    <>
      <div className="d-none">
        <Dialog maxWidth='lg' fullWidth={true} open={true} onClose={props.handleClose}>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent>
            <Tabs variant="fullWidth" 
                value={selectedTab} onChange={onTabChange} 
                aria-label="scrollable auto tabs example"
            >
                <Tab className="primary--text" label="Images"/>
                <Tab className="primary--text" label="Tiling"/>
                <Tab className="primary--text" label="Metadata"/>
                <Tab className="primary--text" label="Names &amp; Files"/>
            </Tabs>            
            {selectedTab === 0 && 
              <TabContainer>
                <Button
                  className="cloud-btn mt-15 ml-5 ma-2"
                  variant="contained"
                  onClick={showCloudDialog}
                  color="primary"
                >
                  Cloud
                </Button>
                {cloudDialog && <OpenCloudDialog handleClose={handleCloseDialog}/>}
                <ImageDropzone/>
              </TabContainer>}
            { selectedTab === 1 && 
              <TabContainer>
                <Tiling
                  set-progress-max={setProgressMax}
                  set-progress-current={setProgressCurrent}
                />
              </TabContainer>
            }
            { selectedTab === 2 && 
              <TabContainer>
                <DropzoneMetaData/>
              </TabContainer>
            }
            { selectedTab === 3 && 
              <TabContainer>
                <DropzoneNamesFiles/>
              </TabContainer>
            }
          </DialogContent>
          <Button size="small" onClick={props.handleClose}>Cancel</Button>
          <DialogActions>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
OpenPositionDialog.propTypes = {
  handleClose: PropTypes.func.isRequired
};
export default OpenPositionDialog;