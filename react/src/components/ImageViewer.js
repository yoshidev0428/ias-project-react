import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { FullScreen } from '@chiragrupani/fullscreen-react';
// import sources from './source-info';
// import { useLocation } from 'react-router-dom';
// import { getNameFromUrl } from './utils';
import {
    mdiFullscreen,
    mdiMinus,
    mdiPlus
} from '@mdi/js';
import Icon from '@mdi/react';
import { Stage, Layer, Image } from "react-konva";
import UTIF from "utif";

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

export default function ImageViewer(props) {

    const source = {
        urlOrFile: "https://viv-demo.storage.googleapis.com/Vanderbilt-Spraggins-Kidney-MxIF.ome.tif",
        description: "OME-TIFF Covid-19 Primary Gut Epithelial Stem Cells"
    }
    const [urlSource, setUrlSource] = useState(null);
    // ZoomContol + FullScreen
    let [isFullScreen, setFullScreen] = useState(false);
    let [mouseFlag, setMouseFlag] = useState(0);
    const zoomControl = (type) => {
        if (type === "fullScreen") {
            setFullScreen(!isFullScreen);
        } else if (type === "zoomIn") {
            setMouseFlag(1);
        } else if (type === "zoomOut") {
            setMouseFlag(-1);
        }

    }
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
        console.log(props.openedImageSource, "viv index : image file");
        if (props.openedImageSource !== undefined) {
            console.log(props.openedImageSource, "2 viv index : image file");
            setUrlSource(props.openedImageSource);
        }
    }, [props.openedImageSource]);

    return (
        <>
            <div className="bg-light h-100">
                <ThemeProvider theme={darkTheme}>
                    <Stage width={props.width} height={props.height}>
                            <Layer>
                                <Image image={props.openedImageSource} />
                            </Layer>
                        </Stage>
                </ThemeProvider>
            </div>
        </>
    );
}
