
import React, { useRef, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Image, Alert } from 'react-bootstrap';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ScrollArea from 'react-scrollbar';
import DialogPM from "./DialogPM";
import Icon from '@mdi/react';
import {
    mdiWeatherSunny,
    mdiCropFree,
    mdiClose,
    mdiPencil,
} from '@mdi/js';
// import Vessel from "../viewcontrol/Vessel";
// import Objective from "../viewcontrol/Objective";
// import Channel from "../viewcontrol/Channel";
// import ImageAdjust from "../viewcontrol/ImageAdjust";
// import ZPosition from "../viewcontrol/ZPosition";
// import Timeline from "../viewcontrol/Timeline";
import { connect } from 'react-redux';
import store from "../../../../reducers";
import * as api from "../../../../api/tiles";
import UTIF from "utif";

const tilingMenus = [
    "Edit",
    "Alignment",
    "Bonding",
    "Shading",
    "Display",
    "Result",
    "Option"
];
const tilingAlignButtons = [
    "Cascade",
    "Height Decreasing",
    "Height Increasing",
    "By XYZ",
    "By Columns",
    "By Rows"
];

let TAG = "Tiling : ";
let stylingTiling = {
    ToggleButtonGroup: { margin: '0 auto', width: '22px', height: '22px' }
}

const Tiling = (props) => {

    const [value, setValue] = useState(0);
    const [fileObjs, setFileObjs] = useState([]);
    const [selectedImageFile, setSelectedImageFile] = useState();
    const [widthImage, setWidthImage] = useState(window.innerWidth);
    const [heightImage, setHeightImage] = useState(window.innerHeight);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [alignment, setAlignment] = useState(0);
    const [checked, setChecked] = useState(true);
    const [scale, setScale] = useState('');
    const [loadImageSource, setLoadImageSource] = useState(null);

    const tiling_bonding_patternMatch = false;
    const alignButtonImage = (index) => { return `../../../assets/images/pos_align_${index}.png`; };
    const canvasElement = useRef(null);

    // Change text fields
    const inputTilingRows = (event) => {
        console.log("ok");
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };
    const inputTilingCols = (event) => {
        console.log("ok")
    };
    const inputTilingBorder = (event) => {
        console.log("ok")
    };
    const inputTilingGapX = (event) => {
        console.log("ok")
    };
    const inputTilingGapY = (event) => {
        console.log("ok")
    };

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        console.log(index)
    };

    const handleAlignment = (event) => {
        console.log(" handleAlignment", fileObjs.length, event.target.value);
        if (fileObjs.length > 0) {
            let method = event.target.value;
            if (tilingAlignButtons.includes(method)) {
                api.alignTilesApi(fileObjs.length, method, handleApi);
            }
        }
        // setAlignment(newAlignment);
    };

    const handleApi = (response, status) => {
        if (status) {
            console.log("handleAlignTilesApi : response :", response);
            displayResponse(response);
        } else {
            console.log("handleAlignTilesApi : error :", response);
        }
    }

    const handleChange = (event) => {
        setChecked(event.target.checked);
        if (fileObjs.length > 0) {
            api.listTiles(handleApi);
        }
    };

    const autoPatternMathing = () => {
        console.log("clicked!!!!!");
    };

    const normalizeImgLuminance = () => {
        console.log("clicked!!!!!");
    };
    const correctLighting = () => {
        console.log("clicked!!!!!");
    };
    const decreaseImgLuminance = () => {
        console.log("clicked!!!!!");
    };
    const increaseImgLuminance = () => {
        console.log("clicked!!!!!");
    };
    const resetImgLuminance = () => {
        console.log("clicked!!!!!");
    };
    const bestFit = () => {
        console.log("clicked!!!!!");
    };
    const exportTiledImage = () => {
        console.log("clicked!!!!!");
    };

    const handleScaleChange = (event) => {
        setScale(event.target.value);
    };

    const handleListContentItemClick = (event, index) => {
        console.log(" Selected Image : ", index);
        if (fileObjs.length > 0) {
            setSelectedImageFile(fileObjs[index]);
            displayImage(fileObjs[index], "tiff");
        }
    };

    const displayImage = async (file, type) => {
        try {
            if (type === "tiff") {
                displayTiff(file, file.name, file.size);
            }
        }
        catch (err) {
            console.log(" error : Tiling.js useEffect : ", err);
        }
    }

    const displayResponse = async (response) => {
        try {
            displayAlignment(response);
        }
        catch (err) {
            console.log(" error : Tiling.js useEffect : ", err);
        }
    }

    function displayAlignment(response) {
        var rgba = UTIF.toRGBA8(response[0]);  // Uint8Array with RGBA pixels
        const firstPageOfTif = response[0];
        const imageWidth = firstPageOfTif.width;
        const imageHeight = firstPageOfTif.height;
        // const imageWidth = localStorage.getItem("imageViewSizeWidth") !== undefined ? localStorage.getItem("imageViewSizeWidth") : firstPageOfTif.width;
        // const imageHeight = localStorage.getItem("imageViewSizeHeight") !== undefined ? localStorage.getItem("imageViewSizeHeight") : firstPageOfTif.height;
        setWidthImage(imageWidth);
        setHeightImage(imageHeight);
        const cnv = document.getElementById("canvas");
        cnv.width = imageWidth;
        cnv.height = imageHeight;
        const ctx = cnv.getContext("2d");
        const imageData = ctx.createImageData(imageWidth, imageHeight);
        for (let i = 0; i < rgba.length; i++) {
            imageData.data[i] = rgba[i];
        }
        ctx.putImageData(imageData, 0, 0);
    };

    function displayTiff(fileDisplay, name, size) {
        fileDisplay.arrayBuffer().then((fileBuffer) => {
            var ifds = UTIF.decode(fileBuffer);
            UTIF.decodeImage(fileBuffer, ifds[0])
            var rgba = UTIF.toRGBA8(ifds[0]);  // Uint8Array with RGBA pixels
            const firstPageOfTif = ifds[0];
            const imageWidth = firstPageOfTif.width;
            const imageHeight = firstPageOfTif.height;
            // const imageWidth = localStorage.getItem("imageViewSizeWidth") !== undefined ? localStorage.getItem("imageViewSizeWidth") : firstPageOfTif.width;
            // const imageHeight = localStorage.getItem("imageViewSizeHeight") !== undefined ? localStorage.getItem("imageViewSizeHeight") : firstPageOfTif.height;
            setWidthImage(imageWidth);
            setHeightImage(imageHeight);
            const cnv = document.getElementById("canvas");
            cnv.width = imageWidth;
            cnv.height = imageHeight;
            const ctx = cnv.getContext("2d");
            const imageData = ctx.createImageData(imageWidth, imageHeight);
            for (let i = 0; i < rgba.length; i++) {
                imageData.data[i] = rgba[i];
            }
            ctx.putImageData(imageData, 0, 0);
        })
    }

    useEffect(() => {
        // console.log(" Tiling UseEffect : ");
        if (props.files.length > 0) {
            console.log("props.files.length : ", props.files);
            setFileObjs(props.files);
            setSelectedImageFile(props.files[0]);
            if (props.files[0].name.includes(".tiff")) {
                displayImage(props.files[0], "tiff");
            }
        }
    }, [props.files])

    return (
        <>
            <Row no-gutters="true" className='m-0 drop pa-5' style={{ maxWidth: "100%", height: "520px" }}>
                <Col xs={1} className="border p-0">
                    <List className='border p-0' id="position-dlg-span">
                        {tilingMenus.map((menuTitle, idx) => {
                            return <ListItemButton style={{ fontSize: "12px !important" }} className="border" key={idx} onClick={(event) => handleListItemClick(event, idx)}>
                                <ListItemText primary={menuTitle} />
                            </ListItemButton>
                        })}
                    </List>
                </Col>
                <Col xs={5} className="p-0 h-100">
                    {/* Tiling Control Panel  */}
                    <div className="control-panel h-100">
                        {/* Editing */}
                        {selectedIndex === 0 &&
                            <Card className='h-100' variant="outlined">
                                <CardContent className="pa-1"><h5>Editing</h5></CardContent>
                                <div className="inside p-3">{
                                    fileObjs !== undefined && fileObjs !== null ? <List className="overflow-auto" style={{ maxHeight: '80%', overflow: 'auto' }}>
                                        {
                                            fileObjs.map((content, idx) => {
                                                // if (idx === fileObjs.indexof(selectedImageFile)) {
                                                //     return <ListItemButton style={{ fontSize: "8px !important", width: "fit-content", backgroundColor: "lightblue" }} className="border" key={idx} onClick={(event) => handleListContentItemClick(event, idx)}>
                                                //         <ListItemText primary={content.name} />
                                                //     </ListItemButton>
                                                // } else {
                                                return <ListItemButton style={{ fontSize: "8px !important", width: "fit-content", backgroundColor: "white" }} className="border" key={idx} onClick={(event) => handleListContentItemClick(event, idx)}>
                                                    <ListItemText primary={content.name} />
                                                </ListItemButton>
                                                // }
                                            })}
                                    </List> : <></>
                                }
                                </div>
                            </Card>
                        }
                        {/* Alignment */}
                        {selectedIndex === 1 &&
                            <Card className='h-100' variant="outlined">
                                <CardContent className="pa-1"><h5>Alignment</h5></CardContent>
                                <div className="inside p-3">
                                    <ToggleButtonGroup
                                        value={alignment}
                                        exclusive
                                        onChange={(e) => { handleAlignment(e) }}
                                        aria-label="text alignment"
                                    >
                                        {[...Array(6)].map((_, i) => {
                                            return <Tooltip title={tilingAlignButtons[i]} key={i}>
                                                <ToggleButton key={i.toString() + "ToggleButton"} value={i}><Image value={tilingAlignButtons[i]} style={{ ...stylingTiling.ToggleButtonGroup, filter: i === 3 ? 'grayscale(1)' : '' }} src={alignButtonImage(i)} alt='no image' /></ToggleButton>
                                            </Tooltip >
                                        })}
                                    </ToggleButtonGroup>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox onChange={handleChange} />} label="Left-Right" />
                                        <FormControlLabel control={<Checkbox onChange={handleChange} />} label="Up-Down" />
                                        <FormControlLabel control={<Checkbox onChange={handleChange} />} label="Descending Order" />
                                    </FormGroup>
                                    <Row className="mt-4 mr-4">
                                        <Col xs={6}>
                                            <TextField
                                                value={value}
                                                size="small"
                                                onChange={inputTilingRows}
                                                className="range-field"
                                                label="Row"
                                                inputProps={{
                                                    type: 'number',
                                                }}
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <TextField
                                                value={value}
                                                size="small"
                                                onChange={inputTilingCols}
                                                className="range-field"
                                                label="Column"
                                                inputProps={{
                                                    type: 'number',
                                                }}
                                            />
                                        </Col>
                                    </Row>

                                    <Row className="mt-4 mr-4">
                                        <Col xs={4}>
                                            <TextField
                                                value={value}
                                                size="small"
                                                onChange={inputTilingBorder}
                                                className="range-field"
                                                label="Border"
                                                inputProps={{
                                                    type: 'number',
                                                }}
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <TextField
                                                value={value}
                                                size="small"
                                                onChange={inputTilingGapX}
                                                className="range-field"
                                                label="Gap X"
                                                inputProps={{
                                                    type: 'number',
                                                }}
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <TextField
                                                value={value}
                                                size="small"
                                                onChange={inputTilingGapY}
                                                className="range-field"
                                                label="Gap Y"
                                                inputProps={{
                                                    type: 'number',
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        }
                        {/* Bonding */}
                        {selectedIndex === 2 &&
                            <Card className='h-100' variant="outlined">
                                <CardContent className="pa-1"><h5>Bonding</h5></CardContent>
                                <div className="inside p-3">
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox onChange={handleChange} />} label="None" />
                                        <FormControlLabel control={<Checkbox onChange={handleChange} />} label="Snap To Edge" />
                                        <FormControlLabel control={<Checkbox onChange={handleChange} />} label="Pattern Match" />
                                    </FormGroup>
                                    <DialogPM />
                                    {tiling_bonding_patternMatch &&
                                        <Row className="mr-4">
                                            <Col xs={3}>
                                                <TextField
                                                    className="range-field"
                                                    label="Border"
                                                    inputProps={{
                                                        type: 'number',
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={3}>
                                                <TextField
                                                    className="range-field"
                                                    label="Overlap X"
                                                    inputProps={{
                                                        type: 'number',
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={3}>
                                                <TextField
                                                    className="range-field"
                                                    label="Overlap Y"
                                                    inputProps={{
                                                        type: 'number',
                                                    }}
                                                />
                                            </Col>
                                            <Button elevation="2" className="mt-5" onClick={autoPatternMathing}>Auto</Button>
                                        </Row>
                                    }
                                </div>
                            </Card>
                        }
                        {/* Shading */}
                        {selectedIndex === 3 &&
                            <Card className='h-100' variant="outlined">
                                <CardContent className="pa-1"><h5>Shading</h5></CardContent>
                                <div className="inside p-3">
                                    <Row className="mt-4 mr-4">
                                        <Col xs={6}>
                                            <Button
                                                className="px-0"
                                                style={{ minWidth: "34px", height: '34px', color: '#009688' }}
                                                onClick={normalizeImgLuminance}
                                            >Normalize</Button>
                                        </Col>
                                    </Row>
                                    <Row className="mt-4 mr-4">
                                        <Col xs={6}>
                                            <Button
                                                className="px-0"
                                                style={{ minWidth: "34px", height: '34px', color: '#009688' }}
                                                onClick={correctLighting}
                                            >Correct</Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        }
                        {/* Display */}
                        {selectedIndex === 4 &&
                            <Card className='h-100' variant="outlined">
                                <CardContent className="pa-1"><h5>Display</h5></CardContent>
                                <div className="inside p-3">
                                    <Row className="mt-4 mr-4">
                                        <Col xs={6}>
                                            <Icon color="yellow" path={mdiWeatherSunny} size={1} />
                                            <Button
                                                className="px-0"
                                                style={{ minWidth: "34px", height: '34px', color: '#009688' }}
                                                onClick={decreaseImgLuminance}
                                            >-</Button>
                                            <Icon color="yellow" path={mdiWeatherSunny} size={1} />
                                            <Button
                                                className="px-0" style={{ minWidth: "34px", height: '34px', color: '#009688' }}
                                                onClick={increaseImgLuminance}
                                            >+</Button>
                                        </Col>
                                    </Row>
                                    <Row className="mt-4 mr-4">
                                        <Col xs={6}>
                                            <Button
                                                className="px-0" style={{ minWidth: "34px", height: '34px', color: '#009688' }}
                                                onClick={resetImgLuminance}
                                            >Reset</Button>
                                        </Col>
                                    </Row>
                                    <Row className="mt-4 mr-4">
                                        <Col xs={6}>
                                            <Button
                                                className="px-0" style={{ minWidth: "34px", height: '34px', color: '#009688' }}
                                                onClick={bestFit}
                                            >BestFit</Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        }
                        {/* Result */}
                        {selectedIndex === 5 &&
                            <Card className='h-100' variant="outlined">
                                <CardContent className="pa-1"><h5>Result</h5></CardContent>
                                <div className="inside p-3">
                                    <Row className="mt-4 mr-4">
                                        <Col xs={6}>
                                            <ToggleButtonGroup color="primary">
                                                <ToggleButton value="true">
                                                    <Icon path={mdiCropFree} size={1} />
                                                </ToggleButton >
                                                <ToggleButton value="false">
                                                    <Icon path={mdiClose} size={1} />
                                                </ToggleButton >
                                            </ToggleButtonGroup>
                                        </Col>
                                    </Row>
                                    <Row className="mt-4 mr-4">
                                        <Col xs={6}>
                                            <Button depressed="true" onClick={exportTiledImage}>
                                                Tiled Image
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        }
                        {/* Option */}
                        {selectedIndex === 6 &&
                            <Card className='h-100' variant="outlined">
                                <CardContent className="pa-1"><h5>Option</h5></CardContent>
                            </Card>
                        }
                    </div>
                </Col>
                <Col md="auto" className="p-0 h-100">
                    {/*  Tiling Preview  */}
                    <div className="">
                        <div className="row m-0">
                            {/* <img id="canvas" className="canvas m-auto" style={{ cursor: "grab" }} /> */}
                            <canvas id="canvas" className="canvas m-auto" ref={canvasElement} style={{ cursor: "grab" }} />
                            {/* <RoutedAvivator openedImageSource={loadImageSource} /> */}
                        </div>
                        <div className="row m-0">
                            <div className="col p-0">
                                <ScrollArea />
                            </div>
                            <div className="col-sm-2 p-0" style={{ position: 'relative' }}>
                                <Button className="position-absolute" style={{ height: "38px" }}>
                                    {scale + "%"}
                                    <Icon size={1} path={mdiPencil} />
                                </Button>
                                <Select
                                    onChange={handleScaleChange}
                                    style={{ opacity: "0" }}
                                    className="position-absolute"
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Col>
                {/* <Col  md="auto" className="p-0 border" style={{ height: "100%", position: "relative", overflowY: "scroll" }}>
                    <Vessel />
                    <Objective />
                    <Channel />
                    <ImageAdjust />
                    <ZPosition />
                    <Timeline />
                </Col> */}
            </Row>
        </>
    )

}

const mapStateToProps = state => ({
    content: state.files.content,
})

export default connect(mapStateToProps)(Tiling);