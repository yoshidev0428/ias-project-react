import React, { } from 'react'
import objective from "../../assets/images/object.png";
import { useSelector } from 'react-redux';

export default function ObjectiveButton({onClick, id, label, activeId, active, pDisabled }) {
    const vessel = useSelector(state => state.vessel)
    return (
        <>
            <button onClick={(e) => onClick(e, id)} className={id === activeId && id === vessel.object? "px-0 grey border lighten-2" : "px-0"} style={{ minHeight: 35, minWidth: 24, color: "teal", border: "unset" }} disabled={pDisabled}>
                <img src={objective} style={{ margin: "0 auto", width: 30, height: 25 }} alt=""></img>
                <div className={id === activeId && id === vessel.object ? "caption font-weight-bold" : "caption"}>{label}</div>
            </button>
        </>
    )
}