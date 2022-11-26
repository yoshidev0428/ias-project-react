import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import {useFlagsStore} from "../../../../state"
import {Row, Col, Button, Form, Image} from 'react-bootstrap'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import LinearProgress from '@mui/material/LinearProgress'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Paper from '@mui/material/Paper'
import Draggable from 'react-draggable'

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

function valuetext(value) {
    return `${value}°C`;
}

const minDistance = 1;

const CellposeDialog = () => {

    const DialogCellposeFlag = useFlagsStore(store => store.DialogCellposeFlag)

    const close = () => {
        useFlagsStore.setState({DialogCellposeFlag: false})
        console.log("flag Status--->" + DialogCellposeFlag)
    };

    const action = () => {
        console.log("flag Status---> Action")
    };

    const viewOptions = [
        {label: "RGB", value: "rgb"},
        {label: "red=R", value: "r"},
        {label: "green=G", value: "g"},
        {label: "blue=B", value: "b"},
        {label: "gray", value: "gray"},
        {label: "spectral", value: "spectral"},
    ]

    const [viewValue, setViewValue] = React.useState('image')

    const handleChangeViewValue = (event) => {
        setViewValue(event.target.value)
    }

    const [brushSize, setBrushSize] = React.useState(3)

    const handleChangeBrushSize = (event) => {
        setBrushSize(event.target.value)
    }
    const [segment, setSegment] = React.useState(0)

    const handleChangeSegment = (event) => {
        setSegment(event.target.value)
    }
    const [chan2, setChan2] = React.useState(0)

    const handleChangeChan2 = (event) => {
        setChan2(event.target.value)
    }
    const [rois, setRois] = React.useState(0)

    const handleChangeRois = (event) => {
        setRois(event.target.value)
    }

    const [progress, setProgress] = React.useState(0)

    // React.useEffect(() => {
    //     const timer = setInterval(() => {
    //         setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10))
    //         setRois((prevRois) => (prevRois >= 100 ? 0 : prevRois + 10))
    //     }, 800)
    //     return () => {
    //         clearInterval(timer)
    //     }
    // }, [])

    const [value1, setValue1] = React.useState([20, 37])

    const handleChange1 = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return
        }

        if (activeThumb === 0) {
            setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]])
        } else {
            setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)])
        }
    }

    function PaperComponent(props) {
        return (
            <Draggable
                handle="#draggable-dialog-title"
                cancel={'[class*="MuiDialogContent-root"]'}
            >
                <Paper {...props} />
            </Draggable>
        );
    }

    return (
        <>
            <Dialog open={DialogCellposeFlag} onClose={close} PaperComponent={PaperComponent} hideBackdrop={true} onBackdropClick="false"
                    disableScrollLock aria-labelledby="draggable-dialog-title" maxWidth={"450"} maxHeight={"800"}>
                <div className="d-flex border-bottom">
                    <DialogTitle>Window Name</DialogTitle>
                    <button className="dialog-close-btn" color="primary" onClick={close}>&times;</button>
                </div>
                <div className='mx-3 my-2' style={{width: 350}}>
                    <Row>
                        <Col xs={12}>
                            <div className="pt-3 px-3 pb-1 border-bottom">
                                <h6>Views</h6>
                                <div>
                                    {/*<Row className="mt-3">*/}
                                    {/*    <Col xs={6}>*/}
                                    {/*        <Autocomplete*/}
                                    {/*            disablePortal*/}
                                    {/*            id="combo-box-demo"*/}
                                    {/*            options={viewOptions}*/}
                                    {/*            sx={{width: 300}}*/}
                                    {/*            renderInput={(params) => <TextField {...params}*/}
                                    {/*                                                label="[up/down or W/S]]"/>}*/}
                                    {/*        />*/}
                                    {/*    </Col>*/}
                                    {/*    <Col xs={6} className="mt-1">*/}
                                    {/*        <p className="ml-3">[press R/G/B to toggle RGB and color]</p>*/}
                                    {/*    </Col>*/}
                                    {/*</Row>*/}
                                    <Row className="mt-3">
                                        <Col xs={12} className="text-left">
                                            <FormControl>
                                                <FormLabel
                                                    id="demo-row-radio-buttons-group-label">[pageup/down]</FormLabel>
                                                <RadioGroup
                                                    row aria-labelledby="demo-row-radio-buttons-group-label"
                                                    value={viewValue}
                                                    onChange={handleChangeViewValue}
                                                    name="row-radio-buttons-group">
                                                    <FormControlLabel value="image" control={<Radio/>} label="image"/>
                                                    <FormControlLabel value="gradxy" control={<Radio/>} label="gradXY"/>
                                                    <FormControlLabel value="cellprob" control={<Radio/>}
                                                                      label="cellprob"/>
                                                    <FormControlLabel value="gradz" control={<Radio/>} label="gradZ"/>
                                                </RadioGroup>
                                            </FormControl>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <div className="pt-3 px-3 pb-1 border-bottom">
                                <h6>Drawing</h6>
                                <div>
                                    <Row className="mt-3">
                                        <Col xs={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="brush-label">brush size</InputLabel>
                                                <Select
                                                    labelId="brush-label"
                                                    id="brush-select"
                                                    value={brushSize}
                                                    label="brush size"
                                                    onChange={handleChangeBrushSize}>
                                                    <MenuItem value={1}>1</MenuItem>
                                                    <MenuItem value={3}>3</MenuItem>
                                                    <MenuItem value={5}>5</MenuItem>
                                                    <MenuItem value={7}>7</MenuItem>
                                                    <MenuItem value={9}>9</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Col>
                                        <Col xs={6}>
                                            <FormControlLabel className="mt-2" disabled
                                                              control={<Checkbox defaultChecked/>}
                                                              label="single stroke"/>
                                        </Col>
                                        <Col xs={6} className="pr-0">
                                            <FormControlLabel className="mt-2" control={<Checkbox defaultChecked/>}
                                                              label="MASKS ON [X]"/>
                                        </Col>
                                        <Col xs={6} className="pr-0">
                                            <FormControlLabel className="mt-2" control={<Checkbox/>}
                                                              label="outlines on [Z]"/>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <div className="pt-2 px-3 pb-1 border-bottom">
                                <Row>
                                    <Col xs={6}>
                                        <h6 className="mt-2">Segmentation</h6>
                                    </Col>
                                    {/*<Col xs={6}>*/}
                                    {/*    <FormControlLabel control={<Checkbox/>} label="use GPU"/>*/}
                                    {/*</Col>*/}
                                </Row>
                                <Row className="mt-0">
                                    <Col xs={12}>
                                        <Form.Label>cell diameter (pixels)</Form.Label>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Control type="number"/>
                                    </Col>
                                    <Col xs={6}>
                                        <Button variant="primary">callbrate</Button>
                                    </Col>
                                    <Col xs={6} className="mt-3">
                                        <FormControl fullWidth>
                                            <InputLabel id="segment-label">chan to segment</InputLabel>
                                            <Select
                                                labelId="segment-label"
                                                id="segment-label-select"
                                                value={segment}
                                                label="chan to segment"
                                                onChange={handleChangeSegment}>
                                                <MenuItem value={0}>0: gray</MenuItem>
                                                <MenuItem value={1}>1: red</MenuItem>
                                                <MenuItem value={2}>2: green</MenuItem>
                                                <MenuItem value={3}>3: blue</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Col>
                                    <Col xs={6} className="mt-3">
                                        <FormControl fullWidth>
                                            <InputLabel id="chan2-label">chan2 (optional)</InputLabel>
                                            <Select
                                                labelId="chan2-label"
                                                id="chan2-select"
                                                value={chan2}
                                                label="chan2 (optional)"
                                                onChange={handleChangeChan2}>
                                                <MenuItem value={0}>0: none</MenuItem>
                                                <MenuItem value={1}>1: red</MenuItem>
                                                <MenuItem value={2}>2: green</MenuItem>
                                                <MenuItem value={3}>3: blue</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Col>
                                    <Col xs={6} className="mt-3">
                                        <Form.Label className="mt-1">flow_threshold</Form.Label>
                                    </Col>
                                    <Col xs={6} className="mt-3">
                                        <Form.Control type="text"/>
                                    </Col>
                                    <Col xs={6} className="mt-3">
                                        <Form.Label className="mt-1">cellprob_threshold</Form.Label>
                                    </Col>
                                    <Col xs={6} className="mt-3">
                                        <Form.Control type="text"/>
                                    </Col>
                                    <Col xs={6} className="mt-3">
                                        <Form.Label className="mt-1">stitch_threshold</Form.Label>
                                    </Col>
                                    <Col xs={6} className="mt-3">
                                        <Form.Control type="text"/>
                                    </Col>
                                </Row>
                                {/*<Row className="mt-2 border pb-2">*/}
                                {/*    <Col xs={12}>*/}
                                {/*        <Row>*/}
                                {/*            <Col xs={12}>*/}
                                {/*                <p className="mb-0">model zoo</p>*/}
                                {/*            </Col>*/}
                                {/*            <Col xs={12}>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">cyto</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">nuclei</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">tissuenet</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">livecell</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">cyto2</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">CP</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-0 mt-2">CPx</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">TN1</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">TN2</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">TN3</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">LC1</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">LC2</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">LC3</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">LC4</Button>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">compute style and run suggested model</Button>*/}
                                {/*            </Col>*/}
                                {/*        </Row>*/}
                                {/*    </Col>*/}
                                {/*</Row>*/}
                                {/*<Row className="mt-2 border pb-2">*/}
                                {/*    <Col xs={12}>*/}
                                {/*        <Row>*/}
                                {/*            <Col xs={12} className="mb-2">*/}
                                {/*                <p className="mb-0">custom models</p>*/}
                                {/*            </Col>*/}
                                {/*            <Col xs={8}>*/}
                                {/*                <FormControl fullWidth>*/}
                                {/*                    <InputLabel id="custom-model">select custom model</InputLabel>*/}
                                {/*                    <Select value={1} labelId="custom-model" label="select custom model">*/}
                                {/*                        <MenuItem value={1}>select custom model</MenuItem>*/}
                                {/*                    </Select>*/}
                                {/*                </FormControl>*/}
                                {/*            </Col>*/}
                                {/*            <Col xs={4}>*/}
                                {/*                <Button variant="outline-primary" className="mr-3 mt-2">run model</Button>*/}
                                {/*            </Col>*/}
                                {/*        </Row>*/}
                                {/*    </Col>*/}
                                {/*</Row>*/}
                                <Row className="mt-2 pb-2">
                                    <Col xs={4}>
                                       <p><span className="mr-2">{rois}</span><span>ROIS</span></p>
                                    </Col>
                                    <Col xs={8}>
                                        <LinearProgressWithLabel value={progress} />
                                    </Col>
                                </Row>
                            </div>
                            <div className="pt-3 px-3 pb-1 border-bottom">
                                <h6>Image saturation</h6>
                                <div>
                                    <Row className="mt-3">
                                        <Col xs={6}>
                                            <FormControlLabel className="mt-1"
                                                              control={<Checkbox defaultChecked/>}
                                                              label="auto adjust"/>
                                        </Col>
                                        <Col xs={6}>
                                            <Slider
                                                className="mt-2"
                                                getAriaLabel={() => 'Minimum distance'}
                                                value={value1}
                                                onChange={handleChange1}
                                                valueLabelDisplay="auto"
                                                getAriaValueText={valuetext}
                                                disableSwap
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col xs={12}>
                                            <Row className="mt-3">
                                                <Col xs={6} style={{display: "grid"}}>
                                                    <FormControlLabel className="mt-1"
                                                                      control={<Checkbox/>}
                                                                      label="orthoviews"/>
                                                    <FormControlLabel className="mt-1"
                                                                      control={<Checkbox defaultChecked/>}
                                                                      label="scale disk on"/>
                                                </Col>
                                                <Col xs={6}>
                                                    <Row>
                                                        <Col xs={6} className="mt-3 text-right p-0">
                                                            <Form.Label className="mt-1">ortho dz:</Form.Label>
                                                        </Col>
                                                        <Col xs={6} className="mt-3 pr-0">
                                                            <Form.Control type="text"/>
                                                        </Col>
                                                        <Col xs={6} className="mt-3 text-right p-0">
                                                            <Form.Label className="mt-1">z-aspect:</Form.Label>
                                                        </Col>
                                                        <Col xs={6} className="mt-3 pr-0">
                                                            <Form.Control type="text"/>
                                                        </Col>
                                                        <Col xs={6} className="mt-3 text-right p-0">
                                                            <Form.Label className="mt-1">Z:</Form.Label>
                                                        </Col>
                                                        <Col xs={6} className="mt-3 pr-0">
                                                            <Form.Control type="text"/>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                {/*<div className='border-top mt-2'>*/}
                {/*    <DialogActions>*/}
                {/*        <Button variant="contained" onClick={action}>Set</Button>*/}
                {/*        <Button variant="contained" onClick={close}>Cancel</Button>*/}
                {/*    </DialogActions>*/}
                {/*</div>*/}
            </Dialog>
        </>
    )
}
export default CellposeDialog