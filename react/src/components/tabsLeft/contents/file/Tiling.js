import React, { useRef, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Image } from 'react-bootstrap';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ScrollArea from 'react-scrollbar';
import DialogPM from './DialogPM';
import Icon from '@mdi/react';
import { mdiWeatherSunny, mdiCropFree, mdiClose, mdiPencil } from '@mdi/js';
import { connect } from 'react-redux';
import * as api_tiles from '@/api/tiles';
import { getImageByUrl } from '@/api/fetch';
import RoutedAvivator from '@/components/avivator/Avivator';
import Vessel from '@/components/tabsRight/contents/viewcontrol/Vessel';
import Objective from '@/components/tabsRight/contents/viewcontrol/Objective';
import Channel from '@/components/tabsRight/contents/viewcontrol/Channel';
import ImageAdjust from '@/components/tabsRight/contents/viewcontrol/ImageAdjust';
import ZPosition from '@/components/tabsRight/contents/viewcontrol/ZPosition';
import Timeline from '@/components/tabsRight/contents/viewcontrol/Timeline';
import store from '@/reducers';
import UTIF from 'utif';
import Align0 from '@/assets/images/pos_align_1.png';
import Align1 from '@/assets/images/pos_align_1.png';
import Align2 from '@/assets/images/pos_align_2.png';
import Align3 from '@/assets/images/pos_align_3.png';
import Align4 from '@/assets/images/pos_align_4.png';
import Align5 from '@/assets/images/pos_align_5.png';

const tilingMenus = [
  'Edit',
  'Alignment',
  'Bonding',
  'Shading',
  'Display',
  'Result',
  'Option',
];

const tilingAlignButtons = [
  'Cascade',
  'Height Decreasing',
  'Height Increasing',
  'By XYZ',
  'By Columns',
  'By Rows',
];

const AlignImages = [Align0, Align1, Align2, Align3, Align4, Align5];

let stylingTiling = {
  ToggleButtonGroup: { margin: '0 auto', width: '22px', height: '22px' },
};

const Tiling = (props) => {
  const [fileNames, setFileNames] = useState([]);
  const [value, setValue] = useState(0);
  const [fileObjs] = useState([]);
  const [selectedImageFileIndex, setSelectedImageFileIndex] = useState(0);

  const [_widthImage, setWidthImage] = useState(window.innerWidth);
  const [_heightImage, setHeightImage] = useState(window.innerHeight);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [alignment] = useState(0);
  const [_checked, setChecked] = useState(true);
  const [scale, setScale] = useState(100);
  const state = store.getState();

  const tiling_bonding_patternMatch = false;
  const alignButtonImage = (index) => {
    return AlignImages[index];
  };
  const canvasElement = useRef(null);

  // Change text fields
  const inputTilingRows = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };
  const inputTilingCols = (_event) => {};
  const inputTilingBorder = (_event) => {};
  const inputTilingGapX = (_event) => {};
  const inputTilingGapY = (_event) => {};

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleAlignment = (_event) => {
    if (fileObjs.length > 0) {
      let method = _event.target.value;
      if (tilingAlignButtons.includes(method)) {
        api_tiles.alignTilesApi(fileObjs.length, method, handleApi);
      }
    }
  };

  const handleApi = (response, status) => {
    if (status) {
      displayResponse(response);
    } else {
    }
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (fileObjs.length > 0) {
      api_tiles.listTiles(handleApi);
    }
  };

  const autoPatternMathing = () => {};

  const normalizeImgLuminance = () => {};
  const correctLighting = () => {};
  const decreaseImgLuminance = () => {};
  const increaseImgLuminance = () => {};
  const resetImgLuminance = () => {};
  const bestFit = () => {};
  const exportTiledImage = () => {};

  const handleScaleChange = (event) => {
    setScale(event.target.value);
  };

  const handleListContentItemClick = async (event, index) => {
    if (fileNames.length > 0) {
      setSelectedImageFileIndex(index);
      let file = await getImageByUrl(state.tiling.folderName, fileNames[index]);
      if (file !== null) {
        // store.dispatch({type: "tiling_selectedFile", content: file});
        displayImage(file);
      }
    }
    if (fileObjs.length > 0) {
      setSelectedImageFileIndex(index);
      displayImage(fileObjs[index]);
    }
  };

  const displayImage = async (file) => {
    let type = file.type.toString();
    try {
      if (type === 'tiff') {
        displayTiff(file);
      }
      if (type === 'image/tiff') {
        displayTiff(file);
      }
    } catch (err) {}
  };

  const displayResponse = async (response) => {
    try {
      displayAlignment(response);
    } catch (err) {}
  };

  function displayAlignment(response) {
    var rgba = UTIF.toRGBA8(response[0]); // Uint8Array with RGBA pixels
    const firstPageOfTif = response[0];
    const imageWidth = firstPageOfTif.width;
    const imageHeight = firstPageOfTif.height;
    setWidthImage(imageWidth);
    setHeightImage(imageHeight);
    const cnv = document.getElementById('canvas');
    cnv.width = imageWidth;
    cnv.height = imageHeight;
    const ctx = cnv.getContext('2d');
    const imageData = ctx.createImageData(imageWidth, imageHeight);
    for (let i = 0; i < rgba.length; i++) {
      imageData.data[i] = rgba[i];
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function displayTiff(fileDisplay) {
    fileDisplay.arrayBuffer().then((fileBuffer) => {
      let ifds = UTIF.decode(fileBuffer);
      UTIF.decodeImage(fileBuffer, ifds[0]);
      var rgba = UTIF.toRGBA8(ifds[0]); // Uint8Array with RGBA pixels
      let imageWidth = 360;
      let imageHeight = 360;
      setWidthImage(imageWidth);
      setHeightImage(imageHeight);
      const cnv = document.getElementById('canvas');
      cnv.width = imageWidth;
      cnv.height = imageHeight;
      const ctx = cnv.getContext('2d');
      let imageData = ctx.createImageData(imageWidth, imageHeight);
      // let imageData = ctx.drawImage(image, 0, 0, 380, 380);
      for (let i = 0; i < rgba.length; i++) {
        imageData.data[i] = rgba[i];
      }
      ctx.putImageData(imageData, 0, 0);
    });
  }

  useEffect(() => {
    if (props.fileNames.length > 0) {
      const fetchData = async () => {
        setFileNames(props.fileNames);
        setSelectedImageFileIndex(0);
      };
      // call the function
      fetchData();
    }
  }, [props.fileNames]);

  // useEffect(() => {
  //     if (props.fileNames.length > 0) {
  //         setFileObjs(props.fileNames);
  //         setSelectedImageFileIndex(0);

  //         // if (props.fileNames[0].type.includes("image/tiff")) {
  //             displayImage(props.fileNames[0], "tiff");
  //         // }
  //     }
  // }, [props.fileNames])

  return (
    <>
      <Row
        no-gutters="true"
        className="m-0 drop pa-5"
        style={{ maxWidth: '100%', height: '520px' }}
      >
        <Col xs={1} className="border p-0">
          <List className="border p-0" id="position-dlg-span">
            {tilingMenus.map((menuTitle, idx) => {
              return (
                <ListItemButton
                  style={{ fontSize: '12px !important' }}
                  className="border"
                  key={idx}
                  onClick={(_event) => handleListItemClick(_event, idx)}
                >
                  <ListItemText primary={menuTitle} />
                </ListItemButton>
              );
            })}
          </List>
        </Col>
        <Col xs={3} className="p-0 h-100">
          {/* Tiling Control Panel  */}
          <div className="control-panel h-100">
            {/* Editing */}
            {selectedIndex === 0 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Editing</h5>
                </CardContent>
                <div className="inside overflow-auto">
                  {fileNames !== undefined && fileNames !== null ? (
                    <List>
                      {fileNames.map((fileName, idx) => {
                        if (idx === selectedImageFileIndex) {
                          return (
                            <ListItemButton
                              style={{
                                width: 'fit-content',
                                backgroundColor: 'lightblue',
                              }}
                              className="border"
                              key={idx}
                              onClick={(_event) =>
                                handleListContentItemClick(_event, idx)
                              }
                            >
                              <p className="label-text margin-0">{fileName}</p>
                            </ListItemButton>
                          );
                        } else {
                          return (
                            <ListItemButton
                              style={{
                                width: 'fit-content',
                                backgroundColor: 'white',
                              }}
                              className="border"
                              key={idx}
                              onClick={(_event) =>
                                handleListContentItemClick(_event, idx)
                              }
                            >
                              <p className="label-text margin-0">{fileName}</p>
                            </ListItemButton>
                          );
                        }
                      })}
                    </List>
                  ) : (
                    <></>
                  )}
                </div>
              </Card>
            )}
            {/* Alignment */}
            {selectedIndex === 1 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Alignment</h5>
                </CardContent>
                <div className="inside p-3">
                  <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={(e) => {
                      handleAlignment(e);
                    }}
                    aria-label="text alignment"
                  >
                    {[...Array(6)].map((_, i) => {
                      return (
                        <Tooltip title={tilingAlignButtons[i]} key={i}>
                          <ToggleButton
                            key={i.toString() + 'ToggleButton'}
                            value={i}
                          >
                            <Image
                              value={tilingAlignButtons[i]}
                              style={{
                                ...stylingTiling.ToggleButtonGroup,
                                filter: i === 3 ? 'grayscale(1)' : '',
                              }}
                              src={alignButtonImage(i)}
                              alt="no image"
                            />
                          </ToggleButton>
                        </Tooltip>
                      );
                    })}
                  </ToggleButtonGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox onChange={handleChange} />}
                      label="Left-Right"
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleChange} />}
                      label="Up-Down"
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleChange} />}
                      label="Descending Order"
                    />
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
            )}
            {/* Bonding */}
            {selectedIndex === 2 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Bonding</h5>
                </CardContent>
                <div className="inside p-3">
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox onChange={handleChange} />}
                      label="None"
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleChange} />}
                      label="Snap To Edge"
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleChange} />}
                      label="Pattern Match"
                    />
                  </FormGroup>
                  <DialogPM />
                  {tiling_bonding_patternMatch && (
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
                      <Button
                        elevation="2"
                        className="mt-5"
                        onClick={autoPatternMathing}
                      >
                        Auto
                      </Button>
                    </Row>
                  )}
                </div>
              </Card>
            )}
            {/* Shading */}
            {selectedIndex === 3 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Shading</h5>
                </CardContent>
                <div className="inside p-3">
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={normalizeImgLuminance}
                      >
                        Normalize
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={correctLighting}
                      >
                        Correct
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card>
            )}
            {/* Display */}
            {selectedIndex === 4 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Display</h5>
                </CardContent>
                <div className="inside p-3">
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <Icon color="yellow" path={mdiWeatherSunny} size={1} />
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={decreaseImgLuminance}
                      >
                        -
                      </Button>
                      <Icon color="yellow" path={mdiWeatherSunny} size={1} />
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={increaseImgLuminance}
                      >
                        +
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={resetImgLuminance}
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={bestFit}
                      >
                        BestFit
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card>
            )}
            {/* Result */}
            {selectedIndex === 5 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Result</h5>
                </CardContent>
                <div className="inside p-3">
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <ToggleButtonGroup color="primary">
                        <ToggleButton value="true">
                          <Icon path={mdiCropFree} size={1} />
                        </ToggleButton>
                        <ToggleButton value="false">
                          <Icon path={mdiClose} size={1} />
                        </ToggleButton>
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
            )}
            {/* Option */}
            {selectedIndex === 6 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Option</h5>
                </CardContent>
              </Card>
            )}
          </div>
        </Col>
        <Col xs={5} className="p-0 h-100">
          {/*  Tiling Preview  */}
          <div style={{ flexDirection: 'column' }}>
            <div
              className="row m-0"
              style={{
                backgroundColor: '#ddd',
                height: '380px',
                width: '380px',
                overflowY: 'auto',
              }}
            >
              <RoutedAvivator type={'tiling'} />
              {/* <img id="displayCanvas" className="canvas m-auto w-100" style={{ cursor: "grab" }} src={displayImg} /> */}
              <canvas
                id="canvas"
                className="canvas m-auto"
                ref={canvasElement}
                style={{ cursor: 'grab' }}
              />
            </div>
            <div className="row m-0">
              <div className="col p-0">
                <ScrollArea />
              </div>
              <div className="col-sm-2 p-0" style={{ position: 'relative' }}>
                <Button
                  className="position-absolute"
                  style={{ height: '40px' }}
                >
                  {scale.toString() + '%'}
                  <Icon size={1} path={mdiPencil} />
                </Button>
                <Select
                  value={scale}
                  onChange={(e) => handleScaleChange(e)}
                  style={{ opacity: '0' }}
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
        <Col
          xs={3}
          className="p-0 border"
          style={{ height: '100%', position: 'relative', overflowY: 'scroll' }}
        >
          <Vessel />
          <Objective />
          <Channel />
          <ImageAdjust />
          <ZPosition />
          <Timeline />
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  content: state.files.content,
});

export default connect(mapStateToProps)(Tiling);
