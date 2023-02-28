import React, { useEffect, useState } from 'react';
import { VESSEL_WAFER_RATIO, VESSEL_WAFER_MAX_HEIGHT, VESSEL_WAFER_GAP, VESSEL_WAFER_MAX_SIZE } from '../../../../../constant/constants';
// import store from "../../../../../../reducers";
export default function Wafers(props) {

    const areaRatio = props.areaPercentage * 0.01;

    var calculateDRect = {};
    if (props.width * VESSEL_WAFER_RATIO > VESSEL_WAFER_MAX_HEIGHT) {
        calculateDRect.height = VESSEL_WAFER_MAX_HEIGHT;
        calculateDRect.width = calculateDRect.height / VESSEL_WAFER_RATIO;
    } else {
        calculateDRect.width = props.width;
        calculateDRect.height = props.width * VESSEL_WAFER_RATIO;
    }
    const [selected, setSelected] = useState(false);
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
          <div
            style={{ width: rect.width, height: rect.height }}
            className="border border-dark rounded-0 d-flex flex-column justify-content-center align-items-center"
          >
            <div
              style={{
                width: radious,
                height: radious,
                zIndex: "100",
                position: "relative",
              }}
              className={
                "border border-dark rounded-circle wafer-box " +
                (selected ? "selected" : "")
              }
              onClick={() => {
                setSelected(!selected);
              }}
            ></div>
            {props.showHole ? (
              <div
                style={{
                  width: radious * areaRatio,
                  height: radious * areaRatio,
                  backgroundColor: "#00a0e9",
                  position: "absolute",
                }}
              ></div>
            ) : (
              <></>
            )}
          </div>
        );
    }

    return (
        <div>
            {renderDishes()}
        </div>
    );
}