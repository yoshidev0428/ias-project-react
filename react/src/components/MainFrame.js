import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Logout from '@mui/icons-material/Logout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { Row, Col, Container, Alert } from 'react-bootstrap';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SchoolIcon from '@mui/icons-material/School';
import TuneIcon from '@mui/icons-material/Tune';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import BiotechIcon from '@mui/icons-material/Biotech';
import EditOffIcon from '@mui/icons-material/EditOff';
import PollIcon from '@mui/icons-material/Poll';
import EngineeringIcon from '@mui/icons-material/Engineering';
// import LinearProgress from '@mui/material/LinearProgress';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
import RoutedAvivator from './viv'
import DLMLTab from "./tabs/DLMLTab";
import AdjustTab from "./tabs/AdjustTab";
import FilterTab from "./tabs/FilterTab";
import FileTab from "./tabs/FileTab";
import ViewTab from "./tabs/ViewTab";
import MeasureTab from "./tabs/MeasureTab";
import ReportTab from "./tabs/ReportTab";
import SettingsTab from "./tabs/SettingsTab";
import store from "../reducers";
import { connect } from 'react-redux';
import { useWindowDimensions } from "./helpers";
import UTIF from "utif";

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 0 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
    files: state.files.files,
    isFilesAvailable: state.files.isFilesAvailable,
    filesChosen: state.files.filesChosen,
    isFilesChosenAvailable: state.files.isFilesChosenAvailable,

})

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});

const MainFrame = (props) => {

    const imageViewAreaRef = useRef(null);
    const { height } = useWindowDimensions();
    const handleResize = () => {
        localStorage.setItem("imageViewSizeWidth", imageViewAreaRef.current.offsetWidth);
        localStorage.setItem("imageViewSizeHeight", imageViewAreaRef.current.offsetHeight);
    };
    const [rightTabVal, setRightTabVal] = useState(0);
    const [leftTabVal, setLeftTabVal] = useState(3);
    const handleRightTabChange = (event, newValue) => {
        setRightTabVal(newValue);
    };
    const handleLeftTabChange = (event, newValue) => {
        setLeftTabVal(newValue);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        store.dispatch({ type: "auth_logOut" });
    };

    const [filesChosen, setFilesChosen] = useState(props.filesChosen);
    const [filesDisplayed, setFilesDisplayed] = useState([]);
    const [files, setFiles] = useState(props.files);
    const [widthImage, setWidthImage] = useState(window.innerWidth);
    const [heightImage, setHeightImage] = useState(window.innerHeight);

    useEffect(() => {
        handleResize();
    }, [imageViewAreaRef]);

    useEffect(() => {
        if (props.files) {
            setFiles(files);
        }
    }, [props.files])

    const HeaderContent = () => {
        return (
            <Box sx={{ flexGrow: 1, height: "65px" }}>
                <ThemeProvider theme={darkTheme}>
                    <AppBar className="main-header" position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                color="inherit" >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                <img
                                    width="116"
                                    height="48"
                                    src='./assets/images/logo75.png'
                                    alt="Logo"
                                />
                            </Typography>
                            <div>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={handleClose}>My account</MenuItem>
                                </Menu>
                                <IconButton size="large">
                                    <Avatar sx={{ width: 30, height: 30, bgcolor: blue[500] }}> JM </Avatar>
                                </IconButton>

                                <IconButton
                                    size="large"
                                    onClick={handleLogout}
                                    color="inherit"
                                >
                                    <Logout />
                                </IconButton>

                            </div>
                        </Toolbar>
                    </AppBar>
                </ThemeProvider>
            </Box>
        );
    }

    // function imgLoadedFromFile(fileDisplay, name, size) {
    //     fileDisplay.arrayBuffer().then((fileBuffer) => {
    //         var ifds = UTIF.decode(fileBuffer);
    //         UTIF.decodeImage(fileBuffer, ifds[0])
    //         var rgba = UTIF.toRGBA8(ifds[0]);  // Uint8Array with RGBA pixels
    //         const firstPageOfTif = ifds[0];
    //         // console.log("IMG LOADED: ", ifds[0].width, ifds[0].height, ifds[0]);
    //         // console.log("MAIN FRAME: rgba: ", rgba);
    //         // const imageWidth = firstPageOfTif.width;
    //         // const imageHeight = firstPageOfTif.height;
    //         const imageWidth = localStorage.getItem("imageViewSizeWidth") !== undefined ? localStorage.getItem("imageViewSizeWidth") : firstPageOfTif.width;
    //         const imageHeight = localStorage.getItem("imageViewSizeHeight") !== undefined ? localStorage.getItem("imageViewSizeHeight") : firstPageOfTif.height;
    //         setWidthImage(imageWidth);
    //         setHeightImage(imageHeight);
    //         // let imgSource = { urlOrFile: URL.createObjectURL(new Blob([fileBuffer])), description: name, size: size };
    //         // console.log("imgLoadedFromFile: ", imgSource);
    //         // setLoadImageSource(imgSource);

    //         const cnv = document.createElement("canvas");
    //         cnv.width = imageWidth;
    //         cnv.height = imageHeight;

    //         const ctx = cnv.getContext("2d");
    //         const imageData = ctx.createImageData(imageWidth, imageHeight);
    //         console.log("MAIN FRAME: imagedata: ", imageData);
    //         for (let i = 0; i < rgba.length; i++) {
    //             imageData.data[i] = rgba[i];
    //         }
    //         ctx.putImageData(imageData, 0, 0);
    //         console.log("MAIN FRAME: cnv: ", cnv);
    //         setLoadImageSource(cnv);
    //     })
    // }


    const [loadImageSource, setLoadImageSource] = useState(null);
    const changeLoadFile = (files) => {
        // console.log(files[0], " mainFrame : changeloadfile");
        let file = files[0];
        if (file) {
            let name = "";
            let size = 0;
            if (file.file.name !== undefined) {
                name = file.file.name;
            }
            if (file.file.size !== undefined) {
                size = file.file.size;
            }
            // let objectURL = URL.createObjectURL(file);
            // console.log(objectURL, " mainFrame : file url1");
            // let updatedURL = URL.revokeObjectURL(objectURL);
            // console.log(updatedURL, " mainFrame : file url2");
            var binaryData = [];
            // var fileBuffer = Buffer.from(file)
            // window.Buffer = window.Buffer || require("buffer").Buffer;
            binaryData.push(file.file);
            // var blob = new Blob(file.file, {type: "image/tiff"}); 
            // console.log(URL.createObjectURL(new Blob([binaryData], { type: "image/tiff" })), " BLOB mainFrame : file url2");
            // var dataObj = URL.createObjectURL(new Blob([binaryData], {type: "image/tiff"}));
            // var dataObj = file.file;
            // toBase64(dataObj).then((result)=>{
            //     console.log("BASE 64: ", result);
            //     let textbase64 = result;
            //     console.log("BASE 64: ", textbase64);
            //     setLoadImageSource(textbase64);
            // })

            // Tiff.initialize({TOTAL_MEMORY: 16777216 * 10});
            // var tiff = new Tiff({
            //     buffer: fileBuffer
            // });
            // var dataUrl = tiff.toDataURL();
            // document.getElementById("tiffImage").src = URL.createObjectURL(new Blob([binaryData]));
            // setLoadImageSource({ urlOrFile: URL.createObjectURL(blob), description: name, size: size });
            // setLoadImageSource({ urlOrFile: URL.createObjectURL(files), description: name, size: size });
            // setLoadImageSource({ urlOrFile: URL.createObjectURL(new Blob([binaryData], {type: "image/tiff"})), description: name, size: size });
            // setLoadImageSource(URL.createObjectURL(new Blob([binaryData], {type: "image/tiff"})));
            // console.log("MAIN FRAME FILE NAME: ", imageUrl);
            // var xhr = new XMLHttpRequest();
            // xhr.open("GET", imageUrl);
            // xhr.responseType = "arraybuffer";
            // xhr.onload = imgLoaded;   xhr.send();
            // imgLoadedFromFile(file.file, name, size);
            // const ifds = UTIF.decode(file.file.arrayBuffer());
            // console.log("MAIN FRAME: ifds: ", ifds, file.file.arrayBuffer());
            // const firstPageOfTif = ifds[0];
            // UTIF.decodeImage(file.file.arrayBuffer(), ifds);
            // const rgba = UTIF.toRGBA8(firstPageOfTif);
            // console.log("MAIN FRAME: rgba: ", rgba);
            // const imageWidth = firstPageOfTif.width;
            // const imageHeight = firstPageOfTif.height;

            // const cnv = document.createElement("canvas");
            // cnv.width = 640;
            // cnv.height = 480;

            // const ctx = cnv.getContext("2d");
            // const imageData = ctx.createImageData(640, 480);
            // console.log("MAIN FRAME: imagedata: ", imageData);
            // for (let i = 0; i < rgba.length; i++) {
            //     imageData.data[i] = rgba[i];
            // }
            // ctx.putImageData(imageData, 0, 0);
            // console.log("MAIN FRAME: cnv: ", cnv);
            // setLoadImageSource(cnv);
        } else {
            Alert("Please open correct file again!");
        }
    }

    // const toBase64 = file => new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => resolve(reader.result);
    //     reader.onerror = error => reject(error);
    // });

    return (
        <>
            <HeaderContent />
            <Container fluid={true} className="p-0" style={{ height: (height - 65).toString() + "px" }}>
                <Row noGutters>
                    <Col xs={2} className='p-2 border-right' style={{ height: (height - 65).toString() + "px", overflowY: "auto" }}> {/* Left Panel */}
                        <div className='card border'>
                            <Tabs
                                // variant="scrollable"
                                value={leftTabVal} onChange={handleLeftTabChange}
                                aria-label="tabs example"
                                TabIndicatorProps={{
                                    style: {
                                        flexDirection: "row-right",
                                        justifyContent: "flex-start"
                                    }
                                }}
                            >
                                <Tab className='tab-button' icon={<SchoolIcon />} aria-label="school" />
                                <Tab className='tab-button' icon={<TuneIcon />} aria-label="tune" />
                                <Tab className='tab-button' icon={<FilterAltIcon />} aria-label="filter" />
                                <Tab className='tab-button' icon={<InsertDriveFileIcon />} aria-label="file" />
                            </Tabs>
                            {leftTabVal === 0 && <TabContainer ><DLMLTab /></TabContainer>}
                            {leftTabVal === 1 && <TabContainer><AdjustTab /></TabContainer>}
                            {leftTabVal === 2 && <TabContainer><FilterTab /></TabContainer>}
                            {leftTabVal === 3 && <TabContainer><FileTab changeOpenedFile={(files) => changeLoadFile(files)} /></TabContainer>}
                        </div>
                    </Col>
                    <Col xs={8} ref={imageViewAreaRef} style={{ backgroundColor: "#ddd", height: (height - 65).toString() + "px", overflowY: "auto" }}> {/* Central Panel, Viv Image Viewer */}
                        <RoutedAvivator openedImageSource={loadImageSource} />
                    </Col>
                    <Col xs={2} className='border-left p-2' style={{ height: (height - 65).toString() + "px", overflowY: "auto" }}>
                        <div className='card border'>
                            <Tabs
                                allowScrollButtonsMobile
                                value={rightTabVal} onChange={handleRightTabChange}
                                aria-label="scrollable auto tabs example">
                                <Tab className='tab-button' variant="fullWidth" icon={<BiotechIcon />} aria-label="BiotechIcon" />
                                <Tab className='tab-button' variant="fullWidth" icon={<EditOffIcon />} aria-label="EditOffIcon" />
                                <Tab className='tab-button' variant="fullWidth" icon={<PollIcon />} aria-label="PollIcon" />
                                <Tab className='tab-button' variant="fullWidth" icon={<EngineeringIcon />} aria-label="EngineeringIcon" />
                            </Tabs>
                            {rightTabVal === 0 && <TabContainer><ViewTab /></TabContainer>}
                            {rightTabVal === 1 && <TabContainer><MeasureTab /></TabContainer>}
                            {rightTabVal === 2 && <TabContainer><ReportTab /></TabContainer>}
                            {rightTabVal === 3 && <TabContainer><SettingsTab /></TabContainer>}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default connect(mapStateToProps)(MainFrame);
