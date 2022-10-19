import React from 'react';
// import Typography from '@material-ui/core/Typography';
// import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import shallow from 'zustand/shallow';
import { useImageSettingsStore, useLoader, useViewerStore } from '../state';

function formatResolutionStatus(current, total, shape) {
    return `${current}/${total} [${shape.join(', ')}]`;
}

export default function Footer() {
    // const classes = useStyles();
    const [use3d, pyramidResolution] = useViewerStore(
        store => [store.use3d, store.pyramidResolution],
        shallow
    );
    const loader = useLoader();
    const volumeResolution = useImageSettingsStore(store => store.resolution);

    const resolution = use3d ? volumeResolution : pyramidResolution;
    const level = loader[resolution];

    if (!level) return null;
    return (
        <Box
            style={{
                bottom: 0,
                position: 'fixed',
                fontSize: "12px",
                marginTop: 'calc(5% + 60px)',
                backgroundColor: "#000",
                color: "#fff"
            }}>
            {formatResolutionStatus(resolution + 1, loader.length, level.shape)}
        </Box>
    );
}
