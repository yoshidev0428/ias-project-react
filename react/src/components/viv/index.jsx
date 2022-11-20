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
    experimentName: state.files.experimentName,
    selectedVesselHole: state.vessel.selectedVesselHole,
    selectedVesselZ: state.vessel.selectedVesselZ,
    selectedVesselTime: state.vessel.selectedVesselTime,
    tiling_selectedFile: state.tiling.tiling_selectedFile,
    is3dView: state.image.is3dView,
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

    const displayFiles = (expName, contents, filesPath, row, col, z, time, is3dView) => {
        console.log("index.jsx : displayFiles : param : -------- : ", expName, contents, filesPath, row, col, z, time, is3dView);
        if (contents.length >= 1) {
            let hole_files = [];
            // let layer_files = []; let layer_contents = []; let field_files = []; let field_contents = [];
            for (let i = 0; i < contents.length; i++) {
                if (contents[i].row === row && contents[i].col === col && (is3dView || contents[i].z === z)) {
                    hole_files.push(contents[i]);
                }
            }
            console.log("index.jsx : displayFiles : hole_files : -------- : ", hole_files);
            let min_time = time;
            if (min_time <= 0 && hole_files.length > 0) {
                min_time = hole_files[0].time;
                for (let i = 0; i < hole_files.length; i++) {
                    if (min_time > hole_files[i].time) {
                        min_time = hole_files[i].time;
                    }
                }
            }
            // let times = []; 
            let time_files = [];
            for (let i = 0; i < hole_files.length; i++) {
                // if (times.indexOf(hole_files[i].time) === -1) {
                //     times.push(hole_files[i].time)
                // }
                if (min_time === hole_files[i].time) {
                    time_files.push(hole_files[i]);
                }
            }
            // times.sort((a, b) => (a - b));
            console.log("index.jsx : displayFiles : times : -------- : ", min_time, time_files);

            let nchannel_files = [];
            let nchannel_contents = [];
            for (let i = 0; i < time_files.length; i++) {
                console.log("index.jsx : displayFiles : time_files : -------- : ", 
                    time_files[i].filename, time_files[i].time, time_files[i].channel, time_files[i].z);
                let sample = time_files[i];
                let newNameArr = [
                    sample.series,
                    "row" + sample.row,
                    "col" + sample.col,
                    "channel" + sample.channel
                ];
                newNameArr.push("time" + (sample.dimensionChanged ? sample.z : sample.time));
                newNameArr.push("z" + (sample.dimensionChanged ? sample.time : sample.z));
                let extension = sample.filename.split('.').pop();
                let newImageName = newNameArr.join('_') + '.' + extension;
                let getFullPathFromName = (name) => {
                    let res = filesPath.filter(path => path.indexOf(name) !== -1)
                    if(res.length === 1)
                        return expName + "/" + res[0]
                    else return ""
                }
                getMergedImage([getFullPathFromName(time_files[i].filename)], newImageName, (err, newFile) => {
                    if (err) {
                        console.log("Error occured while merging files")
                        return
                    } else {
                        nchannel_files.push(newFile);
                        nchannel_contents.push(sample);
                    }
                });
                console.log("index.jsx->displayFiles->getMergedImage: ", nchannel_files, nchannel_contents);
            }
            setTimeout(() => {
                if (nchannel_files.length > 0) {
                    const imageSource = {urlOrFile: nchannel_files, contents: nchannel_contents, description: ''};
                    console.log("index.js displayFiles : source = : ", imageSource);
                    setSource(imageSource);
                }
            }, 5000);

            // let channels = [];
            // for (let i = 0; i < time_files.length; i++) {
            //     if (channels.indexOf(time_files[i].channel) === -1) {
            //         channels.push(time_files[i].channel);
            //     }
            // }
            // console.log("index.jsx : displayFiles : channels : -------- : ", channels);
            // for (let i = 0; i < channels.length; i++) {
            //     let hole_time_channel_files = time_files.filter(file => file.channel === channels[i]);
            //     console.log("index.jsx : displayFiles : hole_time_channel_files : -------- : ", hole_time_channel_files);
            //     if (hole_time_channel_files.length > 0) {
            //         let sample = hole_time_channel_files[0];
            //         let newNameArr;
            //         if (!sample.dimensionChanged) {
            //             newNameArr = [
            //                 sample.series,
            //                 "row" + sample.row,
            //                 "col" + sample.col,
            //                 "channel" + channels[i],
            //                 "time" + sample.time,
            //                 "z" + sample.z,
            //             ]
            //         } else {
            //             newNameArr = [
            //                 sample.series,
            //                 "row" + sample.row,
            //                 "col" + sample.col,
            //                 "channel" + channels[i],
            //                 "time" + sample.z,
            //                 "z" + sample.time,
            //             ]
            //         }
            //         let extension = sample.filename.split('.').pop();
            //         let newImageName = newNameArr.join('_') + '.' + extension;
            //         let getFullPathFromName = (name) => {
            //             let res = filesPath.filter(path => path.indexOf(name) !== -1)
            //             if(res.length === 1)
            //                 return res[0]
            //             else return false
            //         }
            //         getMergedImage([getFullPathFromName(sample.filename)], newImageName, (err, newFile) => {
            //             if (err) {
            //                 console.log("Error occured while merging files")
            //                 return
            //             } else {
            //                 nchannel_files.push(newFile);
            //                 nchannel_contents.push(sample);
            //             }
            //             if (i === channels.length - 1) {
            //                 setTimeout(() => {
            //                     console.log("index.js displayFiles : source = : ", {urlOrFile: nchannel_files, contents: nchannel_contents, description: ''});
            //                     setSource({urlOrFile: nchannel_files, contents: nchannel_contents, description: ''});
            //                 }, 1000);
            //             }
            //         });
            //     }
            // }
        }
    }

    // MainFrame useEffect
    useEffect(() => {
        // console.log(" ==== index.jsx : props.content -------- : ", props);
        if (props.content) {
            if (props.selectedVesselHole !== undefined && props.selectedVesselHole !== null) {
                displayFiles(props.experimentName, props.content, props.filesPath, props.selectedVesselHole.row, props.selectedVesselHole.col, 
                    props.selectedVesselZ, props.selectedVesselTime, props.is3dView);
            } else {
                displayFiles(props.experimentName, props.content, props.filesPath, props.content[0].row, props.content[0].col, 
                    props.selectedVesselZ, props.selectedVesselTime, props.is3dView);
            }
        }
    }, [props.content, props.filesPath, props.selectedVesselHole, props.selectedVesselZ, props.selectedVesselTime, props.is3dView]);

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