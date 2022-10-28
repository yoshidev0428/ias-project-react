import React, {useState, useRef, useEffect} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import ChatIcon from "@mui/icons-material/Chat";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Logout from "@mui/icons-material/Logout";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import {blue} from "@mui/material/colors";
import {
    mdiChatQuestionOutline
} from '@mdi/js';
import Icon from '@mdi/react';
import {Row, Col, Container} from "react-bootstrap";

import {darkTheme} from "../constant/constants";
import SupportChatSlack from "../tabsRight/SupportChatSlack";

const mapStateToProps = (state) => ({

});

const FooterContent = (props) => {

    const [showChatFlag, setShowChatFlag] = useState(false);


    return (
        <>
            <Box sx={{flexGrow: 1, height: "25px"}}>
                <AppBar className="bg-lightgray color-darkgray" position="static">
                    <Row noGutters>
                        <Col xs={11}>

                        </Col>
                        <Col item xs={1} className="d-flex">
                            <button className='btn btn-sm pt-0 pb-0' style={{width: "50%", marginRight: "0px"}} onClick={() => setShowChatFlag(!showChatFlag)}>
                                <Icon size={0.5}
                                    horizontal
                                    vertical
                                    rotate={180}
                                    color="#EFEFEF"
                                    path={mdiChatQuestionOutline}>
                                </Icon>
                            </button>
                        </Col>
                    </Row>
                </AppBar>
            </Box>
            {
                showChatFlag && <SupportChatSlack />
            }
        </>
    );
}

export default connect(mapStateToProps)(FooterContent);