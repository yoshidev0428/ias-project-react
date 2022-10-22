import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {ThemeProvider, createTheme} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import Avivator from './Avivator';
// import * as api from '../../api/tiles';
import {getMergedImage} from '../../api/fetch';
// import sources from './source-info';
// import { useLocation } from 'react-router-dom';
// import { getNameFromUrl } from './utils';

const mapStateToProps = (state) => ({
    filesName: state.files.filesName,
    filesPath: state.files.filesPath,
    content: state.files.content,
    selectedVesselHole: state.vessel.selectedVesselHole,
    selectedVesselZ: state.vessel.selectedVesselZ,
    selectedVesselTime: state.vessel.selectedVesselTime,
    tiling_selectedFile: state.tiling.tiling_selectedFile,
})

const darkTheme = createTheme({
    palette: {
        type: 'dark',
        primary: grey,
        secondary: grey
    },
    props: {
        MuiButtonBase: {
            disableRipple: true
        }
    }
});


const RoutedAvivator = (props) => {

    const [source, setSource] = useState(null);
    const [avivatorType, setAvivatorType] = useState("mainFrame");

    const displayFiles = (contents, filesName, filesPath, row, col, z, time) => {
        console.log("index.jsx : displayFiles : param : -------- : ", filesName, row, col, z, time);
        if (contents.length > 1) {
            let hole_files = [];
            // let layer_files = []; let layer_contents = []; let field_files = []; let field_contents = [];
            for (let i = 0; i < contents.length; i++) {
                if (contents[i].row === row && contents[i].col === col && contents[i].z === z) {
                    hole_files.push({content: contents[i], fileName: filesName[i]});
                }
            }
            // console.log("index.jsx : displayFiles : hole_files : -------- : ", hole_files);
            let min_time = time;
            if (min_time <= 0) {
                min_time = hole_files[0].content.time;
                for (let i = 0; i < hole_files.length; i++) {
                    if (min_time > hole_files[i].content.time) {
                        min_time = hole_files[i].content.time;
                    }
                }
            }
            // let times = []; 
            let time_files = [];
            for (let i = 0; i < hole_files.length; i++) {
                // if (times.indexOf(hole_files[i].content.time) === -1) {
                //     times.push(hole_files[i].content.time)
                // }
                if (min_time === hole_files[i].content.time) {
                    time_files.push(hole_files[i]);
                }
            }
            // times.sort((a, b) => (a - b));
            // console.log("index.jsx : displayFiles : times : -------- : ", times);
            let channels = [];
            for (let i = 0; i < time_files.length; i++) {
                if (channels.indexOf(time_files[i].content.channel) === -1) {
                    channels.push(time_files[i].content.channel);
                }
            }
            // console.log("index.jsx : displayFiles : channels : -------- : ", channels);
            let nchannel_files = [];
            let nchannel_contents = [];
            for (let i = 0; i < channels.length; i++) {
                let hole_time_channel_files = time_files.filter(file => file.content.channel === channels[i]);
                // console.log("index.jsx : displayFiles : hole_time_channel_files : -------- : ", hole_time_channel_files);
                if (hole_time_channel_files.length > 0) {
                    let sample = hole_time_channel_files[0];
                    let newNameArr = [
                        sample.content.series,
                        "row" + sample.content.row,
                        "col" + sample.content.col,
                        "channel" + channels[i],
                        "time" + sample.content.time,
                        "z" + sample.content.z,
                    ]
                    let extension = sample.content.filename.split('.').pop();
                    let newImageName = newNameArr.join('_') + '.' + extension;
                    let getFullPathFromName = (name) => {
                        let res = filesPath.filter(path => path.indexOf(name) != -1)
                        if(res.length == 1)
                            return res[0]
                        else return false
                    }
                    getMergedImage(hole_time_channel_files.map(file => {
                        let path = getFullPathFromName(file.content.filename)
                        return path
                    }), newImageName, (err, newFile) => {
                        if (err) {
                            console.log("Error occured while merging files")
                            return
                        } else {
                            nchannel_files.push(newFile);
                            nchannel_contents.push(sample.content);
                        }
                        if (i === channels.length - 1) {
                            setTimeout(() => {
                                console.log("index.js displayFiles : source = : ", {urlOrFile: nchannel_files, contents: nchannel_contents, description: ''});
                                setSource({urlOrFile: nchannel_files, contents: nchannel_contents, description: ''});
                            }, 1000);
                        }
                    });
                }
            }
        }
    }

    // MainFrame useEffect
    useEffect(() => {
        // console.log(" ==== index.jsx : props.content -------- : ", props);
        if (props.content) {
            if (props.selectedVesselHole !== undefined && props.selectedVesselHole !== null) {
                displayFiles(props.content, props.filesName, props.filesPath, props.selectedVesselHole.row, props.selectedVesselHole.col, props.selectedVesselZ, props.selectedVesselTime);
            } else {
                displayFiles(props.content, props.filesName, props.filesPath, props.content[0].row, props.content[0].col, props.selectedVesselZ, props.selectedVesselTime);
            }
        }
    }, [props.content, props.filesName, props.selectedVesselHole, props.selectedVesselZ, props.selectedVesselTime]);

    const displayFileOnTiling = (file) => {
        setSource({urlOrFile: [file], contents: [], description: 'tiling'});
    }
    // Tiling Tab useEffect
    useEffect(() => {
        // console.log(" ==== index.jsx : props.content -------- : ", props);
        if (props.tiling_selectedFile !== null && props.tiling_selectedFile !== undefined) {
            displayFileOnTiling(props.tiling_selectedFile);
        }
    }, [props.tiling_selectedFile]);

    // Page Settings
    useEffect(() => {
        if (props.type) {
            setAvivatorType(props.type);
        }
    }, [props.type]);

    return (
        <ThemeProvider theme={darkTheme}>
            <Avivator source={source} containerType={avivatorType} isDemoImage />
        </ThemeProvider>
    );
}

export default connect(mapStateToProps)(RoutedAvivator);