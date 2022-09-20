import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Avivator from './Avivator';
import { } from "../../reducers/modules/filesReducer";
// import * as api from '../../api/tiles';
// import sources from './source-info';
// import { useLocation } from 'react-router-dom';
// import { getNameFromUrl } from './utils';

const mapStateToProps = (state) => ({
    files: state.files.files,
    content: state.files.content,
    selectedHole: state.files.selectedHole,
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

    // const query = useQuery();
    // const url = query.get('image_url');
    const [source, setSource] = useState(null);

    const displayFiles = (contents, files, row, col) => {
        if (files.length > 1 && files[0].type === "image/tiff") {
            let current_files = [];
            for (let i = 0; i < contents.length; i++) {
                if (contents[i].row === row && contents[i].col === col) {
                    current_files.push(files[i]);
                }
            }
            console.log("index.jsx : displayFiles : current_files : -------- : ", current_files);
            setSource({ urlOrFile: current_files, description: 'data.zarr' });
        }
    }

    useEffect(() => {
        console.log("index.jsx : props.content -------- : ", props);
        if (props.content) {
            if (props.selectedHole !== undefined && props.selectedHole !== null) {
                displayFiles(props.content, props.files, props.selectedHole.row, props.selectedHole.col);
            } else {
                displayFiles(props.content, props.files, props.content[0].row, props.content[0].col);
            }
        }
    }, [props.content, props.selectedHole]);

    return (
        <ThemeProvider theme={darkTheme}>
            <Avivator source={source} isDemoImage />
        </ThemeProvider>
    );
}

export default connect(mapStateToProps)(RoutedAvivator);