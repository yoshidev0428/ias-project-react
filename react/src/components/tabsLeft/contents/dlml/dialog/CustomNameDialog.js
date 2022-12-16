import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import { useFlagsStore } from "../../../../state"
import {Row, Col, Button, Form, Image} from 'react-bootstrap'
import imgTissueNet from "../../../../../assets/cell/tissue_net.png"
import imgNuchel from "../../../../../assets/cell/nuchel.png"
import imgCyto from "../../../../../assets/cell/cyto.png"
import imgLayer from "../../../../../assets/cell/layer.png"
import imgWafer from "../../../../../assets/cell/wafer.png"
import imgAnimal from "../../../../../assets/cell/animal.png"
import imgBacteria from "../../../../../assets/cell/bacteria.png"
import imgHuman from "../../../../../assets/cell/human.png"
import imgStem from "../../../../../assets/cell/embryonic_stem.png"


const CustomNameDialog = () => {

    const DialogCustomNameFlag = useFlagsStore(store => store.DialogCustomNameFlag)

    const close = (event, reason) => {
			if (reason != "backdropClick") {
			  useFlagsStore.setState({ DialogCellposeFlag: true })
        useFlagsStore.setState({ DialogCustomNameFlag: false })
        console.log("flag Status--->" + DialogCustomNameFlag)
			}
    };

    const action = () => {
        console.log("flag Status---> Action")
        useFlagsStore.setState({ DialogCustomNameFlag: false })
				useFlagsStore.setState({ DialogCustomFlag: true })
    };

		const handleBackdropClick = (e) => {
			//these fail to keep the modal open
			e.stopPropagation();
			return false;
		};

    return (
        <>
            <Dialog open={DialogCustomNameFlag} onClose={close} maxWidth={"450"} onBackdropClick={handleBackdropClick} >
                <div className="d-flex border-bottom">
                    <DialogTitle>Custom Name</DialogTitle>
                    <button className="dialog-close-btn" color="primary" onClick={close}>&times;</button>
                </div>
                <div className='mx-3 my-2' style={{ width: 450 }}>
                    <Row>
                        <Col xs={12}>
                            <div className="p-3">
                                <h6>Select</h6>
                                <div>
                                    <Row className="my-3">
                                        <Col xs={3} className="text-right">
                                            <p className="mb-0 mt-1">Name</p>
                                        </Col>
                                        <Col xs={9}>
                                            <Form.Control placeholder=""/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={3} className="text-right">
                                            <p className="mb-0 mt-1">Icon</p>
                                        </Col>
                                        <Col xs={9}>
                                            <div className="border overflow-auto d-flex p-2">
                                                <div className="border mr-2">
                                                    <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgTissueNet} alt='no image' />
                                                </div>
                                                <div className="border mr-2">
                                                    <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgNuchel} alt='no image' />
                                                </div>
                                                <div className="border mr-2">
                                                    <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgCyto} alt='no image' />
                                                </div>
                                                <div className="border mr-2">
                                                    <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgLayer} alt='no image' />
                                                </div>
                                                <div className="border mr-2">
                                                    <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgWafer} alt='no image' />
                                                </div>
                                                <div className="border mr-2">
                                                    <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgAnimal} alt='no image' />
                                                </div>
                                                <div className="border mr-2">
                                                    <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgBacteria} alt='no image' />
                                                </div>
                                                <div className="border mr-2">
                                                    <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgHuman} alt='no image' />
                                                </div>
                                                <div className="border">
                                                    <Image style={{ margin: '0 auto', width: '65px', height: '65px' }} src={imgStem} alt='no image' />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>

                </div>
                <div className='border-top mt-2'>
                    <DialogActions>
                        <Button variant="contained" onClick={action}>Register</Button>
                        <Button variant="contained" onClick={close}>Cancel</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    )
}
export default CustomNameDialog