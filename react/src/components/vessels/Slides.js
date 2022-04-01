import { height } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { VESSEL_SLIDE_H_RATIO, VESSEL_SLIDE_MAX_HEIGHT, VESSEL_SLIDE_V_RATIO } from '../../utils/constants';

export default function Slides(props) {

    var calculateDRect = {};
    var calculateDSlide = {};

    if (props.count < 3) {
        if (props.width * VESSEL_SLIDE_H_RATIO > VESSEL_SLIDE_MAX_HEIGHT) {
            calculateDRect = {
                width: height / VESSEL_SLIDE_H_RATIO,
                height: VESSEL_SLIDE_MAX_HEIGHT
            };
        } else {
            calculateDRect = {
                width: props.width - 40,
                height: props.width * VESSEL_SLIDE_H_RATIO
            };
        }

        const MAX_HEIGHT = calculateDRect.height / 3;

        const one_height =
            (calculateDRect.height - (props.count - 1) * 20) / props.count;
        if (one_height > MAX_HEIGHT) {
            calculateDSlide = {
                width: calculateDRect.width,
                height: MAX_HEIGHT
            };
        } else {
            calculateDSlide = {
                width: calculateDRect.width,
                height: one_height
            };
        }
    } else {
        if (props.width * VESSEL_SLIDE_V_RATIO > VESSEL_SLIDE_MAX_HEIGHT) {
            calculateDRect = {
                width: height / VESSEL_SLIDE_V_RATIO,
                height: VESSEL_SLIDE_MAX_HEIGHT
            };
        } else {
            calculateDRect = {
                width: props.width,
                height: props.width * VESSEL_SLIDE_V_RATIO
            };
        }

        const MAX_WIDTH = calculateDRect.height / 3;

        const one_width =
            (calculateDRect.width - (props.count - 1) * 20) / props.count;
        if (one_width > MAX_WIDTH) {
            calculateDSlide = {
                width: MAX_WIDTH,
                height: calculateDRect.height
            };
        } else {
            calculateDSlide = {
                width: one_width,
                height: calculateDRect.height
            };
        }
    }

    const [width, setWidth] = useState(props.width);
    const [count, setCount] = useState(props.count == NaN ? 0 : props.count);
    const [showNumber, setShowNumber] = useState(props.showNumber);
    const [rect, setRect] = useState(calculateDRect);
    const [slide, setSlide] = useState(calculateDSlide);

    useEffect(() => {
        if (width !== props.width || count !== props.count || showNumber !== props.showNumber) {

            if (props.count < 3) {
                if (props.width * VESSEL_SLIDE_H_RATIO > VESSEL_SLIDE_MAX_HEIGHT) {
                    calculateDRect = {
                        width: height / VESSEL_SLIDE_H_RATIO,
                        height: VESSEL_SLIDE_MAX_HEIGHT
                    };
                } else {
                    calculateDRect = {
                        width: props.width - 40,
                        height: props.width * VESSEL_SLIDE_H_RATIO
                    };
                }

                const MAX_HEIGHT = calculateDRect.height / 3;

                const one_height =
                    (calculateDRect.height - (props.count - 1) * 20) / props.count;
                if (one_height > MAX_HEIGHT) {
                    calculateDSlide = {
                        width: calculateDRect.width,
                        height: MAX_HEIGHT
                    };
                } else {
                    calculateDSlide = {
                        width: calculateDRect.width,
                        height: one_height
                    };
                }
            } else {
                if (props.width * VESSEL_SLIDE_V_RATIO > VESSEL_SLIDE_MAX_HEIGHT) {
                    calculateDRect = {
                        width: height / VESSEL_SLIDE_V_RATIO,
                        height: VESSEL_SLIDE_MAX_HEIGHT
                    };
                } else {
                    calculateDRect = {
                        width: props.width,
                        height: props.width * VESSEL_SLIDE_V_RATIO
                    };
                }

                const MAX_WIDTH = calculateDRect.height / 3;

                const one_width =
                    (calculateDRect.width - (props.count - 1) * 20) / props.count;
                if (one_width > MAX_WIDTH) {
                    calculateDSlide = {
                        width: MAX_WIDTH,
                        height: calculateDRect.height
                    };
                } else {
                    calculateDSlide = {
                        width: one_width,
                        height: calculateDRect.height
                    };
                }
            }
            setWidth(props.width);
            setCount(props.count);
            setRect(calculateDRect);

            setSlide(calculateDSlide);
        }
    }, [props]);

    if (count < 3) {
        return (<div style={{ width: width, height: rect.height }} className="d-flex flex-column justify-content-center">
            {
                [...Array(count)].map((x, i) =>
                    <div style={{ width: width }} key={'slides' + i} className="d-flex justify-content-center">
                        <div style={{ width: slide.width / 4, height: slide.height }} className="border border-dark rounded-0">
                        </div>
                        <div style={{ width: slide.width / 4 * 3, height: slide.height }} className="border border-dark rounded-0 d-flex flex-column justify-content-center align-items-center">
                            <span>{showNumber ? i + 1 : ''}</span>
                        </div>
                    </div>
                )
            }
        </div>);
    } else {
        return (<div style={{ width: rect.width }} className="d-flex flex-row justify-content-center">
            {
                [...Array(count)].map((x, i) =>
                    <div key={'slides' + i} className="d-flex flex-column justify-content-center">
                        <div style={{ width: slide.width, height: slide.height / 4 }} className="border border-dark rounded-0">
                        </div>
                        <div style={{ width: slide.width, height: slide.height / 4 * 3 }} className="border border-dark rounded-0 d-flex flex-column justify-content-center align-items-center">
                            <span>{showNumber ? i + 1 : ''}</span>
                        </div>
                    </div>
                )
            }
        </div>)
    }
}