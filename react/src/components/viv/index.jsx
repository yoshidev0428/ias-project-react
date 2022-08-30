import React, { } from 'react';
import { connect } from 'react-redux'
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Avivator from './Avivator';
import {  } from "../../reducers/modules/filesReducer";
// import sources from './source-info';
// import { useLocation } from 'react-router-dom';
// import { getNameFromUrl } from './utils';

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

// function getRandomSource() {
//     return sources[Math.floor(Math.random() * sources.length)];
// }
// https://reactrouter.com/web/example/query-parameters
// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

const RoutedAvivator = (props) => {

    const source = {
    //     urlOrFile: "https://viv-demo.storage.googleapis.com/Vanderbilt-Spraggins-Kidney-MxIF.ome.tif",
        urlOrFile: "http://http://20.210.126.209/:8000/static/LiveDead2_Plate_R_p00_0_D03f00d3.TIF",
        description: "OME-TIFF Covid-19 Primary Gut Epithelial Stem Cells"
    }
    // const query = useQuery();
    // const {
    //     routeProps: { history }
    // } = props;
    // return (
    //     <ThemeProvider theme={darkTheme}>
    //         <Avivator source={source} history={history} />
    //     </ThemeProvider>
    // );

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <Avivator source={source}/>
            </ThemeProvider>
        </>
    );
}

function mapStateToProps(state) {
    return {
        contractsLoaded: true,
    };
}

export default connect(mapStateToProps)(RoutedAvivator);