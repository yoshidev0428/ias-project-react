
import React, {useRef}from 'react';
import {Row, Col} from 'react-bootstrap';
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
import {Image} from 'react-bootstrap';
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
  mdiCursorDefaultGesture
} from '@mdi/js';
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

const Tiling = (props) => {
  const [value, setValue] = React.useState(0);  
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

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    console.log(index)
  };

  const [alignment, setAlignment] = React.useState('left');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const [checked, setChecked] = React.useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const alignButtonImage = (index) => {
    return `../../../assets/images/pos_align_${index}.png`;
  };
  const tiling_bonding_patternMatch = false;
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
  const [scale, setScale] = React.useState('');

  const handleScaleChange = (event) => {
    setScale(event.target.value);
  };
  const canvasElement = useRef(null);
  return (
    <>
      <div className="drop pa-5" style={{ height:'100%'}}>
        <Row no-gutters="true">
          <Col xs={2}>
            <Card className="pa-0">
              <List>
                { tilingMenus.map((menuTitle, idx) => {
                    return<ListItemButton key={idx} onClick={(event) => handleListItemClick(event, idx)}>
                      <ListItemText primary={menuTitle}/>
                    </ListItemButton>
                })}
              </List>
            </Card>
          </Col>
          <Col xs={8} className="pa-2">
            <div className="d-flex ma-2">
              {/* Tiling Control Panel  */}
              <div className="control-panel">
                {/* Editing */}
                { selectedIndex == 0 && 
                  <Card variant="outlined">
                    <CardContent className="pa-1"><h5>Editing</h5></CardContent>
                    <div className="inside">
                      <List className="overflow-y-auto fill-height" max-height="450"></List>
                    </div>
                  </Card>
                }

                {/* Alignment */}
                { selectedIndex == 1 && 
                  <Card variant="outlined">
                    <CardContent className="pa-1"><h5>Alignment</h5></CardContent>
                    <div className="inside">
                      <ToggleButtonGroup
                        value={alignment}
                        exclusive
                        onChange={handleAlignment}
                        aria-label="text alignment"
                      >
                        {[...Array(6)].map((_,i)=>{
                          return <Tooltip title={tilingAlignButtons[i]} key={i}>
                                    {i == 3 ? <ToggleButton ><Image style={{ margin: '0 auto', width:'22px', height:'22px', filter: 'grayscale(1)' }} src={alignButtonImage(i)} alt='no image' /></ToggleButton>
                                      :<ToggleButton key={i} ><Image style={{margin: '0 auto', width:'22px', height:'22px'}} src={alignButtonImage(i)} alt='no image' /></ToggleButton>
                                    } 
                                </Tooltip >
                        })}
                        
                      </ToggleButtonGroup>
                      <FormGroup>
                        <FormControlLabel control={<Checkbox onChange={handleChange}/>} label="Left-Right" />
                        <FormControlLabel control={<Checkbox onChange={handleChange}/>} label="Up-Down" />
                        <FormControlLabel control={<Checkbox onChange={handleChange}/>} label="Descending Order" />
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
                { selectedIndex == 2 && 
                  <Card variant="outlined">
                    <CardContent className="pa-1"><h5>Bonding</h5></CardContent>
                    <div className="inside">
                      <FormGroup>
                        <FormControlLabel control={<Checkbox onChange={handleChange}/>} label="None" />
                        <FormControlLabel control={<Checkbox onChange={handleChange}/>} label="Snap To Edge" />
                        <FormControlLabel control={<Checkbox onChange={handleChange}/>} label="Pattern Match" />
                      </FormGroup>
                      <DialogPM />
                      { tiling_bonding_patternMatch && 
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
                { selectedIndex == 3 && 
                  <Card variant="outlined">
                    <CardContent className="pa-1"><h5>Shading</h5></CardContent>
                    <div className="inside">
                      <Row className="mt-4 mr-4">
                        <Col xs={6}>
                          <Button
                            className="px-0"
                            style = {{minWidth:"34px", height:'34px', color:'#009688'}}
                            onClick={normalizeImgLuminance}
                          >Normalize</Button>
                        </Col>
                      </Row>
                      <Row className="mt-4 mr-4">
                        <Col xs={6}>
                          <Button
                            className="px-0"
                            style = {{minWidth:"34px", height:'34px', color:'#009688'}}
                            onClick={correctLighting}
                          >Correct</Button>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                }

                {/* Display */}
                { selectedIndex == 4 && 
                  <Card variant="outlined">
                    <CardContent className="pa-1"><h5>Display</h5></CardContent>
                    <div className="inside">
                      <Row className="mt-4 mr-4">
                        <Col xs={6}>
                          <Icon color="yellow" path={mdiWeatherSunny} size={1}/>
                          <Button
                            className="px-0"
                            style = {{minWidth:"34px", height:'34px', color:'#009688'}}
                            onClick={decreaseImgLuminance}
                          >-</Button>
                          <Icon color="yellow" path={mdiWeatherSunny} size={1}/>
                          <Button
                            className="px-0"style = {{minWidth:"34px", height:'34px', color:'#009688'}}
                            onClick={increaseImgLuminance}
                          >+</Button>
                        </Col>
                      </Row>
                      <Row className="mt-4 mr-4">
                        <Col xs={6}>
                          <Button
                            className="px-0"style = {{minWidth:"34px", height:'34px', color:'#009688'}}
                            onClick={resetImgLuminance}
                          >Reset</Button>
                        </Col>
                      </Row>
                      <Row className="mt-4 mr-4">
                        <Col xs={6}>
                          <Button
                            className="px-0"style = {{minWidth:"34px", height:'34px', color:'#009688'}}
                            onClick={bestFit}
                          >BestFit</Button>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                }

                {/* Result */}
                { selectedIndex == 5 && 
                  <Card variant="outlined">
                    <CardContent className="pa-1"><h5>Result</h5></CardContent>
                    <div className="inside">
                      <Row className="mt-4 mr-4">
                        <Col xs={6}>
                          <ToggleButtonGroup color="primary">
                            <ToggleButton value="true">
                              <Icon path={mdiCropFree} size={1}/>
                            </ToggleButton >
                            <ToggleButton value="false">
                              <Icon path={mdiClose} size={1}/>
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
                { selectedIndex == 6 && 
                  <Card variant="outlined">
                    <CardContent className="pa-1"><h5>Option</h5></CardContent>
                    
                  </Card>
                }
              </div>
              
              {/*  Tiling Preview  */}
              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <canvas id="canvas" className="canvas" ref={canvasElement} style={{cursor:"grab"}}/>
                  </div>
                  <div className="col">
                    {/* <ScrollArea /> */}
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    {/* <ScrollArea /> */}
                  </div>
                  <div className="col-sm-2" style={{position:'relative'}}>
                    <Button className="position-absolute" style={{height: "38px"}}>
                      { scale + "%" }
                      <Icon size={1} path={mdiPencil}/>
                    </Button>
                    <Select 
                      onChange={handleScaleChange}
                      style={{opacity: "0"}}
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
            </div>
          </Col>
          <Col xs={2} className="pa-2">
            <OpenPositionViewTab />
          </Col>
        </Row>
      </div>
    </>
  )

}

export default Tiling;