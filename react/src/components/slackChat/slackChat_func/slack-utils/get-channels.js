import {debugLog} from '../utils';

export default ({apiToken, bot, channelFilter = [], defaultChannel}) => {
    return bot.conversations
        .list({
            token: apiToken,
        })
        .then((payload) => {
            // console.log("slack-utils  get channels");
            debugLog(payload);
            // get the channels we need
            const channels = [];
            const activeChannel = '';

            payload.channels.map((channel) => {
                channelFilter.forEach((channelObject) => {
                    // If this channel is exactly as requested
                    if (
                        channelObject.name === channel.name ||
                        channelObject.id === channel.id
                    ) {
                        if (defaultChannel === channel.name) {
                            activeChannel = channelObject;
                        }
                        channel.icon = channelObject.icon; // Add on the icon property to the channel list
                        channels.push(channel);
                    }
                });
            });
            return {channels, activeChannel};
        }).catch((error) => {
            // console.log(" bot.conversations : error = ", error);
        });
};
