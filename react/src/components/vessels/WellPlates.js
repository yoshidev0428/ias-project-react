import React, { useEffect, useState } from 'react';
import { VESSEL_WELLPLATE_RATIO, VESSEL_WELLPLATE_MAX_HEIGHT, VESSEL_WELLPLATE_MAX_FONTSIZE } from '../../utils/constants';

export default function WellPlates (props) {

    var calculateDRect = {};

    if (props.width * VESSEL_WELLPLATE_RATIO > VESSEL_WELLPLATE_MAX_HEIGHT) {
        calculateDRect.height = VESSEL_WELLPLATE_MAX_HEIGHT;
        calculateDRect.width = calculateDRect.height / VESSEL_WELLPLATE_RATIO;
    } else {
        calculateDRect.width = props.width;
        calculateDRect.height = props.width * VESSEL_WELLPLATE_RATIO;
    }

    const a_rows = props.rows + (props.showName ? 1 : 0);
    const a_cols = props.cols + (props.showName ? 1 : 0);
    let radiusCalculated =
        calculateDRect.width / a_cols > calculateDRect.height / a_rows
            ? calculateDRect.height / a_rows
            : calculateDRect.width / a_cols;

    const [showNumber, setShowNumber] = useState(props.showNumber);
    const [showName, setShowName] = useState(props.showName);
    const [width, setWidth] = useState(props.width);
    const [rows, setRows] = useState(props.rows);
    const [cols, setCols] = useState(props.cols);
    const [radious, setRadious] = useState(Math.floor(Math.floor(radiusCalculated) * 0.9));
    const [rect, setRect] = useState(calculateDRect);
    const [fontSize, setFontSize] = useState(
        radiusCalculated / 2 > VESSEL_WELLPLATE_MAX_FONTSIZE
            ? VESSEL_WELLPLATE_MAX_FONTSIZE
            : radiusCalculated / 2)

    useEffect(() => {
        if (width != props.width || rows != props.rows || cols != props.cols || showName != props.showName) {

            if (props.width * VESSEL_WELLPLATE_RATIO > VESSEL_WELLPLATE_MAX_HEIGHT) {
                calculateDRect.height = VESSEL_WELLPLATE_MAX_HEIGHT;
                calculateDRect.width = calculateDRect.height / VESSEL_WELLPLATE_RATIO;
            } else {
                calculateDRect.width = props.width;
                calculateDRect.height = props.width * VESSEL_WELLPLATE_RATIO;
            }

            const a_rows = props.rows + (props.showName ? 1 : 0);
            const a_cols = props.cols + (props.showName ? 1 : 0);
            let radiusCalculated =
                calculateDRect.width / a_cols > calculateDRect.height / a_rows
                    ? calculateDRect.height / a_rows
                    : calculateDRect.width / a_cols;

            setShowNumber(props.showNumber);
            setShowName(props.showName);
            setWidth(props.width);
            setRows(props.rows);
            setCols(props.cols);
            setRadious(Math.floor(Math.floor(radiusCalculated) * 0.9));
            setRect(calculateDRect);
            setFontSize(
                radiusCalculated / 2 > VESSEL_WELLPLATE_MAX_FONTSIZE
                    ? VESSEL_WELLPLATE_MAX_FONTSIZE
                    : radiusCalculated / 2)
        }
    }, [props]);

    const holeNumber = (r, c) => {
        r = r + 1;
        return (r - 1) * cols + c;
    }

    const renderWellPlates = () => {
        return (
            <div style={{ width: rect.width, height: rect.height }} className="d-flex flex-column">
                {
                    showName && (
                        <div className='d-inline-flex align-center justify-space-around pa-0 ma-0' style={{ width: rect.width }}>
                            {
                                [...Array(cols + 1)].map((x, i) =>
                                    <div key={'col' + i} style={{ width: radious, fontSize: fontSize }} className="pa-0 ma-0 text-center">
                                        {i == 0 ? '' : i}
                                    </div>
                                )
                            }
                        </div>
                    )
                }
                <div className='d-flex flex-column align-center justify-space-around pa-0 ma-0' style={{ width: rect.width, flex: 1 }}>
                    {
                        [...Array(rows)].map((x, r) =>
                            <div key={'row' + r} className='d-inline-flex align-center justify-space-around pa-0 ma-0' style={{ width: rect.width }}>
                                {
                                    showName && (
                                        <div style={{ width: radious, height: radious, fontSize: fontSize }} className="pa-0 ma-0 text-center">
                                            {String.fromCharCode(64 + r + 1)}
                                        </div>
                                    )
                                }
                                {
                                    [...Array(cols)].map((x, c) =>
                                        <div key={"circle" + holeNumber(r, c)} style={{ width: radious, height: radious }} className="border border-dark rounded-circle">
                                            {showNumber ? holeNumber(r, c) : ''}
                                        </div>
                                    )
                                }
                            </div>

                        )
                    }
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: rect.width, height: rect.height }} className="border border-dark rounded-0 pa-0 ma-0 text-center">
            {renderWellPlates()}
        </div>
    );
}