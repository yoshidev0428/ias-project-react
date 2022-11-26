import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import { useFlagsStore } from "../../../../state"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import {useState} from "react"
import Typography from "@mui/material/Typography"
import PropTypes from "prop-types"
import {Row, Col, Button, Image} from 'react-bootstrap'
import imgTissueNet from "../../../../../assets/cell/tissue_net.png"
import imgNuchel from "../../../../../assets/cell/nuchel.png"
import imgCyto from "../../../../../assets/cell/cyto.png"
import imgLayer from "../../../../../assets/cell/layer.png"
import imgWafer from "../../../../../assets/cell/wafer.png"
import CellposeDialog from "./CellposeDialog"
function TabContainer(props) {
    return (
        <Typography component="div" style={{padding: 0}}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const BasicDialog = () => {
    const DialogCellposeFlag = useFlagsStore(store => store.DialogCellposeFlag)
    const DialogBasicFlag = useFlagsStore(store => store.DialogBasicFlag)
    const showCellposeDialog = () => {
        useFlagsStore.setState({ DialogBasicFlag: false })
        useFlagsStore.setState({ DialogCellposeFlag: true })
    }
    const close = () => {
        useFlagsStore.setState({ DialogBasicFlag: false })
        console.log("flag Status--->" + DialogBasicFlag)
    };

    const [rightTabVal, setRightTabVal] = useState(0)
    const handleRightTabChange = (newValue) => {
        setRightTabVal(newValue);
    }

    return (
        <>
            <Dialog open={DialogBasicFlag} onClose={close} maxWidth={"450"} >
                <div className="d-flex border-bottom">
                    <DialogTitle>Method Select</DialogTitle>
                    <button className="dialog-close-btn" color="primary" onClick={close}>&times;</button>
                </div>
                <div className='mx-3 my-2' style={{ width: 450 }}>
                    <Row>
                        <Col xs={12}>
                            <div className='card border'>
                                <Tabs value={rightTabVal}>
                                    <Tab style={{fontSize: "12px"}} className="p-1" label="Tissue" onFocus={() => handleRightTabChange(0)} />
                                    <Tab style={{fontSize: "12px"}} className="p-1" label="Cell" onFocus={() => handleRightTabChange(1)} />
                                    <Tab style={{fontSize: "12px"}} className="p-1" label="Material" onFocus={() => handleRightTabChange(2)} />
                                    <Tab style={{fontSize: "12px"}} className="p-1" label="Semicon" onFocus={() => handleRightTabChange(3)} />
                                </Tabs>
                                {rightTabVal === 0 && <TabContainer>
                                    <div className="p-3">
                                        <div style={{width: "65px"}}>
                                            <div className="border">
                                                <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgTissueNet} alt='no image' />
                                            </div>
                                            <div className="label-text text-center">TissueNet</div>
                                        </div>
                                    </div>
                                </TabContainer>}
                                {rightTabVal === 1 && <TabContainer>
                                    <div className="p-3 d-flex">
                                        <div style={{width: "65px"}} className="mr-2">
                                            <div className="border">
                                                <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgNuchel} alt='no image' />
                                            </div>
                                            <div className="label-text text-center">Nuchel</div>
                                        </div>
                                        <div style={{width: "65px"}}>
                                            <div className="border">
                                                <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgCyto} alt='no image' />
                                            </div>
                                            <div className="label-text text-center">Cyto</div>
                                        </div>
                                    </div>
                                </TabContainer>}
                                {rightTabVal === 2 && <TabContainer>
                                    <div className="p-3">
                                        <div style={{width: "65px"}}>
                                            <div className="border">
                                                <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgLayer} alt='no image' />
                                            </div>
                                            <div className="label-text text-center">Layer</div>
                                        </div>
                                    </div>
                                </TabContainer>}
                                {rightTabVal === 3 && <TabContainer>
                                    <div className="p-3">
                                        <div style={{width: "65px"}}>
                                            <div className="border">
                                                <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgWafer} alt='no image' />
                                            </div>
                                            <div className="label-text text-center">Wafer</div>
                                        </div>
                                    </div>
                                </TabContainer>}
                            </div>
                        </Col>
                    </Row>

                </div>
                <div className='border-top mt-2'>
                    <DialogActions>
                        <Button variant="contained" onClick={showCellposeDialog}>Custom</Button>
                        <Button variant="contained" onClick={close}>Cancel</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    )
}
export default BasicDialog