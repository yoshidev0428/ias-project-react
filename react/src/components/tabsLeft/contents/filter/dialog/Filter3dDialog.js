import React, {useState} from 'react';
import {Row, Button, Col} from 'react-bootstrap';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from "../../../../state";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import {styled} from "@mui/material/styles";
import MuiInput from "@mui/material/Input";
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';

const Input = styled(MuiInput)`
  width: 42px;
`;

const Filter3dDialog = () => {

    const DialogFilter3dflag = useFlagsStore(store => store.DialogFilter3dflag);

    const close = () => {
        useFlagsStore.setState({ DialogFilter3dflag: false });
    };

    const action = () => {
        console.log("flag Status---> Action");
    };

    //slider changing
    const [value, setValue] = useState(30);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 100) {
            setValue(100);
        }
    };

    //item select
    const [selected, setSelected] = useState([]);

    const onChange = (selected) => {
        setSelected(selected);
    };
    const options = [
        {
            label: 'Convolution',
            options: [
                { value: 'Low pass', label: 'Low pass' },
                { value: 'High pass', label: 'High pass' },
                { value: 'Gauss', label: 'Gauss' },
                { value: 'Edge+', label: 'Edge+' },
                { value: 'Edge-', label: 'Edge-' },
                { value: 'Median', label: 'Median' },
                { value: 'Rank', label: 'Rank' },
            ],
        },
        {
            label: 'Morphological',
            options: [
                { value: 'Cutting', label: 'Cutting' },
                { value: 'Connection', label: 'Connection' },
                { value: 'Contraction', label: 'Contraction' },
                { value: 'Distance map', label: 'Distance map' },
                { value: 'Watershed', label: 'Watershed' },
                { value: 'Gray Watershed', label: 'Gray Watershed' },
                { value: 'Thinning', label: 'Thinning' },
                { value: 'Pruning', label: 'Pruning' },
                { value: 'End Point', label: 'End Point' },
                { value: 'Degeneration', label: 'Degeneration' },
                { value: 'Top hat+', label: 'Top hat+' },
                { value: 'Top hat-', label: 'Top hat-' },
                { value: 'Ring top hat', label: 'Ring top hat' },
                { value: 'Slope', label: 'Slope' },
                { value: 'Great', label: 'Great' },
                { value: 'Reduction', label: 'Reduction' },
            ],
        },
        {
            label: 'Kernel',
            options: [
                { value: 'Convolution', label: 'Convolution' },
                { value: 'Morphological', label: 'Morphological' },
            ],
        },
    ];


    return (
        <>
            <Dialog open={DialogFilter3dflag} onClose={close} maxWidth={"610"} >
                <div className="d-flex border-bottom">
                    <DialogTitle>3D Filter</DialogTitle>
                    <button className="dialog-close-btn" color="primary" onClick={close}>&times;</button>
                </div>
                <div className='d-flex justify-content-around p-2' style={{ width: 600, overflowY: "scroll", overflowX: "hidden" }}>
                    <div style={{ width: "100%", height: "100%" }}>
                        <Row>
                            <Col>
                                <p className='px-3'>Candidate</p>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <DualListBox
                                    className="min_height-250"
                                    options={options}
                                    selected={selected}
                                    onChange={onChange}
                                    icons={{
                                        moveLeft: <KeyboardArrowLeftIcon />,
                                        moveAllLeft: <DeleteIcon />,
                                        moveRight: <KeyboardArrowRightIcon />,
                                        moveAllRight: <KeyboardDoubleArrowRightIcon />
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col xs={6}></Col>
                            <Col xs={6}>
                                <Row>
                                    <Col>
                                        <div className='border mb-3 p-3'>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item>
                                                    <label>Strength</label>
                                                </Grid>
                                                <Grid item xs>
                                                    <Slider
                                                        value={typeof value === 'number' ? value : 0}
                                                        onChange={handleSliderChange}
                                                        aria-labelledby="input-slider"
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Input
                                                        value={value}
                                                        size="small"
                                                        onChange={handleInputChange}
                                                        onBlur={handleBlur}
                                                        inputProps={{
                                                            step: 10,
                                                            min: 0,
                                                            max: 100,
                                                            type: 'number',
                                                            'aria-labelledby': 'input-slider',
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid item>
                                                    <label>Number of Times</label>
                                                </Grid>
                                                <Grid item>
                                                    <Input
                                                        size="small"
                                                        inputProps={{
                                                            min: 0,
                                                            max: 10,
                                                            type: 'number',
                                                            'aria-labelledby': 'input-slider',
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </div>
                </div>
                <div className='border-top mt-2'>
                    <DialogActions>
                        <Button className="" variant="contained" color="dark" size="medium" onClick={close}>Cancel</Button>
                        <Button className="" variant="contained" color="success" size="medium" onClick={action}>Set</Button>
                        <Button className="" variant="contained" color="success" size="medium" onClick={action}>Set All</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    );
}
export default Filter3dDialog;