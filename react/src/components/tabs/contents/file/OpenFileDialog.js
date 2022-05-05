import React, { useRef } from 'react';
const OpenFileDialog = (props) => {

    const inputFile = useRef(null);
    const onClick = (e) => {
        inputFile.current.click();
    };

    return (
        <>
            <input type="file" id="file" ref={inputFile} style={{ display: "none" }} />
            <button onClick={onClick}>open file browser</button>
        </>
    )

}

export default OpenFileDialog;