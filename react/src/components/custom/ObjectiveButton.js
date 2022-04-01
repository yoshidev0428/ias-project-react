import React, {useState, useEffect} from 'react'

export default function ObjectiveButton ({label, active, pDisabled}) {
    return (
        <>
            <button className={ active? "px-0 grey lighten-2": "px-0"} style={{minHeight:52, minWidth:24, color:"teal", border:"unset"}} disabled={pDisabled}>
                <div className="my-2">
                    <img src="../../assets/images/object.png" style={{margin: "0 auto", width: 32, height: 32}}>
                    </img>
                    <div className={ active ? "caption font-weight-bold": "caption"}>
                        {label}
                    </div>
                </div>
            </button>
        </>
    )
}