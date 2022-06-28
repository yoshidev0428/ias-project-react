import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Avivator from './Avivator';
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

export default function RoutedAvivator(props) {

    const source = {
        urlOrFile: "https://viv-demo.storage.googleapis.com/Vanderbilt-Spraggins-Kidney-MxIF.ome.tif",
        description: "OME-TIFF Covid-19 Primary Gut Epithelial Stem Cells"
    }
    // const [urlSource, setUrlSource] = useState(source);
    // const query = useQuery();
    // const url = query.get('image_url');
    // const {
    //   routeProps: { history }
    // } = props;
    // if (url) {
    //   const urlSrouce = {
    //     urlOrFile: url,
    //     description: getNameFromUrl(url)
    //   };
    //   return (
    //     <ThemeProvider theme={darkTheme}>
    //       <Avivator source={urlSrouce} history={history} />
    //     </ThemeProvider>
    //   );
    // }
    // const source = getRandomSource();
    // const history = [];

    useEffect(() => {
        // console.log(props, "viv index : image file");
        if (props.openedImageSource !== undefined) {
            // setUrlSource(props.openedImageSource);
        }
    }, [props]);

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <Avivator source={source} />
            </ThemeProvider>
        </>
    );
}
