import React, { useEffect } from 'react';
import { useViewerStore } from './state';
import { useImage } from './hooks';
import Viewer from './components/Viewer';
import DropzoneWrapper from './components/DropzoneWrapper';
import Controller from './components/Controller';
import SnackBars from './components/Snackbars';
import Footer from './components/Footer';

import './index.css';

/**
 * This component serves as batteries-included visualization for OME-compliant tiff or zarr images.
 * This includes color contrastLimits, selectors, and more.
 * @param {Object} props
 * @param {Object} props.history A React router history object to create new urls (optional).
 * @param {Object} args.sources A list of sources for a dropdown menu, like [{ url, description }]
 * */
export default function Avivator(props) {

    const { history, source: source, isDemoImage } = props;

    // const source = useViewerStore(store => store.source);
    const isViewerLoading = useViewerStore(store => store.isViewerLoading);
    const useLinkedView = useViewerStore(store => store.useLinkedView);
    useEffect(() => {
        if (props.source !== null) {
            // console.log(props.source, "Avivator : image file ++ ");
            useViewerStore.setState({
                source: source,
                isNoImageUrlSnackbarOn: isDemoImage
            });
        }
    }, [props]); // eslint-disable-line react-hooks/exhaustive-deps
    useImage(source);
    return (
        <>
            <DropzoneWrapper>
                {!isViewerLoading && <Viewer />}
            </DropzoneWrapper>
            {/* <ZoomController /> */}
            {/* <Controller /> */}
            {/* <SnackBars /> */}
            {/* <Footer /> */}            
            {!useLinkedView && <Footer />}
        </>
    );
}
