import React, { useState, useEffect, useRef } from 'react';
import {connect} from 'react-redux';
import store from "../../../../reducers";
// import { useDropzone } from 'react-dropzone'
// import { borderBottom } from '@mui/system';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardActions from '@mui/material/CardActions';
import ProgressBar from "@ramonak/react-progress-bar";
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Dropzone, FileItem } from "@dropzone-ui/react";
import { Row, Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
// import DataGrid from 'react-data-grid';
import SearchBar from "material-ui-search-bar";
import TextField from '@mui/material/TextField';

import * as api from "../../../../api/tiles";
import OpenCloudDialog from "./OpenCloudDialog";
import Tiling from "./Tiling";

var acceptedFiles = [
    // { id: 1, errors: [], file:{name: "LiveDead2_Plate_R_p00_0_H12f03d1.TIF"}, valid: true },
    // { id: 2, errors: [], file:{name: "LiveDead2_Plate_R_p00_0_H12f03d0.TIF"}, valid: true },
    // { id: 3, errors: [], file:{name: "LiveDead2_Plate_R_p00_0_H12f02d1.TIF"}, valid: true },
    // { id: 4, errors: [], file:{name: "LiveDead2_Plate_R_p00_0_H12f02d0.TIF"}, valid: true },
]

// const rows1 = [{ "id": 1, "filename": "0.jpg", "series": "", "frame": "", "c": "", "size_c": "", "size_t": "", "size_x": "", "size_y": "", "size_z": "" },
// { "id": 2, "filename": "0.jpg", "series": "", "frame": "", "c": "", "size_c": "", "size_t": "", "size_x": "", "size_y": "", "size_z": "" },
// { "id": 3, "filename": "0input.png", "series": "", "frame": "", "c": "", "size_c": "", "size_t": "", "size_x": "", "size_y": "", "size_z": "" },
// { "id": 4, "filename": "1EDSR.png", "series": "", "frame": "", "c": "", "size_c": "", "size_t": "", "size_x": "", "size_y": "", "size_z": "" },
// { "id": 5, "filename": "2GANSR.png", "series": "", "frame": "", "c": "", "size_c": "", "size_t": "", "size_x": "", "size_y": "", "size_z": "" },
// { "id": 6, "filename": "3WDSR.png", "series": "", "frame": "", "c": "", "size_c": "", "size_t": "", "size_x": "", "size_y": "", "size_z": "" }];

const columns = [
    { headerName: 'No', field: 'id', sortable: false },
    { headerName: 'FileName', field: 'filename', sortable: false },
    { headerName: 'Series', field: 'series', sortable: false },
    { headerName: 'Frame', field: 'frame', sortable: false },
    { headerName: 'SizeC', field: 'size_c', sortable: false },
    { headerName: 'SizeT', field: 'size_t', sortable: false },
    { headerName: 'SizeX', field: 'size_x', sortable: false },
    { headerName: 'SizeY', field: 'size_y', sortable: false },
    { headerName: 'SizeZ', field: 'size_z', sortable: false }
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
    { headerName: "Time Point", field: "time" },
];

const namePatternsPrimary = [
    { label: "Series", text: "", start: 0, end: 17, color: "#4caf50" },
    { label: "Row", text: "", start: 24, end: 25, color: "#1976d2" },
    { label: "Column", text: "", start: 25, end: 27, color: "#ff5722" },
    { label: "Field", text: "", start: 27, end: 30, color: "#fb8c00" },
    { label: "Channel", text: "", start: 30, end: 32, color: "#9c27b0" },
    { label: "Z Position", text: "", start: 22, end: 23, color: "#607d8b" },
    { label: "Time Point", text: "", start: 18, end: 21, color: "#ff5252" }
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

const ImageDropzone = (props) => {

    const [files, setFiles] = useState([]);
    const updateFiles = async (incommingFiles) => {
        console.log(incommingFiles.length, "incommingFiles");
        for (let i = 0; i < incommingFiles.length; i++) {
            props.getLoadingProgress(i + 1);
            await api.uploadImageTiles([incommingFiles[i].file]);
        }
        if (incommingFiles.length === 0) {
            props.getLoadingMax(0);
            props.getLoadingProgress(0);
        }
        setFiles(incommingFiles);
        acceptedFiles = incommingFiles;
        if(acceptedFiles.length > 0){
            props.setFiles(acceptedFiles);
        }
    };

    const startDrop = (drop) => {
        props.getLoadingMax(drop.length);
        // console.log( drop , "onDrop : ", new Date().getTime());
    }
    // const updateFilesView = (changeView) => {
    //     console.log( changeView , "onChangeView : ", new Date().getTime());
    // }
    // const updateStart = (changeView) => {
    //     console.log( changeView , "updateStart : ", new Date().getTime());
    // }
    // const updateFinish = (changeView) => {
    //     console.log( changeView , "updateFinish : ", new Date().getTime());
    // }
    useEffect(() => {
        if (acceptedFiles !== null && acceptedFiles !== [] && acceptedFiles.length > 0) {
            // props.getLoadingProgress(0)
            // props.getLoadingMax(0);
            // setFiles(acceptedFiles);
        }
    }, []);

    return (
        // onChangeView={updateFilesView} onUploadStart={updateStart} onUploadFinish={updateFinish}
        <Dropzone onChange={(incommingFiles) => updateFiles(incommingFiles)} onDrop={startDrop} value={files}>
            {files.map((file, index) => (
                <FileItem key={index} {...file} k={file.id} info preview />
            ))}
        </Dropzone>
    );
}

const DropzoneMetaData = () => {

    // Pagination
    const [pageSize, setPageSize] = useState(5);
    // Table Rows
    const [contents, setContent] = useState([]);
    // Drag & Drop files
    const [files, setFiles] = useState(acceptedFiles);
    const [loading, setLoading] = useState(false);
    // Search
    const [searchrows, setRows] = useState([]);
    // console.log("contents=====>" + JSON.stringify(contents));
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
    // console.log("searchrows=====>" + JSON.stringify(searchrows));
    const backgroundText = loading ? "Loading..." : "Drag and drop files or a folder";
    const get_metadata = () => {
        let rows = [];
        for (let i = 0; i < acceptedFiles.length; i++) {
            let file_content = acceptedFiles[i].file;
            if (acceptedFiles[i].valid) {
                rows.push({
                    id: (i + 1).toString(),
                    // filename: acceptedFiles[i].name.toString(),
                    filename: file_content["name"].toString(),
                    series: '',
                    frame: '',
                    c: '',
                    size_c: '',
                    size_t: '',
                    size_x: '',
                    size_y: '',
                    size_z: ''
                });
            }
        }
        setContent(rows);
        setRows(rows);
        setLoading(true);
    }
    useEffect(() => {
        get_metadata();
    }, []);

    return (
        <div style={{ minHeight: "200px" }}>
            {/* <input {...getInputProps()} /> */}
            {files.length === 0 ?
                <div className="d-flex align-center justify-center pt-5">
                    {backgroundText}
                </div> :
                <Card>
                    <CardContent>
                        <SearchBar
                            value={searched}
                            onChange={(searchVal) => requestSearch(searchVal)}
                            onCancelSearch={() => cancelSearch()}
                        />
                    </CardContent>
                    <div className="" style={{ height: "400px", width: "100%", border: "2px solid gray" }}>
                        <DataGrid
                            className='cell--textCenter'
                            style={{ textAlign: "center", width: "100%" }}
                            {...searchrows}
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
    const exampleBox = useRef(null);
    // Drag & Drop files
    const [files, setFiles] = useState(acceptedFiles);

    const [allFilesLength, setAllFilesLength] = useState(acceptedFiles.length);

    const [loading, setLoading] = useState(false);
    // Pagination
    const [pageSize, setPageSize] = useState(5);
    // Table Rows
    const [contents, setContent] = useState([]);
    // Search
    const [searchrows, setRows] = useState([]);
    // Search Bar
    const [searched, setSearched] = useState("");

    const [fileName, setFileName] = useState("");

    const [selectionRange, setSelectionRange] = useState(null);

    const [namePatterns, setNamePatterns] = useState([]);

    //  Search Part
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
    // Select update each fields -> namepattern
    const selectExampleString = () => {
        if (typeof window.getSelection !== "undefined") {
            try {
                let sel = window.getSelection(), range = sel.getRangeAt(0);
                let selectionRect = range.getBoundingClientRect(), fullRect = exampleBox.current.getBoundingClientRect();
                let startOffset = (((selectionRect.left - fullRect.left) / selectionRect.width) * range.toString().length);
                startOffset = Math.round(startOffset);
                let selectionRangeValue = {
                    text: range.toString(),
                    startOffset: startOffset,
                    endOffset: startOffset + range.toString().length
                }
                setSelectionRange(selectionRangeValue);
                
            } catch (error) {
                console.log(error);
            }
        }
    }

    const getSelectionText = () => {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type !== "Control") {
            text = document.selection.createRange().text;
        }
        return text.replaceAll("\n", "");
    };

    const clickNamePattern = (index) => {
        let selectedText = getSelectionText();
        console.log(selectedText, index, selectionRange, "openposition dlg , clickNamePattern   getSelectionText");
        if (selectionRange !== null && selectedText !== "") {
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
                                document.getElementById("filename" + j.toString()).style.color = namePatternsPrimaryValue[index].color;
                            }
                        }
                    }
                    console.log(namePatternsPrimary, "openposition dlg , clickNamePattern   getSelectionText");
                    setNamePatterns(namePatternsPrimaryValue);
                }
            }
        }
    };
    // update button function
    const getNamePatternPerFile = (objectPerFile) => {
        for (let i = 0; i < namePatterns.length; i++) {
            var key = null;
            switch (i) {
                case 0:
                    key = "series";
                    break;
                case 1:
                    key = "row";
                    break;
                case 2:
                    key = "col";
                    break;
                case 3:
                    key = "field";
                    break;
                case 4:
                    key = "channel";
                    break;
                case 5:
                    key = "z";
                    break;
                case 6:
                    key = "time";
                    break;
            }
            if (key && objectPerFile !== null) {
                objectPerFile[key] = objectPerFile.filename.substring(namePatterns[i].start, namePatterns[i].end);
            }
        }
        return objectPerFile;
    }

    const getNamePatternPerFileForProcessing = (objectPerFile) => {
        for (let i = 0; i < namePatterns.length; i++) {
            var key = null;
            switch (i) {
                case 0:
                    key = "series";
                    break;
                case 1:
                    key = "row";
                    break;
                case 2:
                    key = "col";
                    break;
                case 3:
                    key = "field";
                    break;
                case 4:
                    key = "channel";
                    break;
                case 5:
                    key = "z";
                    break;
                case 6:
                    key = "time";
                    break;
            }
            if (key && objectPerFile !== null) {
                let tempString = objectPerFile.filename.substring(namePatterns[i].start, namePatterns[i].end);
                if(key === "series" || key === "filename"){
                    objectPerFile[key] = tempString;
                }
                else{
                    objectPerFile[key] = convertContentStringToInteger(key, tempString);
                }
                
            }
        }
        return objectPerFile;
    }

    const updateNameType = () => {
        let MAX_BATCH_SIZE = 10;
        if (!files) {
            console.log("allFiles error: " + files);
            return "";
        }
        // progressBarValue = 0;
        // progressBarMaxValue = files.length;
        // console.log("Contents: ", contents);

        let new_content = [];
        let new_content_processing = [];
        let old_content = [...contents];
        let old_content_p =JSON.parse(JSON.stringify(old_content));
        for (let i = 0; i < old_content.length; i++) {
            let each_namepattern = getNamePatternPerFile(old_content[i]);
            let each_namepattern_processing = getNamePatternPerFileForProcessing(old_content_p[i]);
            new_content.push(each_namepattern);
            new_content_processing.push(each_namepattern_processing);
        }
        old_content_p = [];
        old_content = [];
        console.log("New Contents: ", new_content);
        console.log("new Contents For Processing: ", new_content_processing);
        store.dispatch({
            type: "content_addContent", 
            content: new_content_processing
        })
        setContent(new_content);
        setRows(new_content);
    }

    // Convert string to integer of some fields: row, col, field, channel, z, time
    const convertContentStringToInteger = (field, stringData) =>{
        let newField = "";
        let intField = -1;
        if (field === "row"){
            intField = stringData.charCodeAt(0) - 65;
        }else{
            newField = stringData.replace(/\D/g,'');
            // console.log("OpenPositionDialog > convertContentStringToInteger, ", newField);
            intField = parseInt(newField, 10);
            // console.log("OpenPositionDialog > convertContentStringToInteger, ", intField);
        }
        // console.log("OpenPositionDialog > convertContentStringToInteger, intField", intField);
        return intField;
    }

    // clear button + change file name
    const reset_namePatterns = () => {
        let namePatternsPrimaryValue = [...namePatterns];
        for (let i = 0; i < namePatternsPrimaryValue.length; i++) {
            namePatternsPrimaryValue[i].text = "";
            namePatternsPrimaryValue[i].start = 0;
            namePatternsPrimaryValue[i].end = 0;
        }
        setNamePatterns(namePatternsPrimaryValue);
    }

    const clearNameType = () => {
        for (let k = 0; k < fileName.length; k++) {
            document.getElementById("filename" + k.toString()).style.color = "#000";
        }
        reset_namePatterns();
    }

    const updateNativeSelect = (event) => {
        setFileName(event.target.value.toString().split(".")[0]);
        reset_namePatterns();
    }
    // initial setup -> namepattern
    const get_nametype = () => {
        let rows = [];
        if (acceptedFiles.length > 0) {
            for (let i = 0; i < acceptedFiles.length; i++) {
                let file_content = acceptedFiles[i].file;
                if (acceptedFiles[i].valid) {
                    rows.push({
                        id: (i + 1).toString(),
                        // filename: acceptedFiles[i].name.toString(),
                        filename: file_content["name"].toString(),
                        series: '',
                        row: '',
                        col: '',
                        field: '',
                        channel: '',
                        z: '',
                        time: '',
                        hole: -1
                    });
                }
            }
            setFileName(rows[0].filename.split(".")[0]);
            setContent(rows);
            setRows(rows);
        }
        setLoading(true);
    }

    useEffect(() => {
        console.log("FILES NAMES: ", acceptedFiles);
        setAllFilesLength(acceptedFiles.length);
        setNamePatterns(namePatternsPrimary);
        get_nametype();
    }, []);

    return (
        <div style={{ minHeight: "300px" }}>
            {/* <input {...getInputProps()} /> */}
            {files.length === 0 ?
                <div className="d-flex align-center justify-center pt-5">
                    {loading ? "Drag and drop files or a folder" : "Loading..."}
                </div> :
                <div className='border'>
                    <Row className="align-center justify-center m-0 border">
                        <p className="mb-0 mr-3">Example :</p>
                        {/* <input className='mb-0 showFileName form-control shadow-none' ref={exampleBox} onMouseUp={selectExampleString} value={fileName} defaultValue={fileName} /> */}
                        <div className='showFileName shadow-none mb-0 pb-0 d-flex mr-1' ref={exampleBox} onMouseUp={() => selectExampleString()} style={{ height: "auto !important" }}>
                            {fileName.split("").map((item, index) => {
                                return <tt key={index}><strong><p id={"filename" + index.toString()} className="mb-0 font-bolder font-20" key={index}>{item}</p></strong></tt>
                            })}
                        </div>
                        <select className="border-none ml-1 mb-0 showOnlyDropDownBtn" value={fileName} onChange={(event) => updateNativeSelect(event)} style={{ border: "none" }}>
                            {contents.map((c) => {
                                return (
                                    <option key={c.filename} value={c.filename}>
                                        {c.filename}
                                    </option >)
                            })}
                        </select>
                    </Row>
                    <Row className="align-center justify-center name-type-input m-0 border">
                        {namePatterns.map((pattern, idx) => {
                            return (<div key={idx} className="pattern-section border">
                                <Button className="pattern-item-button"
                                    variant="contained"
                                    onClick={() => { clickNamePattern(idx) }}
                                    style={{ backgroundColor: pattern.color, borderRadius: "8px" }}
                                >{pattern.label}</Button>
                                <TextField
                                    id={pattern.label}
                                    value={pattern.text}
                                    size="small"
                                    variant="standard"
                                    className="pattern-item-button"
                                />
                            </div>)
                        })}
                    </Row>
                    <Container className='pl-1 pr-1 border'>
                        <div className="d-flex" style={{ height: "40px" }}>
                            <Button size="medium" color="primary" variant="contained" depressed="true" onClick={() => updateNameType()} style={{ backgroundColor: "#1565c0" }}>Update</Button>
                            <div className="spacer type-spacer"></div>
                            <div className="spacer type-spacer"></div>
                            <Button size="medium" color="primary" variant="contained" depressed="true" onClick={() => clearNameType()} style={{ backgroundColor: "#1565c0" }}>Clear</Button>
                            <div className="spacer"></div>
                            <SearchBar
                                className='w-50 h-100'
                                value={searched}
                                onChange={(searchVal) => requestSearch(searchVal)}
                                onCancelSearch={() => cancelSearch()}
                            />
                        </div>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                style={{ margin: "auto" }}
                                rows={searchrows}
                                columns={nameTypeTableHeaders}
                                pageSize={pageSize}
                                disableExtendRowFullWidth={false}
                                onPageSizeChange={(newPageSize) => { 
                                    console.log("OnPageSizeChange: newPageSize", newPageSize, allFilesLength);
                                    if(isNaN(newPageSize)){
                                        setPageSize(allFilesLength);
                                    }else{
                                    setPageSize(newPageSize); 
                                    }
                                }}
                                rowsPerPageOptions={[5, 10, 20, "All"]}
                                pagination
                            />
                        </div>
                    </Container>
                </div>
            }
        </div>
    )
}

const DropzoneGroup = () => {

    const [loading, setLoading] = useState(false);
    const backgroundText = loading ? "Loading..." : "Drag and drop files or a folder";
    return (
        <div style={{ minHeight: "200px" }}>
            <div className="d-flex align-center justify-center pt-5">
                {backgroundText}
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    files: state.files.files,
    filesChosen: state.files.filesChosen,
})

const OpenPositionDialog = (props) => {

    const [selectedTab, setSelectedTab] = useState(0);
    const [cloudDialog, setCloudDialog] = useState(false);

    const [progressBarMaxValue, setProgressBarMaxValue] = useState(0);
    const [progressBarValue, setProgressBarValue] = useState(0);
    const [filesUploaded, setFilesUploaded] = useState([]);

    useEffect(() => {
        console.log("Files Uploaded,", filesUploaded);
        if(filesUploaded.length > 0){
            props.handleFilesUploaded(filesUploaded);
            console.log("Files Uploaded2 ,", filesUploaded);
            store.dispatch({
                type: "files_addFiles", data: filesUploaded
            })
        }
    },[filesUploaded])

    const onTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleCloudDialog = () => {
        setCloudDialog(!cloudDialog);
    }

    const handleCloseOpenDlg = () => {
        props.handleClose();
        resetPositionDlg();
    }

    const resetPositionDlg = () => {
        acceptedFiles = [];
        setProgressBarMaxValue(0);
        setProgressBarValue(0);
    }

    useEffect(() => {
        // resetPositionDlg();
    }, [])

    return (
        <>
            <Dialog open={true} onClose={handleCloseOpenDlg} maxWidth={"1010"} className="m-0" style={{ top: "5%", bottom: "auto" }}>
                <div className="d-flex border-bottom">
                    <DialogTitle>Position Select</DialogTitle>
                    <button className="dialog-close-btn" color="primary" size="small" onClick={handleCloseOpenDlg}>&times;</button>
                </div>
                <DialogContent className='p-0' style={{ width: "1000px" }}>
                    <Tabs className="border" variant="fullWidth" value={selectedTab} onChange={onTabChange} aria-label="scrollable auto tabs example" >
                        <Tab className="common-tab-button font-16 primary--text" label="Images" />
                        <Tab className="common-tab-button font-16 primary--text" label="Tiling" />
                        <Tab className="common-tab-button font-16 primary--text" label="Metadata" />
                        <Tab className="common-tab-button font-16 primary--text" label="Names &amp; Files" />
                        <Tab className="common-tab-button font-16 primary--text" label="Groups" />
                    </Tabs>
                    {selectedTab === 0 &&
                        <TabContainer>
                            <ImageDropzone setFiles={(filesUploaded) => {setFilesUploaded(filesUploaded)}} getLoadingMax={(max) => { setProgressBarMaxValue(max) }} getLoadingProgress={(current) => { setProgressBarValue(current) }} />
                        </TabContainer>}
                    {selectedTab === 1 &&
                        <TabContainer>
                            <Tiling files={filesUploaded} set-progress-max={(max) => setProgressBarMaxValue(max)} set-progress-current={(current) => setProgressBarValue(current)} />
                        </TabContainer>
                    }
                    {selectedTab === 2 &&
                        <TabContainer>
                            <DropzoneMetaData />
                        </TabContainer>
                    }
                    {selectedTab === 3 &&
                        <TabContainer>
                            <DropzoneNamesFiles />
                        </TabContainer>
                    }
                    {selectedTab === 4 &&
                        <TabContainer>
                            <DropzoneGroup />
                        </TabContainer>
                    }
                </DialogContent>
                <DialogActions style={{ display: "-webkit-box !important" }} className="border">
                    {
                        selectedTab === 0 ? <div className='d-flex'>
                            <Button className="cloud-btn" variant="contained" onClick={handleCloudDialog} color="primary" style={{ marginRight: "150px", marginLeft: "0px" }}>Cloud</Button>
                            {
                                progressBarMaxValue === 0 || progressBarMaxValue === "0" ? <div style={{ width: "400px" }}></div> : <ProgressBar
                                    className="m-auto"
                                    bgColor="rgb(18 105 191)"
                                    width="400px"
                                    completed={progressBarValue.toString()}
                                    maxCompleted={progressBarMaxValue.toString()}
                                />
                            }
                            <Button style={{ marginLeft: "180px" }} size="medium" color="primary" variant="contained" onClick={handleCloseOpenDlg}>Cancel</Button>
                            {cloudDialog && <OpenCloudDialog handleClose={handleCloudDialog} />}
                        </div> : <Button size="medium" color="primary" variant="contained" onClick={handleCloseOpenDlg}>Cancel</Button>
                    }
                </DialogActions>
            </Dialog>
        </>
    );
}

OpenPositionDialog.propTypes = { handleClose: PropTypes.func.isRequired };
export default connect(mapStateToProps)(OpenPositionDialog);