import React, { } from 'react'
import objective from "../../assets/images/object.png";
export default function ObjectiveButton({onClick, id, label, activeId, active, pDisabled }) {
    return (
        <>
            <button onClick={(e) => onClick(e, id)} className={id === activeId ? "px-0 grey lighten-2" : "px-0"} style={{ minHeight: 35, minWidth: 24, color: "teal", border: "unset" }} disabled={pDisabled}>
                <img src={objective} style={{ margin: "0 auto", width: 30, height: 25 }} alt=""></img>
                <div className={id === activeId ? "caption font-weight-bold" : "caption"}>{label}</div>
            </button>
        </>
    )
}