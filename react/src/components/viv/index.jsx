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
    content: state.files.content,
    selectedVesselHole: state.vessel.selectedVesselHole,
    selectedVesselZ: state.vessel.selectedVesselZ,
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

    const displayFiles = (contents, filesName, row, col, z) => {
        if (contents.length > 1) {
            let hole_files = [];
            // let layer_files = []; let layer_contents = []; let field_files = []; let field_contents = [];
            // let topZ = contents[0].z;
            for (let i = 0; i < contents.length; i++) {
                if (contents[i].row === row && contents[i].col === col && contents[i].z === z) {
                    // let fileURL = process.env.REACT_APP_BASE_API_URL + files.path.substring(1) + "/" + contents[i].filename;
                    // current_files.push(fileURL);
                    // current_files.push([{ c: contents[i].channel, z: 0, t: 0 }, files[i]]);
                    hole_files.push({content: contents[i], fileName: filesName[i]});
                }
            }
            // let minField = hole_files[0].content.field;
            let channels = []
            for (let i = 0; i < hole_files.length; i++) {
                if (channels.indexOf(hole_files[i].content.channel) === -1) {
                    channels.push(hole_files[i].content.channel)
                }
                // if (hole_files[i].content.field < minField) {
                //     minField = hole_files[i].content.field;
                // }
            }
            // console.log("index.jsx : displayFiles : hole_files : -------- : ", hole_files);
            // console.log("index.jsx : displayFiles : channels : -------- : ", channels);
            let nchannel_files = []
            let nchannel_contents = []
            for (let i = 0; i < channels.length; i++) {
                let hole_channel_files = hole_files.filter(file => file.content.channel === channels[i]);
                let sample = hole_channel_files[0];
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
                // console.log("index.js displayFiles : hole_channel_files = : ", hole_channel_files);
                getMergedImage(
                    hole_channel_files.map(file => file.content.filename),
                    newImageName,
                    (err, newFile) => {
                        if (err) {
                            console.log("Error occured while merging files")
                            return
                        } else {
                            nchannel_files.push(newFile)
                            nchannel_contents.push(sample.content)
                        }
                        if (i === channels.length - 1) {
                            setTimeout(() => {
                                console.log("index.js displayFiles : source = : ", {urlOrFile: nchannel_files, contents: nchannel_contents, description: ''});
                                setSource({urlOrFile: nchannel_files, contents: nchannel_contents, description: ''});
                            }, 1000);
                        }
                    }
                )
            }
        }
    }

    useEffect(() => {
        // console.log("index.jsx : props.content -------- : ", props);
        if (props.content) {
            if (props.selectedVesselHole !== undefined && props.selectedVesselHole !== null) {
                displayFiles(props.content, props.filesName, props.selectedVesselHole.row, props.selectedVesselHole.col, props.selectedVesselZ);
            } else {
                displayFiles(props.content, props.filesName, props.content[0].row, props.content[0].col, props.selectedVesselZ);
            }
        }
    }, [props.content, props.filesName, props.selectedVesselHole, props.selectedVesselZ]);

    return (
        <ThemeProvider theme={darkTheme}>
            <Avivator source={source} isDemoImage />
        </ThemeProvider>
    );
}

export default connect(mapStateToProps)(RoutedAvivator);