import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Avivator from './Avivator';
import { } from "../../reducers/modules/filesReducer";
import * as api from '../../api/tiles';
import sources from './source-info';
import { useLocation } from 'react-router-dom';
import { getNameFromUrl } from './utils';

const mapStateToProps = (state) => ({
    files: state.files.files,
    content: state.files.content
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
    useEffect(() => {
        console.log(props, "Avivator : image file -------- ", props);
        if (props.content) {
            setSource({
                urlOrFile: props.files,
                description: 'data.zarr'
            })
        }
    }, [props.content]);

    return (
        <ThemeProvider theme={darkTheme}>
            <Avivator source={source} isDemoImage />
        </ThemeProvider>
    );
}

export default connect(mapStateToProps)(RoutedAvivator);