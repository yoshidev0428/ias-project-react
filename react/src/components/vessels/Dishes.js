import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
// import { VESSEL_DISH_MAX_SIZE, VESSEL_DISH_GAP, VESSEL_DISH_RATIO, VESSEL_DISH_MAX_HEIGHT } from '../../utils/constants';

export default function Dishes(props) {


    const [CurrentVesselID, setCurrentVesselId] = useState(1);
    const [width, setWidth] = useState("70px");
    const [height, setHeight] = useState("50px");
    // var calculateDRect = {};

    // if (props.width * VESSEL_DISH_RATIO > VESSEL_DISH_MAX_HEIGHT) {
    //     calculateDRect.height = VESSEL_DISH_MAX_HEIGHT;
    //     calculateDRect.width = calculateDRect.height / VESSEL_DISH_RATIO;
    // } else {
    //     calculateDRect.width = props.width;
    //     calculateDRect.height = props.width * VESSEL_DISH_RATIO;
    // }

    // const max_radius = calculateDRect.height - VESSEL_DISH_GAP;
    // const [selected, setSelected] = useState(false);
    // const [width, setWidth] = useState(props.width);
    // const [size, setSize] = useState(props.size);
    // const [rect, setRect] = useState(calculateDRect);
    // const [radious, setRadious] = useState(props.size > VESSEL_DISH_MAX_SIZE
    //     ? max_radius
    //     : Math.abs(Math.ceil(props.size * max_radius) / VESSEL_DISH_MAX_SIZE));

    useEffect(() => {
        console.log(props, "slide");
        if ( props.width !== undefined ) {
            setWidth(props.width);
        }
        if ( props.height !== undefined ) {
            setHeight(props.height);
        }
        if (props.vessel !== undefined && props.vessel.id !== undefined) {
            setCurrentVesselId(props.vessel.id);
        }
        // if (width !== props.width || size !== props.size) {

        //     if (props.width * VESSEL_DISH_RATIO > VESSEL_DISH_MAX_HEIGHT) {
        //         calculateDRect.height = VESSEL_DISH_MAX_HEIGHT;
        //         calculateDRect.width = calculateDRect.height / VESSEL_DISH_RATIO;
        //     } else {
        //         calculateDRect.width = props.width;
        //         calculateDRect.height = props.width * VESSEL_DISH_RATIO;
        //     }

        //     const max_radius = calculateDRect.height - VESSEL_DISH_GAP;

        //     setWidth(props.width);
        //     setSize(props.size);
        //     setRect(calculateDRect);
        //     setRadious(props.size > VESSEL_DISH_MAX_SIZE
        //         ? max_radius
        //         : Math.abs(Math.ceil(props.size * max_radius) / VESSEL_DISH_MAX_SIZE));
        // }
    }, [props]);

    return (
        // <div style={{ width: rect.width, height: rect.height }} className="border border-dark rounded-0 d-flex flex-column justify-content-center align-items-center">
        //     <div style={{ width: radious, height: radious }} className={'border border-dark rounded-circle dish-box ' + (selected ? 'selected' : '')} onClick={() => { setSelected(!selected) }}>

        //     </div>
        // </div>
        <div className="btn-group" role="group">
        {
            CurrentVesselID === 4 && <div className="btn btn-md d-flex" type="button" style={{ boxShadow: "none"}}>
                <Image style={{ margin: '0 auto', width: width, height: height }} src={"../assets/images/35dish.png"} alt='no image' />
            </div>
        }
        {
            CurrentVesselID === 5 && <div className="btn btn-md d-flex" type="button" style={{ boxShadow: "none"}}>
                <Image style={{ margin: '0 auto', width: width, height: height }} src={"../assets/images/60dish.png"} alt='no image' />
            </div>
        }
        {
            CurrentVesselID === 6 && <div className="btn btn-md d-flex" style={{ boxShadow: "none"}}>
                <Image style={{ margin: '0 auto', width: width, height: height }} src={require("../assets/images/100dish.png")} alt='no image' />
            </div>
        }
    </div>
    );
}