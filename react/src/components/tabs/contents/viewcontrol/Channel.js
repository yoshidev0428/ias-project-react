import * as React from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
// import { Container } from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import shallow from 'zustand/shallow';

import ChannelController from '../../../viv/components/Controller/components/ChannelController';
import {
    useChannelsStore,
    useViewerStore,
    useImageSettingsStore,
    useLoader,
    useMetadata
} from '../../../viv/state';

import { guessRgb, getSingleSelectionStats } from '../../../viv/utils';
import SmallCard from '../../../custom/SmallCard';
export default function Channel() {

    let channels = [
        { id: 0, label: "S", color: "black", disabled: false },
        { id: 1, label: "B", color: "blue", disabled: false },
        { id: 2, label: "G", color: "green", disabled: false },
        { id: 3, label: "R", color: "red", disabled: false },
        { id: 4, label: "C", color: "cyan", disabled: false },
        { id: 5, label: "Y", color: "#ffc107", disabled: false },
        { id: 6, label: "M", color: "#e91e63", disabled: false }
    ];
    const [
        channelsVisible,
        contrastLimits,
        colors,
        domains,
        selections,
        ids,
        setPropertiesForChannel,
        toggleIsOnSetter,
        removeChannel
    ] = useChannelsStore(
        store => [
            store.channelsVisible,
            store.contrastLimits,
            store.colors,
            store.domains,
            store.selections,
            store.ids,
            store.setPropertiesForChannel,
            store.toggleIsOn,
            store.removeChannel
        ],
        shallow
    );
    const loader = useLoader();

    const colormap = useImageSettingsStore(store => store.colormap);
    const [
        channelOptions,
        useLinkedView,
        use3d,
        useColormap,
        useLens,
        isChannelLoading,
        setIsChannelLoading,
        removeIsChannelLoading,
        pixelValues,
        isViewerLoading
    ] = useViewerStore(
        store => [
            store.channelOptions,
            store.useLinkedView,
            store.use3d,
            store.useColormap,
            store.useLens,
            store.isChannelLoading,
            store.setIsChannelLoading,
            store.removeIsChannelLoading,
            store.pixelValues,
            store.isViewerLoading
        ],
        shallow
    );
    const metadata = useMetadata();
    const isRgb = metadata && guessRgb(metadata);
    const { shape, labels } = loader[0];
    const renderItems = (channels) => {
        return (
            channels.map((c, i) =>
                <div key={i} className="d-flex flex-column channel-box text-center">
                    <Checkbox // onChange={toggleIsOn} // checked={channelsVisible} 
                        size="small" sx={{ color: c.color, padding: 0, '&.Mui-checked': { color: c.color,}}}/>
                    <span style={{ color: c.color }}>{c.label}</span>
                </div>
            )
        )
    }


    const channelControllers = ids.map((id, i) => {
        const onSelectionChange = e => {
            const selection = {
                ...selections[i],
                c: channelOptions.indexOf(e.target.value)
            };
            setIsChannelLoading(i, true);
            getSingleSelectionStats({
                loader,
                selection,
                use3d
            }).then(({ domain, contrastLimits: newContrastLimit }) => {
                setPropertiesForChannel(i, {
                    contrastLimits: newContrastLimit,
                    domains: domain
                });
                useImageSettingsStore.setState({
                    onViewportLoad: () => {
                        useImageSettingsStore.setState({ onViewportLoad: () => { } });
                        setIsChannelLoading(i, false);
                    }
                });
                setPropertiesForChannel(i, { selections: selection });
            });
        };
        const toggleIsOn = () => toggleIsOnSetter(i);
        const handleSliderChange = (e, v) =>
            setPropertiesForChannel(i, { contrastLimits: v });
        const handleRemoveChannel = () => {
            removeChannel(i);
            removeIsChannelLoading(i);
        };
        const handleColorSelect = color => {
            setPropertiesForChannel(i, { colors: color });
        };
        const name = channelOptions[selections[i].c];
        return (
            <Grid container key={`channel-controller-${name}-${id}`} style={{ width: '100%' }} item >
                <ChannelController
                    name={name}
                    onSelectionChange={onSelectionChange}
                    channelsVisible={channelsVisible[i]}
                    pixelValue={pixelValues[i]}
                    toggleIsOn={toggleIsOn}
                    handleSliderChange={handleSliderChange}
                    domain={domains[i]}
                    slider={contrastLimits[i]}
                    color={colors[i]}
                    handleRemoveChannel={handleRemoveChannel}
                    handleColorSelect={handleColorSelect}
                    isLoading={isChannelLoading[i]}
                />
            </Grid>
        );
    });

    return (
        <>
            <div className="pa-1 common-border">
                <div className="d-flex justify-space-between align-center" >
                    <h6>Channels</h6>
                    <div>
                        <div className="spacer"></div>
                        <Button className="py-0" variant="contained" color="primary" size="small">Color/Mono</Button>
                    </div>
                </div>

                <div>
                    <div className="d-flex justify-space-around">
                        {!isRgb && channelControllers}
                    </div>
                    <SmallCard>
                        {renderItems(channels)}
                    </SmallCard>
                </div>
            </div>
        </>
    );
};
