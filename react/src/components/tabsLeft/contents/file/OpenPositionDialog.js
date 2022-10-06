import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import store from "../../../../reducers";
// import { useDropzone } from "react-dropzone"
// import { borderBottom } from "@mui/system";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import {Dropzone, FileItem} from "@dropzone-ui/react";
import {Row, Container} from "react-bootstrap";
import {DataGrid} from "@mui/x-data-grid";
// import DataGrid from "react-data-grid";
import SearchBar from "material-ui-search-bar";
import TextField from "@mui/material/TextField";
// import { updateNameFile, uploadImageFiles } from "../../../../api/tiles";
import * as api_tiles from "../../../../api/tiles";
import OpenCloudDialog from "./OpenCloudDialog";
import Tiling from "./Tiling";

var acceptedFiles = [];

const columns = [
    {headerName: "No", field: "id", sortable: false},
    {headerName: "FileName", field: "filename", sortable: false},
    {headerName: "Series", field: "series", sortable: false},
    {headerName: "Frame", field: "frame", sortable: false},
    {headerName: "SizeC", field: "size_c", sortable: false},
    {headerName: "SizeT", field: "size_t", sortable: false},
    {headerName: "SizeX", field: "size_x", sortable: false},
    {headerName: "SizeY", field: "size_y", sortable: false},
    {headerName: "SizeZ", field: "size_z", sortable: false},
];

const namePatternOrders = ["id", "filename", "series", "time", "z", "row", "col", "field", "channel"];

const nameTypeTableHeaders = [
    {headerName: "No", field: "id"},
    {headerName: "FileName", field: "filename"},
    {headerName: "Series", field: "series"},
    {headerName: "Row", field: "row"},
    {headerName: "Column", field: "col"},
    {headerName: "Field", field: "field"},
    {headerName: "Channel", field: "channel"},
    {headerName: "Z Position", field: "z"},
    {headerName: "Time Point", field: "time"},
];

const namePatternsPrimary = [
    {label: "Series", text: "", start: 0, end: 17, color: "#4caf50", field: "series"},
    {label: "Row", text: "", start: 24, end: 25, color: "#1976d2", field: "row"},
    {label: "Column", text: "", start: 25, end: 27, color: "#ff5722", field: "col"},
    {label: "Field", text: "", start: 27, end: 30, color: "#fb8c00", field: "field"},
    {label: "Channel", text: "", start: 30, end: 32, color: "#9c27b0", field: "channel"},
    {label: "Z Position", text: "", start: 22, end: 23, color: "#607d8b", field: "z"},
    {label: "Time Point", text: "", start: 18, end: 21, color: "#ff5252", field: "time"},
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
        <Typography component="div" style={{padding: 0}}>
            {props.children}
        </Typography>
    );
};

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const ImageDropzone = (props) => {

    const [files, setFiles] = useState(acceptedFiles);

    const updateFiles = async (incommingFiles) => {
        props.setLoading(true);
        let files = [];
        let newAcceptedFiles = [];
        for (let i = 0; i < incommingFiles.length; i++) {
            if (!files.includes(incommingFiles[i])) {
                files.push(incommingFiles[i]);
            }
            if (!acceptedFiles.includes(incommingFiles[i].file)) {
                incommingFiles[i].file["path"] = incommingFiles[i].file.name.replace(/\s+/g, "");
                newAcceptedFiles.push(incommingFiles[i].file);
            }
        }
        if (newAcceptedFiles.length > 0) {
            let resUpload = await api_tiles.uploadImageFiles(newAcceptedFiles);
            acceptedFiles = acceptedFiles.concat(newAcceptedFiles);
            if (resUpload.data !== null && resUpload.data !== undefined) {
                store.dispatch({type: "files_addFiles", content: acceptedFiles});
            } else {
                console.log(" OpenPositionDialog.js updateFiles : Get error in uploading image files");
            }
            setFiles(files);
        }
        props.setLoading(false);
    };

    const startDrop = (drop) => {
        store.dispatch({type: "files_removeAllFiles", content: []});
        setFiles([]);
        acceptedFiles = [];
    };

    return (
        <Dropzone
            onChange={(incommingFiles) => updateFiles(incommingFiles)}
            onReset={() => {setFiles([])}}
            onDrop={() => {startDrop()}}
            value={files}>
            {files.map((file, index) => (
                <FileItem key={index} {...file} k={file.name} info preview />
            ))}
        </Dropzone>
    );
};

const DropzoneMetaData = (props) => {
    // Pagination
    const [pageSize, setPageSize] = useState(1);
    // Table Rows
    const [loading, setLoading] = useState(false);
    // Search
    const [searchrows, setSearchRows] = useState([]);
    // Search Bar
    const [searched, setSearched] = useState("");
    const requestSearch = (searchedVal) => {
        // const filteredRows = contents.filter((content) => {
        //     return content.filename.toLowerCase().includes(searchedVal.toLowerCase());
        // });
        // setRows(filteredRows);
    };
    const cancelSearch = () => {
        setSearched("");
        requestSearch(searched);
    };
    const backgroundText = loading ? "Loading..." : "Drag and drop files or a folder";

    useEffect(() => {
        if (acceptedFiles) {
            for (let i = 0; i < acceptedFiles.length; i++) {
                if (acceptedFiles[i]) {
                    // filename: acceptedFiles[i].file["name"].toString()   acceptedFiles[i].file.name.toString()
                    let current_file = {id: (i + 1).toString(), filename: acceptedFiles[i]["name"].toString(), series: "", frame: "", c: "", size_c: "", size_t: "", size_x: "", size_y: "", size_z: "", };
                    setSearchRows(rows => [...rows, current_file]);
                }
            }
            setLoading(true);
        }
    }, []);

    return (
        <div style={{minHeight: "200px"}}>
            {/* <input {...getInputProps()} /> */}
            {acceptedFiles.length === 0 ? (
                <div className="d-flex align-center justify-center pt-5">
                    {backgroundText}
                </div>
            ) : (
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
                        style={{
                            height: "380px",
                            width: "100%",
                            border: "2px solid gray",
                        }}>
                        <DataGrid
                            className="cell--textCenter"
                            style={{textAlign: "center", width: "100%"}}
                            rows={searchrows}
                            columns={columns}
                            pageSize={pageSize}
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
                </Card>
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
    const [searched, setSearched] = useState("");

    const [selectedFileName, setSelectedFileName] = useState("");
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
        setSearched("");
        requestSearch(searched);
    };
    // Select update each fields -> namepattern
    const selectExampleString = () => {
        if (typeof window.getSelection !== "undefined") {
            try {
                let sel = window.getSelection(), range = sel.getRangeAt(0);
                let selectionRect = range.getBoundingClientRect(), fullRect = exampleBox.current.getBoundingClientRect();
                let startOffset = ((selectionRect.left - fullRect.left) / selectionRect.width) * range.toString().length;
                startOffset = Math.round(startOffset);
                let selectionRangeValue = {
                    text: range.toString(),
                    startOffset: startOffset,
                    endOffset: startOffset + range.toString().length,
                };
                // console.log("openposition dlg , selectExampleString :", selectionRangeValue);
                setSelectionRange(selectionRangeValue);
            } catch (error) {
                console.log(error);
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

    const clickNamePattern = (index) => {
        let selectedText = getSelectionText();
        // console.log("openposition dlg , clickNamePattern   getSelectionText :", selectedText, index, selectionRange);
        if (selectionRange !== null && selectedText !== "") {
            let text = selectionRange.text;
            let startOffset = selectionRange.startOffset;
            let endOffset = selectionRange.endOffset;
            if (text.replace(/\s+/g, "") === selectedText) {
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
                    setNamePatterns(namePatternsPrimaryValue);
                }
            }
        }
    };

    const onChangePattern = async (e, index) => {
        let selectedText = "";
        let inputed_value = e.target.value.toString();
        for (let i = 0; i < inputed_value.length; i++) {
            if (inputed_value.substring(i, i + 1) !== " ") {
                selectedText = selectedText + inputed_value.substring(i, i + 1);
            }
        }
        if (selectionRange !== null) {
            let text = selectionRange.text;
            let startOffset = selectionRange.startOffset;
            let endOffset = selectionRange.endOffset;
            // console.log(selectedText, selectionRange,  text, selectedText, text === selectedText);
            if (text === selectedText) {
                if (startOffset > -1 && endOffset > -1) {
                    let namePatternsPrimaryValue = [...namePatterns];
                    for (var i = 0; i < namePatternsPrimaryValue.length; i++) {
                        if (index === i) {
                            namePatternsPrimaryValue[index].text = text;
                            namePatternsPrimaryValue[index].start = startOffset;
                            namePatternsPrimaryValue[index].end = endOffset;
                            for (let j = startOffset; j < endOffset; j++) {
                                document.getElementById("filename" + j.toString()).style.color =
                                    namePatternsPrimaryValue[index].color;
                            }
                        }
                    }
                    setNamePatterns(namePatternsPrimaryValue);
                    console.log("OpenPositionDialog : onChangePattern : namepatterns", namePatterns);
                }
            }
        }

    }
    // ----------------------------------------------------- update button function
    // Convert string to integer of some fields: row, col, field, channel, z, time
    const convertContentStringToInteger = (field, stringData, moveIndex) => {
        // console.log("OpenPositionDialog > convertContentStringToInteger, field, stringData :", field, stringData);
        let newField = "";
        let intField = -5;
        if (field === "row") {
            intField = stringData.charCodeAt(0) - 65;
        } else {
            newField = stringData.replace(/\D/g, "");
            intField = parseInt(newField);
        }
        return intField;
    };

    const getNamePatternPerFileForProcessing = (objectPerFile) => {
        let result = {};
        let resultContent = {};
        let moveIndex = 0;
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
                let tempString = objectPerFile.filename.substring(namePatterns[currentIndex].start, namePatterns[currentIndex].end);
                if (key === "id") {
                    resultContent[`${key}`] = objectPerFile.id;
                }
                else if (key === "series") {
                    result[`${key}`] = tempString;
                    resultContent[`${key}`] = tempString;
                } else if (key === "filename") {
                    result[`${key}`] = objectPerFile.filename;
                    resultContent[`${key}`] = objectPerFile.filename;
                } else if (key === "z") {
                    if (tempString === "z") {
                        for (let j = 1; j < 4; j++) {
                            tempString = objectPerFile.filename.substring(namePatterns[currentIndex].start + j, namePatterns[currentIndex].start + j + 1);
                            if (tempString === "_") {
                                moveIndex = j + 1;
                                tempString = objectPerFile.filename.substring(namePatterns[currentIndex].start + 1, namePatterns[currentIndex].start + j);
                                result[`${key}`] = parseInt(tempString) + 1;
                                resultContent[`${key}`] = objectPerFile.filename.substring(namePatterns[currentIndex].start, namePatterns[currentIndex].start + j);
                            }
                        }
                    } else {
                        result[`${key}`] = convertContentStringToInteger(key, tempString);
                        resultContent[`${key}`] = tempString;
                    }
                }
                else {
                    tempString = objectPerFile.filename.substring(namePatterns[currentIndex].start + moveIndex, namePatterns[currentIndex].end + moveIndex);
                    result[`${key}`] = convertContentStringToInteger(key, tempString);
                    resultContent[`${key}`] = tempString;
                }
            }
        }
        return [result, resultContent];
    };

    const updateNameType = () => {
        if (acceptedFiles === null || acceptedFiles === undefined) {
            console.log("acceptedFiles error : ", acceptedFiles);
            return "";
        }
        let new_content = [];
        let new_content_processing = [];
        // console.log("OpenPositionDialog.js nameFile updateNameType : ", contents);
        let old_content = [...contents];
        let old_content_p = JSON.parse(JSON.stringify(old_content));
        for (let i = 0; i < old_content.length; i++) {
            let result = getNamePatternPerFileForProcessing(old_content_p[i]);
            new_content.push(result[1]);
            new_content_processing.push(result[0]);
        }
        // console.log("OpenPositionDialog.js nameFile updateNameType : ", JSON.parse(JSON.stringify(new_content_processing)));
        props.setContents(JSON.parse(JSON.stringify(new_content_processing)))
        setSearchRows(JSON.parse(JSON.stringify(new_content)));
    };

    // clear button + change file name
    const reset_namePatterns = () => {
        let namePatternsPrimaryValue = [...namePatterns];
        for (let i = 0; i < namePatternsPrimaryValue.length; i++) {
            namePatternsPrimaryValue[i].text = "";
            namePatternsPrimaryValue[i].start = 0;
            namePatternsPrimaryValue[i].end = 0;
        }
        setNamePatterns(namePatternsPrimaryValue);
    };

    const clearNameType = () => {
        for (let k = 0; k < selectedFileName.length; k++) {
            document.getElementById("filename" + k.toString()).style.color = "#000";
        }
        reset_namePatterns();
    };

    const updateNativeSelect = (event) => {
        setSelectedFileName(event.target.value.toString().split(".")[0]);
        reset_namePatterns();
    };

    useEffect(() => {
        setContents([]);
        setSearchRows([]);
        for (let i = 0; i < acceptedFiles.length; i++) {
            if (acceptedFiles[i]) {
                let current_file = {id: (i + 1).toString(), filename: acceptedFiles[i]["name"].toString().replace(/\s+/g, ""), series: "", row: "", col: "", field: "", channel: "", z: "", time: "", hole: -1, };
                setContents(contents => [...contents, current_file]);
                setSearchRows(rows => [...rows, current_file]);
            }
        }
        if (acceptedFiles.length > 0) {
            // filename: acceptedFiles[i].file["name"].toString()
            setSelectedFileName(acceptedFiles[0]["name"].toString().split(".")[0].replace(/\s+/g, ""));
        }
        setLoading(true);
    }, []);

    return (
        <div style={{minHeight: "300px"}}>
            {/* <input {...getInputProps()} /> */}
            {acceptedFiles.length === 0 ? (
                <div className="d-flex align-center justify-center pt-5">
                    {loading ? "Drag and drop files or a folder" : "Loading..."}
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
                            style={{height: "auto !important"}}>
                            {selectedFileName.split("").map((item, index) => {
                                return (
                                    <tt key={index}>
                                        <strong>
                                            <p
                                                id={"filename" + index.toString()}
                                                className="mb-0 font-bolder font-20"
                                                key={index}>
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
                            style={{border: "none"}}>
                            {contents.map((c) => {
                                return (
                                    <option key={c.filename} value={c.filename}>
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
                                            borderRadius: "8px",
                                        }}>
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
                        <div className="d-flex" style={{height: "40px"}}>
                            <Button
                                size="medium"
                                color="primary"
                                variant="contained"
                                depressed="true"
                                onClick={() => updateNameType()}
                                style={{backgroundColor: "#1565c0"}}>
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
                                style={{backgroundColor: "#1565c0"}}>
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
                        <div style={{height: "380px", width: "100%"}}>
                            <DataGrid
                                style={{margin: "auto"}}
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
    const [loading, setLoading] = useState(false);
    const backgroundText = loading
        ? "Loading..."
        : "Drag and drop files or a folder";
    return (
        <div style={{minHeight: "200px"}}>
            <div className="d-flex align-center justify-center pt-5">
                {backgroundText}
            </div>
        </div>
    );
};

const OpenPositionDialog = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [cloudDialog, setCloudDialog] = useState(false);
    const [contents, setContents] = useState([]);

    const onTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleCloudDialog = () => {
        setCloudDialog(!cloudDialog);
    };

    const handleCloseOpenDlg = () => {
        props.handleClose();
        acceptedFiles = [];
        for (let i = 0; i < namePatternsPrimary.length; i++) {
            namePatternsPrimary[i].text = "";
            namePatternsPrimary[i].start = 0;
            namePatternsPrimary[i].end = 0;
        }
    };

    const handleSetSetting = async () => {
        if (contents !== [] && contents !== null && contents !== undefined) {
            // console.log("OpenPositionDialog.js handleSetSetting : ", JSON.parse(JSON.stringify(contents)));
            await api_tiles.updateNameFile(JSON.parse(JSON.stringify(contents)));
            store.dispatch({type: "content_addContent", content: JSON.parse(JSON.stringify(contents))});
            props.handleClose();
            acceptedFiles = [];
        }
    };

    useEffect(() => { }, []);

    return (
        <>
            <Dialog
                open={true}
                onClose={handleCloseOpenDlg}
                maxWidth={"1010"}
                className="m-0"
                style={{top: "0%", bottom: "auto"}}>
                <div className="d-flex border-bottom">
                    <DialogTitle>Position Select</DialogTitle>
                    <button
                        className="dialog-close-btn"
                        color="primary"
                        size="small"
                        onClick={handleCloseOpenDlg}>
                        &times;
                    </button>
                </div>
                <DialogContent className="p-0" style={{width: "1000px"}}>
                    <Tabs
                        className="border"
                        variant="fullWidth"
                        value={selectedTab}
                        onChange={onTabChange}
                        aria-label="scrollable auto tabs example">
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
                            <ImageDropzone setLoading={(loading) => setIsLoading(loading)} />
                        </TabContainer>
                    )}
                    {selectedTab === 1 && (
                        <TabContainer>
                            <Tiling files={acceptedFiles} />
                        </TabContainer>
                    )}
                    {selectedTab === 2 && (
                        <TabContainer>
                            <DropzoneMetaData />
                        </TabContainer>
                    )}
                    {selectedTab === 3 && (
                        <TabContainer>
                            <DropzoneNamesFiles setContents={(contents) => {setContents(contents)}} />
                        </TabContainer>
                    )}
                    {selectedTab === 4 && (
                        <TabContainer>
                            <DropzoneGroup />
                        </TabContainer>
                    )}
                </DialogContent>
                <DialogActions
                    className="border">
                    {selectedTab === 0 && (
                        <div className="d-flex">
                            <Button
                                className="cloud-btn"
                                variant="contained"
                                onClick={handleCloudDialog}
                                color="primary"
                                style={{marginRight: "150px", marginLeft: "0px"}}>
                                Cloud
                            </Button>
                            {isLoading ? (
                                <div className="progress" style={{width: "400px", marginRight: "180px"}}>
                                    <div className="progress-bar"></div>
                                </div>
                            ) : (
                                <div style={{width: "580px"}}></div>
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
                            onClick={handleSetSetting}>
                            Set
                        </Button>
                    )}
                    <Button
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={handleCloseOpenDlg}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const mapStateToProps = (state) => ({
    files: state.files.file,
    filesChosen: state.vessel.selectedVesselHole,
});

OpenPositionDialog.propTypes = {handleClose: PropTypes.func.isRequired};
export default connect(mapStateToProps)(OpenPositionDialog);
