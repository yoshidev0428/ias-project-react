import React, { } from 'react'

export default function ObjectiveButton({ label, active, pDisabled }) {
    return (
        <>
            <button className={active ? "px-0 grey lighten-2" : "px-0"} style={{ minHeight: 35, minWidth: 24, color: "teal", border: "unset" }} disabled={pDisabled}>
                <img src="../../assets/images/object.png" style={{ margin: "0 auto", width: 30, height: 25 }} alt=""></img>
                <div className={active ? "caption font-weight-bold" : "caption"}>{label}</div>
            </button>
        </>
    )
}