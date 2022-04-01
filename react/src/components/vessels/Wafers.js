import React, { useEffect, useState } from 'react';
import { VESSEL_WAFER_RATIO, VESSEL_WAFER_MAX_HEIGHT, VESSEL_WAFER_GAP, VESSEL_WAFER_MAX_SIZE } from '../../utils/constants';

export default function Wafers (props) {

    var calculateDRect = {};

    if (props.width * VESSEL_WAFER_RATIO > VESSEL_WAFER_MAX_HEIGHT) {
        calculateDRect.height = VESSEL_WAFER_MAX_HEIGHT;
        calculateDRect.width = calculateDRect.height / VESSEL_WAFER_RATIO;
    } else {
        calculateDRect.width = props.width;
        calculateDRect.height = props.width * VESSEL_WAFER_RATIO;
    }

    const max_radius = calculateDRect.height - VESSEL_WAFER_GAP;
    const [width, setWidth] = useState(props.width);
    const [size, setSize] = useState(props.size);
    const [rect, setRect] = useState(calculateDRect);
    const [radious, setRadious] = useState(props.size > VESSEL_WAFER_MAX_SIZE
        ? max_radius
        : Math.abs(Math.ceil(props.size * max_radius) / VESSEL_WAFER_MAX_SIZE));

    useEffect(() => {
        if (width !== props.width || size !== props.size) {

            if (props.width * VESSEL_WAFER_RATIO > VESSEL_WAFER_MAX_HEIGHT) {
                calculateDRect.height = VESSEL_WAFER_MAX_HEIGHT;
                calculateDRect.width = calculateDRect.height / VESSEL_WAFER_RATIO;
            } else {
                calculateDRect.width = props.width;
                calculateDRect.height = props.width * VESSEL_WAFER_RATIO;
            }

            const max_radius = calculateDRect.height - VESSEL_WAFER_GAP;
            setWidth(props.width);
            setSize(props.size);
            setRect(calculateDRect);
            setRadious(props.size > VESSEL_WAFER_MAX_SIZE
                ? max_radius
                : Math.abs(Math.ceil(props.size * max_radius) / VESSEL_WAFER_MAX_SIZE));
        }
    }, [props]);

    const renderDishes = () => {
        return (
            <div style={{ width: rect.width, height: rect.height }} className="border border-dark rounded-0 d-flex flex-column justify-content-center align-items-center">
                <div style={{ width: radious, height: radious }} className="border border-dark rounded-circle">

                </div>
            </div>
        );
    }

    return (
        <div>
            {renderDishes()}
        </div>
    );
}