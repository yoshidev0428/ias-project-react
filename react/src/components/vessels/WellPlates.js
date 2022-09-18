import React, { useEffect, useState } from 'react';
import { VESSEL_WELLPLATE_RATIO, VESSEL_WELLPLATE_MAX_HEIGHT, VESSEL_WELLPLATE_MAX_FONTSIZE } from '../../utils/constants';
import classnames from 'classnames';
import { connect } from 'react-redux';
import store from "../../reducers";

const mapStateToProps = state => ({
    isFilesAvailable: state.files.isFilesAvailable,
})


const WellPlates = (props) => {

    var calculateDRect = {};
    var activeHolesNumbers = [];
    if (props.width * VESSEL_WELLPLATE_RATIO > VESSEL_WELLPLATE_MAX_HEIGHT) {
        calculateDRect.height = VESSEL_WELLPLATE_MAX_HEIGHT;
        calculateDRect.width = calculateDRect.height / VESSEL_WELLPLATE_RATIO;
    } else {
        calculateDRect.width = props.width;
        calculateDRect.height = props.width * VESSEL_WELLPLATE_RATIO;
    }
    const a_rows = props.rows + (props.showName ? 1 : 0);
    const a_cols = props.cols + (props.showName ? 1 : 0);
    let radiusCalculated = calculateDRect.width / a_cols > calculateDRect.height / a_rows ? calculateDRect.height / a_rows : calculateDRect.width / a_cols;
    const [showNumber, setShowNumber] = useState(props.showNumber);
    const [showName, setShowName] = useState(props.showName);
    const [width, setWidth] = useState(props.width);
    const [rows, setRows] = useState(props.rows);
    const [cols, setCols] = useState(props.cols);
    const [radious, setRadious] = useState(Math.floor(Math.floor(radiusCalculated) * 0.9));
    const [rect, setRect] = useState(calculateDRect);
    const [fontSize, setFontSize] = useState(radiusCalculated / 2 > VESSEL_WELLPLATE_MAX_FONTSIZE ? VESSEL_WELLPLATE_MAX_FONTSIZE : radiusCalculated / 2);
    const [holeClicked, setHoleClicked] = useState(-1);
    const [content, setContent] = useState(props.content);
    const [activeHoles, setActiveHoles] = useState([]);


    useEffect(() => {
        if (width !== props.width || rows !== props.rows || cols !== props.cols || showName !== props.showName) {
            if (props.width * VESSEL_WELLPLATE_RATIO > VESSEL_WELLPLATE_MAX_HEIGHT) {
                calculateDRect.height = VESSEL_WELLPLATE_MAX_HEIGHT;
                calculateDRect.width = calculateDRect.height / VESSEL_WELLPLATE_RATIO;
            } else {
                calculateDRect.width = props.width;
                calculateDRect.height = props.width * VESSEL_WELLPLATE_RATIO;
            }
            const a_rows = props.rows + (props.showName ? 1 : 0);
            const a_cols = props.cols + (props.showName ? 1 : 0);
            let radiusCalculated = calculateDRect.width / a_cols > calculateDRect.height / a_rows ? calculateDRect.height / a_rows : calculateDRect.width / a_cols;
            setShowNumber(props.showNumber);
            setShowName(props.showName);
            setWidth(props.width);
            setRows(props.rows);
            setCols(props.cols);
            setRadious(Math.floor(Math.floor(radiusCalculated) * 0.9));
            setRect(calculateDRect);
            setFontSize(radiusCalculated / 2 > VESSEL_WELLPLATE_MAX_FONTSIZE ? VESSEL_WELLPLATE_MAX_FONTSIZE : radiusCalculated / 2);
        }
    }, [props]);

    useEffect(() => {
        // setContent(props.content);
        if (props.content) {
            let _content = setHoleNumberInArray(props.content);
            // console.log("New Contents for HOLE: ", _content);
            let new_array_content = sortArrayBasedOnHoleNumber(_content);
            // console.log("SORTED New Contents for HOLE: ", new_array_content);
            setContent(new_array_content);
        }
    }, [props.content])

    const getUniqueSortedNumber = (arr) => {
        if (arr.length === 0) return arr;
        arr = arr.sort(function (a, b) { return a * 1 - b * 1; });
        var ret = [arr[0]];
        for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
            if (arr[i - 1] !== arr[i]) {
                ret.push(arr[i]);
            }
        }
        return ret;
    }

    const holeNumber = (r, c) => {
        r = r + 1;
        return (r - 1) * cols + c;
    }

    const setHoleNumberInArray = (content) => {
        let old_content = [...content];
        let holes = [];
        for (let i = 0; i < old_content.length; i++) {
            let row = old_content[i].row;
            let col = old_content[i].col - 1;
            old_content[i].col = col;
            old_content[i].hole = holeNumber(row, col);
            holes.push(holeNumber(row, col));
        }
        // console.log("Array of Holes: ", holes, old_content);
        activeHolesNumbers = getUniqueSortedNumber(holes);
        setActiveHoles(activeHolesNumbers);
        return old_content;
    }

    const sortArrayBasedOnHoleNumber = (content) => {
        let new_array_content = [];
        let old_content = [...content];
        // console.log("Active Holes: ", activeHolesNumbers);
        let maxIterate = Math.max(...activeHolesNumbers) + 1;
        // console.log("Max Holes: ", maxIterate);
        for (let i = 0; i < maxIterate; i++) {
            let data = {};
            let one_array = [];
            for (let j = 0; j < old_content.length; j++) {
                if (i === old_content[j].hole) {
                    one_array.push(old_content[j]);
                    old_content.slice(j);
                } else {
                    continue;
                }
            }
            data['data'] = one_array;
            new_array_content.push(data);
        }
        return new_array_content;
    }

    const getViewConfigs = (dataHoleChosen) => {
        let old_content = [...dataHoleChosen.data];
        let zPosS = [];
        let timePointS = [];
        let channels = [];
        for (let i = 0; i < old_content.length; i++) {
            let zPos = old_content[i].z;
            let timePoint = old_content[i].time;
            let channel = old_content[i].channel;
            zPosS.push(zPos);
            timePointS.push(timePoint);
            channels.push(channel);
        }
        let maxZPos = Math.max(...zPosS);
        let minZPos = Math.min(...zPosS);
        let maxTimePoint = Math.max(...timePointS);
        let minTimePoint = Math.min(...timePointS);

        let zPosObj = {};
        zPosObj['max'] = maxZPos;
        zPosObj['min'] = minZPos;
        zPosObj['array'] = getUniqueSortedNumber(zPosS);

        let timePointObj = {};
        timePointObj['max'] = maxTimePoint;
        timePointObj['min'] = minTimePoint;
        timePointObj['array'] = getUniqueSortedNumber(timePointS);

        let channelObj = {};
        channelObj['array'] = getUniqueSortedNumber(channels);

        let viewConfigsInObj = {};
        viewConfigsInObj['z'] = zPosObj;
        viewConfigsInObj['time'] = timePointObj;
        viewConfigsInObj['channel'] = channelObj;
        return viewConfigsInObj;
    }

    const handleVesselClick = (e, holeNumber, row, col) => {
        e.preventDefault();
        console.log("Event: ", e, ". Hole Number: ", holeNumber, ". Row: ", row, ". Col: ", col);
        setHoleClicked(holeNumber);
        if (activeHoles.includes(holeNumber)) {
            let dataHoleChosen = content[holeNumber]
            console.log("Content Hole number ", holeNumber, " CLICKED: ", dataHoleChosen);
            let viewConfigs = getViewConfigs(dataHoleChosen);
            console.log("WELL PLATES: handleVesselClick > viewConfigs", viewConfigs);
            // store.dispatch({ type: "files_selectedVesselHole", content: dataHoleChosen.data });
            // store.dispatch({ type: "vessel_setViewConfigsObj", data: viewConfigs });
        }
        else {
            // console.log("NO DATA Content Hole number ", holeNumber);
        }
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
                                        {i === 0 ? '' : i}
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
                                        <div onClick={e => handleVesselClick(e, holeNumber(r, c), r, c)}
                                            key={"circle" + holeNumber(r, c)}
                                            style={{ width: radious, height: radious }}
                                            className={classnames({
                                                "d-flex justify-content-center align-items-center border border-dark rounded-circle cursor-pointer": true,
                                                "hole-blue": activeHoles.includes(holeNumber(r, c)),
                                                "hole-purple": holeNumber(r, c) === holeClicked && activeHoles.includes(holeNumber(r, c))
                                            })}>
                                            <span className='primary--text'>{showNumber ? holeNumber(r, c) : ''}</span>
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

export default connect(mapStateToProps)(WellPlates);