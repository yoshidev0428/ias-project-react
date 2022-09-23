import React, { useEffect, useState } from 'react';
import { VESSEL_DISH_MAX_SIZE, VESSEL_DISH_GAP, VESSEL_DISH_RATIO, VESSEL_DISH_MAX_HEIGHT } from '../../../../../constant/constants';

export default function Dishes(props) {

    var calculateDRect = {};
    if (props.width * VESSEL_DISH_RATIO > VESSEL_DISH_MAX_HEIGHT) {
        calculateDRect.height = VESSEL_DISH_MAX_HEIGHT;
        calculateDRect.width = calculateDRect.height / VESSEL_DISH_RATIO;
    } else {
        calculateDRect.width = props.width;
        calculateDRect.height = props.width * VESSEL_DISH_RATIO;
    }

    const max_radius = calculateDRect.height - VESSEL_DISH_GAP;
    const [selected, setSelected] = useState(false);
    const [width, setWidth] = useState(props.width);
    const [size, setSize] = useState(props.size);
    const [rect, setRect] = useState(calculateDRect);
    const [radious, setRadious] = useState(props.size > VESSEL_DISH_MAX_SIZE
        ? max_radius
        : Math.abs(Math.ceil(props.size * max_radius) / VESSEL_DISH_MAX_SIZE));


    useEffect(() => {
        if (width !== props.width || size !== props.size) {
            if (props.width * VESSEL_DISH_RATIO > VESSEL_DISH_MAX_HEIGHT) {
                calculateDRect.height = VESSEL_DISH_MAX_HEIGHT;
                calculateDRect.width = calculateDRect.height / VESSEL_DISH_RATIO;
            } else {
                calculateDRect.width = props.width;
                calculateDRect.height = props.width * VESSEL_DISH_RATIO;
            }

            const max_radius = calculateDRect.height - VESSEL_DISH_GAP;

            setWidth(props.width);
            setSize(props.size);
            setRect(calculateDRect);
            setRadious(props.size > VESSEL_DISH_MAX_SIZE
                ? max_radius
                : Math.abs(Math.ceil(props.size * max_radius) / VESSEL_DISH_MAX_SIZE));
        }
    }, [props]);


    const renderDishes = () => {
        return (
            <div style={{ width: rect.width, height: rect.height }} className="border border-dark rounded-0 d-flex flex-column justify-content-center align-items-center">
                <div style={{ width: radious, height: radious }} className={'border border-dark rounded-circle wafer-box ' + (selected ? 'selected' : '')} onClick={() => { setSelected(!selected) }}>
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