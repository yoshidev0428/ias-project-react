
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
import OpenPositionViewTab from "./OpenPositionViewTab";
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
import { decode, isMultiPage, pageCount } from "tiff";
import UTIF from "utif";

const tilingMenus = [
    "Edit",
    "Alignment",
    // "Bonding",
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

const Tiling = (props) => {

    const [value, setValue] = useState(0);
    const [fileObjs, setFileObjs] = useState(props.files);
    const [fileImageChosen, setFileImageChosen] = useState();
    const [widthImage, setWidthImage] = useState(window.innerWidth);
    const [heightImage, setHeightImage] = useState(window.innerHeight);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [alignment, setAlignment] = useState('left');
    const [checked, setChecked] = useState(true);
    const tiling_bonding_patternMatch = false;

    const [scale, setScale] = useState('');
    const [loadImageSource, setLoadImageSource] = useState(null);
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

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const alignButtonImage = (index) => {
        return `../../../assets/images/pos_align_${index}.png`;
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
    const canvasElement = useRef(null);

    useEffect(() => {
        if (props.files) {
            // console.log("TILING > props.files useEffect: ", props.files);
            setFileObjs(props.files);
        }
    }, [props.files])

    const display_tiff = (file) => {
        console.log(file, "display_tiff");
        try {
            let result = decode(file);
            if (result.length === 1) {
                console.log((result[0]), "getImageFromIFD(result[0])");
            }
            let xhr = new XMLHttpRequest();
            xhr.responseType = "arraybuffer";
            xhr.open('GET', file);
            xhr.onload = function (e) {
                let arrayBuffer = this.response;
                // Tiff.initialize({
                //     TOTAL_MEMORY: 16777216 * 10
                // });
                let tiff = new Tiff({ buffer: arrayBuffer });
                let dataURL = tiff.toDataURL();
                document.getElementById("canvas").src = dataURL;
            }
        }
        catch { }
    }

    const handleListContentItemClick = (event, index) => {
        let fileObjChosen = fileObjs[index];
        console.log("Tiling, handleListContentItemClick: ", fileObjChosen);
        setFileImageChosen(fileObjChosen);
        // Implement tiff file type 1
        display_tiff(fileObjChosen);
    };

    function imgLoadedFromFile(fileDisplay, name, size) {
        fileDisplay.arrayBuffer().then((fileBuffer) => {
            var ifds = UTIF.decode(fileBuffer);
            // console.log("TILING: THEN imgLoadedFromFile: ", fileBuffer);
            UTIF.decodeImage(fileBuffer, ifds[0])
            var rgba = UTIF.toRGBA8(ifds[0]);  // Uint8Array with RGBA pixels
            const firstPageOfTif = ifds[0];
            // console.log("IMG LOADED: ", ifds[0].width, ifds[0].height, ifds[0]);
            // console.log("MAIN FRAME: rgba: ", rgba);
            const imageWidth = window.innerWidth !== undefined ? window.innerWidth : firstPageOfTif.width;
            const imageHeight = window.innerHeight !== undefined ? window.innerHeight : firstPageOfTif.height;
            // const imageWidth = localStorage.getItem("imageViewSizeWidth") !== undefined ? localStorage.getItem("imageViewSizeWidth") : firstPageOfTif.width;
            // const imageHeight = localStorage.getItem("imageViewSizeHeight") !== undefined ? localStorage.getItem("imageViewSizeHeight") : firstPageOfTif.height;
            setWidthImage(imageWidth);
            setHeightImage(imageHeight);
            // let imgSource = { urlOrFile: URL.createObjectURL(new Blob([fileBuffer])), description: name, size: size };
            // console.log("imgLoadedFromFile: ", imgSource);
            // setLoadImageSource(imgSource);

            const cnv = document.createElement("canvas");
            cnv.width = imageWidth;
            cnv.height = imageHeight;

            const ctx = cnv.getContext("2d");
            const imageData = ctx.createImageData(imageWidth, imageHeight);
            // console.log("MAIN FRAME: imagedata: ", imageData);
            for (let i = 0; i < rgba.length; i++) {
                imageData.data[i] = rgba[i];
            }
            ctx.putImageData(imageData, 0, 0);
            // console.log("MAIN FRAME: cnv: ", cnv);
            setLoadImageSource(cnv);
        })

    }

    useEffect(() => {
        let file = fileImageChosen;
        if (file) {
            console.log(file, " mainFrame : changeloadfile");
            // let file = file;
            if (file) {
                let name = "";
                let size = 0;
                if (file.name !== undefined) {
                    name = file.name;
                }
                if (file.size !== undefined) {
                    size = file.size;
                }
                imgLoadedFromFile(file, name, size);
            } else {
                Alert("Please open correct file again!");
            }
        }
    }, [fileImageChosen])

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
                                                // if (idx === fileObjs.indexof(fileImageChosen)) {
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
                                        onChange={handleAlignment}
                                        aria-label="text alignment"
                                    >
                                        {[...Array(6)].map((_, i) => {
                                            return <div>
                                                <Tooltip title={tilingAlignButtons[i]} key={i}>
                                                    {i === 3 ? <ToggleButton ><Image style={{ margin: '0 auto', width: '22px', height: '22px', filter: 'grayscale(1)' }} src={alignButtonImage(i)} alt='no image' /></ToggleButton>
                                                        : <ToggleButton key={i} ><Image style={{ margin: '0 auto', width: '22px', height: '22px' }} src={alignButtonImage(i)} alt='no image' /></ToggleButton>
                                                    }
                                                </Tooltip >
                                            </div>
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