import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SlackBot from 'slack';
import {load as emojiLoader, parse as emojiParser} from 'gh-emoji';

import defaultChannelIcon from './assets/team.svg';
// Chat Functions
import {
    wasIMentioned,
    decodeHtml,
    postFile,
    getNewMessages,
    hasEmoji,
    hasAttachment,
    isSystemMessage,
    isAdmin,
} from './slackChat_func/chat-functions';
import {hooks, themes, utils, cacheChannelMap} from './slackChat_func';
// Slack API Funcs
import {
    getChannels,
    getUsers,
    getMessages,
    postMessage,
} from './slackChat_func/slack-utils';
import './ReactSlackChat.scss';

// Utils
const {debugLog, arraysIdentical} = utils;

// Hooks
const {isHookMessage, execHooksIfFound} = hooks;

// Themes
const {changeColorRecursive} = themes;

// Cached Channel Map
const {getCachedChannelMap, saveChannelMap} = cacheChannelMap;

class ReactSlackChat extends Component {
    constructor(args) {
        super(args);
        // setup state
        this.state = {
            // failed flag
            failed: false,
            helpText: this.props.helpText,
            // List of Online users
            onlineUsers: [],
            channels: [],
            messages: [],
            // keep track of user threads for messaging in singleUserMode
            userThreadTss: [],
            postMyMessage: '',
            postMyFile: '',
            chatbox: {
                active: false,
                channelActiveView: false,
                chatActiveView: false,
            },
        };
        // Set class variables
        // Base64 decode the API Token
        this.apiToken = this.props.apiToken;
        this.bot = new SlackBot({token: this.apiToken});
        this.refreshTime = 5000;
        this.chatInitiatedTs = '';
        this.activeChannel = [];
        this.activeChannelInterval = null;
        this.messageFormatter = {
            emoji: false, // default
        };
        this.fileUploadTitle = `Posted by ${this.props.botName}`;
        // Theme variables
        this.themeDefaultColor = '#2e7eea'; // Defined as $theme_color sass variable in .scss
        // Bind Slack Message functions
        this.loadMessages = this.loadMessages.bind(this);
        this.postMyMessage = this.postMyMessage.bind(this);
        this.gotNewMessages = this.gotNewMessages.bind(this);
        this.getUserImg = this.getUserImg.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        // Bind UI Animation functions
        this.openChatBox = this.openChatBox.bind(this);
        this.closeChatBox = this.closeChatBox.bind(this);
        this.goToChatView = this.goToChatView.bind(this);
        this.goToChannelView = this.goToChannelView.bind(this);
        // Utils
        this.displayFormattedMessage = this.displayFormattedMessage.bind(this);
        // Single user mode, TS (Thread) map
        this.TS_MAP = getCachedChannelMap({channels: this.props.channels});
    }

    gotNewMessages(newMessages) {
        // const newCount = this.state.newMessageNotification + newMessages.length;
        // this.setState({newMessageNotification: newCount});
    }

    displayFormattedMessage(message) {
        // decode formatting from messages text to html text
        let messageText = decodeHtml(message.text);
        // who's message is this?
        const myMessage = message.username === this.props.botName;
        // Check to see if this is a Slack System message?
        if (isSystemMessage(message)) {
            // message.text is a system message
            // try to see if it has an attachment in it
            const attachmentFound = hasAttachment(message.text);
            if (attachmentFound && attachmentFound[0]) {
                // An attachment is found
                // Point to file available for download
                if (attachmentFound[1]) {
                    // image file found
                    const didIPostIt = message.text.indexOf(this.fileUploadTitle) > -1;
                    const fileNameFromUrl = attachmentFound[1].split('/');
                    return (
                        <div className={`chat__msgRow ${didIPostIt ? "mine" : "notMind"}`} key={message.ts}>
                            {didIPostIt ? (
                                // show customer image
                                <img src={this.props.userImage} className="user__contact__photo" alt="userIcon" />
                            ) : null}
                            <div className={`chat__message ${didIPostIt ? "mine" : "notMind"}`} key={message.ts}>
                                <strong>Sent an Attachment: </strong>
                                <span>{fileNameFromUrl[fileNameFromUrl.length - 1]}</span>
                                <hr />
                                <a href={attachmentFound[1]} target="_blank">
                                    <span>Click to Download</span>
                                </a>
                            </div>
                            {
                                // Show remote users image only if message isn't customers
                                !didIPostIt ? this.getUserImg(message) : null
                            }
                        </div>
                    );
                }
            }
            // else we display a system message that doesn't belong to
            // anyone
            return (
                <div className="chat__msgRow" key={message.ts}>
                    <div className="chat__message system__message" dangerouslySetInnerHTML={{__html: messageText}} />
                </div>
            );
        }
        // Check to see if this is a hookMessage
        // If yes, we do not display it
        if (isHookMessage(messageText)) {
            return null;
        }
        // check if user was mentioned by anyone else remotely
        const mentioned = wasIMentioned(message, this.props.botName);

        const textHasEmoji = hasEmoji(messageText);
        // check if emoji library is enabled
        if (this.messageFormatter.emoji && textHasEmoji) {
            // parse plain text to emoji
            messageText = emojiParser(messageText);
        }
        return (
            <div className={`chat__msgRow ${myMessage ? "mine" : "notMine"}`} key={message.ts} >
                {myMessage ? (
                    // show customer image
                    <img src={this.props.userImage} className="user__contact__photo" alt="userIcon" />
                ) : null}
                {textHasEmoji ? (
                    // dangerouslySetInnerHTML only if text has Emoji
                    <div className={`chat__message ${mentioned ? "mentioned" : ""}`} dangerouslySetInnerHTML={{__html: messageText}}
                    />
                ) : (
                    // else display it normally
                    <div className={`chat__message ${mentioned ? "mentioned" : ''}`}>
                        <span>{messageText}</span>
                    </div>
                )}
                {
                    // Show remote users image only if message isn't customers
                    !myMessage ? this.getUserImg(message) : null
                }
            </div>
        );
    }

    async connectBot() {

        try {
            let channelData = await getChannels({
                apiToken: this.apiToken,
                bot: this.bot,
                channelFilter: this.props.channels,
                defaultChannel: this.props.defaultChannel,
            });
    
            let teamData = await getUsers({
                apiToken: this.apiToken,
                bot: this.bot,
            });
    
            console.log('got channel and team data ==== ', channelData, teamData);
            let {channels, activeChannel} = channelData;
            let {onlineUsers} = teamData;
            if (activeChannel != "") {
                this.activeChannel = activeChannel;
            } else {
                this.activeChannel = channels[0];
            }
            this.onlineUsers = onlineUsers;
            // return {channels, onlineUsers};

            this.setState({
                onlineUsers: onlineUsers,
                channels: channels,
            });

        } catch (e) {
            console.log(" connectBot : ", e);
            debugLog('could not intialize slack bot', e);
            this.setState({failed: true, });
        }
    }

    postMyMessage() {
        return postMessage({
            bot: this.bot,
            text: this.state.postMyMessage,
            singleUserMode: this.props.singleUserMode,
            ts: this.TS_MAP[this.activeChannel.name || this.activeChannel.name],
            apiToken: this.apiToken,
            channel: this.activeChannel.id,
            username: this.props.botName,
        })
            .then((data) => {
                // single user and no ts thread info stored
                if (
                    this.props.singleUserMode &&
                    !this.TS_MAP[this.activeChannel.name || this.activeChannel.id]
                ) {
                    this.TS_MAP[this.activeChannel.name || this.activeChannel.id] =
                        data.message.thread_ts || data.ts;
                    // update cache map
                    saveChannelMap({TS_MAP: this.TS_MAP});
                }
                this.setState(
                    {
                        postMyMessage: '',
                        sendingLoader: false,
                    },
                    () => {
                        // Adjust scroll height
                        setTimeout(() => {
                            const chatMessages = document.getElementById(
                                'widget-reactSlakChatMessages'
                            );
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }, this.refreshTime);
                    }
                );
                return this.forceUpdate();
            })
            .catch((err) => {
                if (err) {
                    return debugLog('failed to post. Err:', err);
                }
                return null;
            });
    }

    loadMessages(channel) {
        const that = this;
        if (!this.chatInitiatedTs) {
            this.chatInitiatedTs = Date.now() / 1000;
        }
        // define loadMessages function
        const getMessagesFromSlack = () => {
            const messagesLength = that.state.messages.length;
            getMessages({
                bot: this.bot,
                apiToken: this.apiToken,
                channelId: channel.id,
                singleUserMode: this.props.singleUserMode,
                ts: this.TS_MAP[channel.name || channel.id],
            })
                .then((messagesData) => {
                    console.log(" messagesData ", messagesData);
                    // let msg_data = messagesData.messages;
                    // msg_data.map((msg) => {return msg.team === "T02JYPHPQFP" || msg.username === "support-ias-react-bot"});
                    if (!arraysIdentical(this.state.messages, messagesData.messages.reverse())) {
                        // Got new messages
                        // We dont wish to execute action hooks if user opens chat for the first time
                        if (this.state.messages.length !== 0) {
                            // Execute action hooks only if they are really new messages
                            // We know they are really new messages by checking to see if we already have messages in the state
                            // Only if we atleast have some messages in the state
                            // Grab new messages
                            const newMessages = getNewMessages(this.state.messages, messagesData.messages, this.props.botName);
                            this.gotNewMessages(newMessages);
                            // Iterate over the new messages and exec any action hooks if found
                            if (newMessages) {
                                newMessages.map((message) =>
                                    execHooksIfFound({
                                        bot: this.bot,
                                        message,
                                        username: this.props.botName,
                                        customHooks: this.props.hooks,
                                        apiToken: this.apiToken,
                                        channel: this.activeChannel.id,
                                    })
                                )
                            }
                        }
                        // set the state with new messages
                        that.messages = messagesData.messages;
                        if (this.props.defaultMessage) {
                            // add timestamp so list item will have unique key
                            that.messages.unshift({text: this.props.defaultMessage, ts: this.chatInitiatedTs});
                        }
                        return this.setState({messages: that.messages},
                            () => {
                                // if div is already scrolled to bottom, scroll down again just incase a new message has arrived
                                const chatMessages = document.getElementById('widget-reactSlakChatMessages');
                                chatMessages.scrollTop = chatMessages.scrollHeight < chatMessages.scrollTop + 600 || messagesLength === 0
                                    ? chatMessages.scrollHeight : chatMessages.scrollTop;
                            }
                        );
                    }
                })
                .catch((err) => {
                    debugLog(`There was an error loading messages for ${channel.name}. ${err}`);
                    return this.setState({failed: true});
                });
        };
        // Call it once
        getMessagesFromSlack();
        // Set the function to be called at regular intervals
        // get the history of channel at regular intevals
        this.activeChannelInterval = setInterval(getMessagesFromSlack, this.refreshTime);
    }

    getUserImg(message) {
        const userId = message.user || message.username;
        let image;
        this.state.onlineUsers.map((user) => {
            if (user.id === userId) {
                image = user.image;
            }
        });
        const imageToReturn = image ? (
            // Found backend user
            <img src={image} className="chat__contact__photo" alt="mentionedUserImg"
            />
        ) : // Check admin or client user?
            isAdmin(message) ? (
                <img src={`https://robohash.org/${userId}?set=set2`} className="chat__contact__photo" alt={userId}
                />
            ) : // Check system message or client user?
                isSystemMessage(message) ? (
                    <img src={`https://robohash.org/${userId}?set=set3`} className="chat__contact__photo" alt={userId} />
                ) : (
                    // Regular browser client user
                    <img src={`https://robohash.org/${userId}`} className="chat__contact__photo" alt={userId} />
                );
        return imageToReturn;
    }

    handleChange(e) {
        this.setState({
            postMyMessage: e.target.value,
        });
        return;
    }

    handleFileChange(e) {
        debugLog('Going to upload', e.target.value, e.target);
        const fileToUpload = document.getElementById('chat__upload').files[0];
        return this.setState(
            {
                postMyFile: e.target.value,
                // show the loader
                fileUploadLoader: true,
                // Upload file in callback of this setstate
            },
            () =>
                postFile({
                    file: fileToUpload,
                    title: this.fileUploadTitle,
                    apiToken: this.apiToken,
                    channel: this.activeChannel.id,
                })
                    .then(() =>
                        this.setState({
                            // Upload is done, once this callback is hit
                            // We can take off the value and hide the loader
                            postMyFile: '',
                            fileUploadLoader: false,
                        })
                    )
                    .catch((err) => {
                        debugLog('Could not post file', err);
                    })
        );
    }

    goToChannelView(e) {
        // stop propagation so we can prevent any other click events from firing
        e.stopPropagation();
        // Close Chat box only if not already open
        if (this.state.chatbox.active) {
            this.setState({
                chatbox: {
                    active: true,
                    channelActiveView: true,
                    chatActiveView: false,
                },
                messages: [],
            });
            this.activeChannel = [];
            // Clear load messages time interval
            if (this.activeChannelInterval) {
                clearInterval(this.activeChannelInterval);
                this.activeChannelInterval = null;
            }
        }
        return false;
    }

    goToChatView(e, channel) {
        // stop propagation so we can prevent any other click events from firing
        e.stopPropagation();
        // Close Chat box only if not already open
        if (this.state.chatbox.active) {
            this.activeChannel = channel;
            this.setState(
                {
                    chatbox: {
                        active: true,
                        channelActiveView: false,
                        chatActiveView: true,
                    },
                },
                () => {
                    if (this.activeChannelInterval) {
                        clearInterval(this.activeChannelInterval);
                    }
                    // Focus input box
                    const inputTextBox = document.getElementById('chat__input__text');
                    inputTextBox.focus();
                    this.loadMessages(channel);
                }
            );
            // Set this channel as active channel
        }
        return false;
    }

    openChatBox(e) {
        // stop propagation so we can prevent any other click events from firing
        e.stopPropagation();
        // persist click event to stopPropagation later
        e.persist();
        // Open Chat box only if not already open
        console.log("this.state.chatbox.active : ", this.state.chatbox.active, this.activeChannel);
        if (!this.state.chatbox.active) {
            this.setState(
                {
                    chatbox: {
                        active: true,
                        channelActiveView: true,
                        chatActiveView: false,
                    },
                    newMessageNotification: 0,
                },
                () => {
                    // Look to see if an active channel was already chosen...
                    if (Object.keys(this.activeChannel).length > 0) {
                        // If yes, load that chat view instead
                        console.log("ReactSlackChat openChatBox this.activeChannel = : ", this.activeChannel, this.state.chatbox);
                        this.goToChatView(e, this.activeChannel);
                    }
                }
            );
        }
        return false;
    }

    closeChatBox(e) {
        // stop propagation so we can prevent any other click events from firing
        console.log('close-chat-box');
        e.stopPropagation();
        // Close Chat box only if not already open
        if (this.state.chatbox.active) {
            this.setState({
                chatbox: {
                    active: false,
                    channelActiveView: false,
                    chatActiveView: false,
                },
            });
        }
        return false;
    }

    componentDidMount() {
        // Initiate Emoji Library
        // console.log('CONNECTED! componentDidMount got data : ', this.apiToken, this.bot, this.props.channels, this.props.defaultChannel);
        emojiLoader()
            .then(() => {
                this.messageFormatter = {
                    emoji: true,
                };
            })
            .catch((err) => debugLog(`Cant initiate emoji library ${err}`));
        // Connect bot
        // this.connectBot()
        //     .then((data) => {
        //         // debugLog('CONNECTED!', 'got data', data);
        //         this.setState({
        //             onlineUsers: data.onlineUsers,
        //             channels: data.channels,
        //         });
        //     })
        //     .catch((err) => {
        //         console.log("ReactSlackChat  componentDidMount connectBot");
        //         debugLog('could not intialize slack bot', err);
        //         this.setState({failed: true, });
        //     });

        this.connectBot();

        // Look if custom color / theme is needed
        // If yes, change backgrounds
        if (this.props.themeColor) {
            changeColorRecursive(
                document.body,
                this.themeDefaultColor,
                this.props.themeColor
            );
        }

        // // Attach click listener to dom to close chatbox if clicked outside
        window.addEventListener("click", (e) => {
            // Check if chatbox is active
            if (this.state.chatbox.active) {this.closeChatBox(e)}
        });
    }

    render() {
        // If Slack communications have failed or errored out
        // do not render anything
        if (this.state.failed) {
            return false;
        }
        // Looks like nothing failed, let's start to render our chatbox
        // console.log(this.state.chatbox.chatActiveView, this.state.chatbox.active);
        const chatbox = (
            <div>
                <div className={`card_chat transition ${this.state.chatbox.active ? "active" : ''} ${this.state.chatbox.chatActiveView ? "chatActive" : ''}`}
                    onClick={this.openChatBox}
                >
                    <div className="helpHeader">
                        {/* {this.state.newMessageNotification > 0 && (
                            <span className="unreadNotificationsBadge">
                                {this.state.newMessageNotification}
                            </span>
                        )} */}
                        <h2 className="transition"> {this.state.helpText || 'Need Help?'} </h2>
                        <h2 className="subText">Click on a channel to interact.</h2>
                        {/* <button className="btn-primary rounded button-small m-auto" color="primary" size="small" onClick={(e) => {this.closeChatBox(e)}} > &times;</button> */}
                    </div>
                    <div className="card_circle transition" />
                    {/* <div className={`channels transition ${this.state.chatbox.chatActiveView ? "chatActive" : ''}`}>
                        {this.state.channels.map((channel) => (
                            <div className="contact" key={channel.id} onClick={(e) => this.goToChatView(e, channel)}>
                                {channel.icon ? (<img src={channel.icon} className="contact__photo" />) : (
                                    <div dangerouslySetInnerHTML={{__html: defaultChannelIcon}} className="contact__photo" />
                                )}
                                <span className="contact__name">{channel.name}</span>
                                <span className="contact__status online" />
                            </div>
                        ))}
                    </div> */}
                    <div className="chat">
                        <div className="chatHeader">
                            <span className="chat__back" onClick={this.goToChannelView} />
                            <div className="chat__person">
                                <span className="chat__status">status</span>
                                <span className="chat__online active" />
                                <span className="chat__name"> {this.activeChannel.name} </span>
                            </div>
                            {this.activeChannel.icon ? (<img src={this.activeChannel.icon} className="channel__header__photo" />
                            ) : (
                                <img src={defaultChannelIcon} alt="teamICON" className="channel__header__photo" />
                                // <div dangerouslySetInnerHTML={{__html: defaultChannelIcon}} className="channel__header__photo" />
                            )}
                            {this.props.closeChatButton ? (<button className="channel__close__button" onClick={this.closeChatBox}>&times;</button>) : null}
                        </div>
                        <div className="chat__messages" id="widget-reactSlakChatMessages">
                            {this.state.messages.map((message) => this.displayFormattedMessage(message))}
                        </div>
                        <div>
                            {this.state.fileUploadLoader ? (
                                <div className="chat__file__uploading">
                                    <span className="loading">Uploading</span>
                                </div>
                            ) : null}
                            {!this.state.fileUploadLoader ? (
                                <div>
                                    <div className="attachment">
                                        <label htmlFor="chat__upload" className="attachmentIcon" >
                                            <input
                                                type="file"
                                                id="chat__upload"
                                                className="chat__upload"
                                                value={this.state.postMyFile}
                                                onChange={(e) => this.handleFileChange(e)}
                                            />
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        id="chat__input__text"
                                        className="chat__input"
                                        value={this.state.postMyMessage}
                                        placeholder="Enter your message..."
                                        onKeyPress={(e) =>
                                            e.key === 'Enter' ? this.postMyMessage() : null
                                        }
                                        onChange={(e) => this.handleChange(e)}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );

        return <div>{chatbox}</div>;
    }
}

// PropTypes validation
ReactSlackChat.propTypes = {
    apiToken: PropTypes.string.isRequired,
    channels: PropTypes.array.isRequired,
    botName: PropTypes.string,
    helpText: PropTypes.string,
    // bypass the channel list and go directly to a specific channel
    defaultChannel: PropTypes.string,
    // prepend a default message to the beginning of the message list, such as an
    // automatic greeting when a user first joins the channel
    defaultMessage: PropTypes.string,
    // filter messages so the user only sees his/her messages and replies
    // directed at the user in threads on the Slack side
    singleUserMode: PropTypes.bool,
    // add an "x" close button in the corner of the chat window
    closeChatButton: PropTypes.bool,
    themeColor: PropTypes.string,
    userImage: PropTypes.string,
    hooks: PropTypes.array,
    debugMode: PropTypes.bool,
    // handleCloseChatBox: PropTypes.func,
};

export default ReactSlackChat;
