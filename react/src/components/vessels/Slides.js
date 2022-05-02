import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
// import { VESSEL_SLIDE_H_RATIO, VESSEL_SLIDE_MAX_HEIGHT, VESSEL_SLIDE_V_RATIO } from '../../utils/constants';
export default function Slides(props) {

    const [CurrentVesselID, setCurrentVesselId] = useState(1);
    const [width, setWidth] = useState("70px");
    const [height, setHeight] = useState("50px");

    useEffect(() => {
        if ( props.width !== undefined ) {
            setWidth(props.width);
        }
        if ( props.height !== undefined ) {
            setHeight(props.height);
        }
        if (props.vessel !== undefined && props.vessel.id !== undefined) {
            setCurrentVesselId(props.vessel.id);
        }
    }, [props]);

    return (
        <div className="btn-group" role="group">
            {
                CurrentVesselID === 1 && <div className="btn btn-md d-flex" type="button" style={{ boxShadow: "none"}}>
                    <Image style={{ margin: '0 auto', width: width, height: height }} src={"../assets/images/slide_single.png"} alt='no image' />
                </div>
            }
            {
                CurrentVesselID === 2 && <div className="btn btn-md d-flex" type="button" style={{ boxShadow: "none"}}>
                    <Image style={{ margin: '0 auto', width: width, height: height }} src={"../assets/images/slide_double.png"} alt='no image' />
                </div>
            }
            {
                CurrentVesselID === 3 && <div className="btn btn-md d-flex" style={{ boxShadow: "none"}}>
                    <Image style={{ margin: '0 auto', width: width, height: height }} src={require("../assets/images/slide_4.png")} alt='no image' />
                </div>
            }
        </div>
    );
}