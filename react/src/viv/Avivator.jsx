import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {useViewerStore} from './state';
import {useImage} from './hooks';
import Viewer from './components/Viewer';
import Loader from './components/Loader';
import './index.css';
import {FullScreen} from '@chiragrupani/fullscreen-react';
import {
    mdiFullscreen,
    mdiMinus,
    mdiPlus
} from '@mdi/js';
import Icon from '@mdi/react';
// import { getWindowDimensions } from "../helpers";

/**
 * This component serves as batteries-included visualization for OME-compliant tiff or zarr images.
 * This includes color contrastLimits, selectors, and more.
 * @param {Object} props
 * @param {Object} props.history A React router history object to create new urls (optional).
 * @param {Object} args.sources A list of sources for a dropdown menu, like [{ url, description }]
 * */

const mapStateToProps = (state) => ({
    isImageLoading: state.files.isImageLoading,
})

const Avivator = function (props) {

    const {history, source: source, containerType: containerType, isDemoImage, isImageLoading} = props;
    // const source = useViewerStore(store => store.source);
    const isViewerLoading = useViewerStore(store => store.isViewerLoading);
    const useLinkedView = useViewerStore(store => store.useLinkedView);
    // ZoomContol + FullScreen
    const [isFullScreen, setFullScreen] = useState(false);
    const [mouseFlag, setMouseFlag] = useState(0);
    const zoomControl = (type) => {
        if (type === "fullScreen") {
            setFullScreen(!isFullScreen);
        } else if (type === "zoomIn" && mouseFlag < 15) {
            setMouseFlag(mouseFlag + 1);
        } else if (type === "zoomOut" && mouseFlag > 0) {
            setMouseFlag(mouseFlag - 1);
        }
    }

    useEffect(() => {
        // console.log(props, "Avivator : image file -------- ");
        if (props.source !== null) {
            useViewerStore.setState({source: source, isNoImageUrlSnackbarOn: isDemoImage});
        }
    }, [isFullScreen, mouseFlag]); // eslint-disable-line react-hooks/exhaustive-deps
    useImage(source);

    return (
        <>
            <FullScreen isFullScreen={isFullScreen} onChange={(isFullScreen) => {setFullScreen(isFullScreen)}} className="bg-light h-100 w-100">
                <div className='leaf_control'>
                    <button className='leaf_control_btn border-bottom' onClick={() => {zoomControl("zoomIn")}} style={{borderRadius: "5px 5px 0px 0px"}}>
                        <Icon size={1}
                            horizontal
                            vertical
                            rotate={180}
                            color="#212529"
                            path={mdiPlus}>
                        </Icon>
                    </button>
                    <button className='leaf_control_btn border-bottom' onClick={() => {zoomControl("zoomOut")}} >
                        <Icon size={1}
                            horizontal
                            vertical
                            rotate={180}
                            color="#212529"
                            path={mdiMinus}>
                        </Icon>
                    </button>
                    <button className="leaf_control_btn" onClick={() => {zoomControl("fullScreen")}} style={{borderRadius: "0px 0px 5px 5px"}}>
                        <Icon size={1}
                            horizontal
                            vertical
                            rotate={180}
                            color="#212529"
                            path={mdiFullscreen}>
                        </Icon>
                    </button>
                </div>
                {isImageLoading && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <Loader />
                </div>}
                <div className="bg-light h-100 w-100">
                    {!isViewerLoading && <Viewer mouseFlag={mouseFlag} isFullScreen={isFullScreen} viewType={containerType}/>}
                    
                    {/* <DropzoneWrapper>
                        {!isViewerLoading && <Viewer mouseFlag={mouseFlag} isFullScreen={isFullScreen} />}
                    </DropzoneWrapper> */}
                    {/* <Controller /> */}
                    {/* <SnackBars /> */}
                    {/* {!useLinkedView && <Footer />} */}
                </div>
            </FullScreen>
        </>
    );
}
export default connect(mapStateToProps)(Avivator);