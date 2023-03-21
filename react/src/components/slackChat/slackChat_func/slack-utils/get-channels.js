import { debugLog } from '../utils';

export default async ({
  apiToken,
  bot,
  channelFilter = [],
  defaultChannel,
}) => {
  let payload = await bot.conversations.list({ token: apiToken });

  debugLog(payload);
  // get the channels we need
  let channels = [];
  let activeChannel = '';

  for (let i = 0; i < payload.channels.length; i++) {
    let channel = payload.channels[i];

    for (let j = 0; j < channelFilter.length; j++) {
      let channelObject = channelFilter[j];
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
    }
  }

  return { channels, activeChannel };
};
