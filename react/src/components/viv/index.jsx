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

    const displayFiles = async (experiment_name, contents, filesPath, row, col, z, time, is3dView) => {
        // console.log("index.jsx : displayFiles : param : -------- : ", experiment_name, contents, filesPath, row, col, z, time, is3dView);
        if (contents.length >= 1) {
            let hole_files = [];
            for (let i = 0; i < contents.length; i++) {
                if (contents[i].row === row && contents[i].col === col && (is3dView || contents[i].z === z)) {
                    hole_files.push(contents[i]);
                }
            }
            // console.log("index.jsx : displayFiles : hole_files : -------- : ", hole_files);
            let min_time = time;
            if (min_time < 0 && hole_files.length > 0) {
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
                if (min_time === hole_files[i].time) {
                    time_files.push(hole_files[i]);
                }
            }
            time_files.sort((a, b) => (a.filename < b.filename) ? -1 : ((a.filename > b.filename) ? 1 : 0));
            // console.log("index.jsx : displayFiles : times : -------- : ", min_time, time_files);

            let minC = -1, maxC = -1;
            let minZ = -1, maxZ = -1;
            for (let i = 0; i < time_files.length; i++) {
                if (minC === -1 || time_files[i].channel < minC) {
                    minC = time_files[i].channel;
                }
                if (maxC === -1 || maxC < time_files[i].channel) {
                    maxC = time_files[i].channel;
                }
                if (minZ === -1 || time_files[i].z < minZ) {
                    minZ = time_files[i].z;
                }
                if (maxZ === -1 || maxZ < time_files[i].z) {
                    maxZ = time_files[i].z;
                }
            }
            // console.log("index.jsx : displayFiles : (minC maxC) = (", minC, maxC, "), (minZ maxZ) = (", minZ, maxZ, ")");

            let nchannel_files = [];
            let nchannel_contents = [];
            let nchannel_tiff_names = [];
            let requestCount = 0;
            for (let z = minZ; z <= maxZ; z++) {
                for (let c = minC; c <= maxC; c++) {
                    let field_files = time_files.filter(file => file.channel === c && file.z == z);
                    // console.log("index.jsx : displayFiles : field_files : -------- : ", field_files);
                    if (field_files.length > 0) {
                        let sample = field_files[0];
                        let newNameArr = [
                            sample.series,
                            "row" + sample.row,
                            "col" + sample.col,
                            "channel" + sample.channel
                        ];
                        newNameArr.push("time" + (sample.dimensionChanged ? sample.z : sample.time));
                        newNameArr.push("z" + (sample.dimensionChanged ? sample.time : sample.z));
                        let extension = sample.filename.split('.').pop();
                        let newImageName = newNameArr.join('_') + '.OME.' + extension;
                        let getFullPathFromName = (name) => {
                            let res = filesPath.filter(path => path.indexOf(name) !== -1)
                            if(res.length === 1)
                                return experiment_name + "/" + res[0]
                            else return ""
                        }
                        getMergedImage([getFullPathFromName(sample.filename)], newImageName, (err, newFile) => {
                            if (err) {
                                console.log("Error occured while merging files")
                                return
                            } else {
                                nchannel_files.push(newFile);
                                nchannel_contents.push(sample);
                                nchannel_tiff_names.push({...field_files[0]});
                            }
                        });
                        requestCount++;
                    }
                }
            }
            // time out
            for (let elapsed = 0; elapsed < 5000; elapsed += 100) {
                if (nchannel_files.length >= requestCount) {
                    console.log("index.js displayFiles : nchannel_files.length = ", nchannel_files.length, ", requestCount = ", requestCount);
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            if (requestCount > 0 && nchannel_files.length >= requestCount) {
                const imageSource = {urlOrFile: nchannel_files, contents: nchannel_contents, tiff_names: nchannel_tiff_names, 
                    experiment_name: experiment_name, is3dView: is3dView, description: ''};
                console.log("index.js displayFiles : source = : ", imageSource);
                setSource(imageSource);
            }
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