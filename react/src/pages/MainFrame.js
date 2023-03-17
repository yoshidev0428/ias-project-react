import React, { useState, useRef, useEffect, Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Icon from '@mdi/react';
import Avatar from '@mui/material/Avatar';
import Logout from '@mui/icons-material/Logout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { Row, Col, Container } from 'react-bootstrap';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SchoolIcon from '@mui/icons-material/School';
import TuneIcon from '@mui/icons-material/Tune';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import BiotechIcon from '@mui/icons-material/Biotech';
import EditOffIcon from '@mui/icons-material/EditOff';
import PollIcon from '@mui/icons-material/Poll';
import EngineeringIcon from '@mui/icons-material/Engineering';
import Avivator from '@/components/avivator/Avivator';
import SupportChatSlack from '../components/slackChat/SupportChatSlack';

import DLMLTab from '../components/tabsLeft/DLMLTab';
import AdjustTab from '../components/tabsLeft/AdjustTab';
import FilterTab from '../components/tabsLeft/FilterTab';
import FileTab from '../components/tabsLeft/FileTab';

import ViewTab from '../components/tabsRight/ViewTab';
import MeasureTab from '../components/tabsRight/MeasureTab';
import ReportTab from '../components/tabsRight/ReportTab';
import SettingsTab from '../components/tabsRight/SettingsTab';

import store from '../reducers';
import { connect } from 'react-redux';
import { getWindowDimensions } from '@/helpers/browser';
import { mdiChatQuestionOutline } from '@mdi/js';
import logo75 from '../assets/images/logo75.png';

import UserPage from './user';
import AccountPage from './account';
import { useSelector } from 'react-redux';

import LoadingDialog from '@/components/custom/LoadingDialog';
import { useChannelsStore, useFlagsStore } from '@/state';
import shallow from 'zustand/shallow';
import Colors from '@/constants/colors';
import { useImage } from '@/hooks/use-image';
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 0 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const mapStateToProps = (state) => ({
  isFilesAvailable: state.files.isFilesAvailable,
  filesChosen: state.vessel.selectedVesselHole,
  isFilesChosenAvailable: state.files.isFilesChosenAvailable,
  currentVesseelCount: state.vessel.currentVesseelCount,
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const fixedBarHeight = 91;
const MainFrame = (props) => {
  const { currentVesseelCount } = props;
  const [userPage, setUserPage] = useState(false);
  const [accountPage, setAccountPage] = useState(false);
  const [vivPage, setVivPage] = useState(true);
  const [showChatFlag, setShowChatFlag] = useState(false);
  const imagePathForAvivator = useSelector(
    (state) => state.files.imagePathForAvivator,
  );

  useImage(imagePathForAvivator);

  const DialogLoadingFlag = useFlagsStore((store) => store.DialogLoadingFlag);
  const { channelsVisible, colors, setChannleVisible, setChannelsVisible } =
    useChannelsStore((state) => state, shallow);

  const imageViewAreaRef = useRef(null);
  const [height, setHeight] = useState(100);
  const handleResize = () => {
    let { height } = getWindowDimensions();
    setHeight(height);
    localStorage.setItem(
      'imageViewSizeWidth',
      imageViewAreaRef.current.offsetWidth,
    );
    localStorage.setItem('imageViewSizeHeight', height - fixedBarHeight);
  };

  const channels = useMemo(
    () =>
      colors.map((color, idx) => ({
        ...Object.values(Colors).find(
          (c) => c.rgbValue.toString() === color.toString(),
        ),
        id: idx,
        color: color.toString() === '255,255,255' ? 'gray' : `rgb(${color})`,
      })),
    [colors],
  );

  const [rightTabVal, setRightTabVal] = useState(0);
  const [leftTabVal, setLeftTabVal] = useState(3);
  const handleRightTabChange = (newValue) => {
    setRightTabVal(newValue);
  };
  const handleLeftTabChange = (newValue) => {
    setLeftTabVal(newValue);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    store.dispatch({ type: 'auth_logOut' });
  };
  const handleUserPage = () => {
    setAccountPage(false);
    setVivPage(false);
    setUserPage(true);
  };
  const handleOpenAccount = () => {
    setUserPage(false);
    setVivPage(false);
    setAccountPage(true);
  };
  const handleOpenViv = () => {
    setUserPage(false);
    setAccountPage(false);
    setVivPage(true);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.addEventListener('resize', handleResize);
    };
  }, [imageViewAreaRef]);
  console.log('vessel--->', currentVesseelCount);
  const HeaderContent = () => {
    // const [showChatFlag, setShowChatFlag] = useState(false);
    const user = useSelector((state) => state.auth.user);
    let initialName = '';
    if (user.fullName.length > 0) {
      const nameArray = user.fullName.split(' ');
      nameArray.forEach((name) => {
        if (name.length <= 0) return;
        initialName += name.charAt(0).toUpperCase();
      });
    }

    return (
      <Box sx={{ flexGrow: 1, height: '65px' }}>
        <ThemeProvider theme={darkTheme}>
          <AppBar className="main-header" position="static">
            <Toolbar>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <img width="116" height="48" src={logo75} alt="Logo" />
              </Typography>
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleOpenViv}>My Workspace</MenuItem>
                  <MenuItem onClick={handleOpenAccount}>My account</MenuItem>
                </Menu>
                <IconButton size="large" onClick={handleUserPage}>
                  <Avatar sx={{ width: 30, height: 30, bgcolor: blue[500] }}>
                    {' '}
                    {initialName}{' '}
                  </Avatar>
                </IconButton>
                <IconButton size="large" onClick={handleLogout} color="inherit">
                  <Logout />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
      </Box>
    );
  };
  const FooterContent = () => {
    return (
      <>
        {/* <SupportChatSlack /> */}
        <Box
          style={{
            bottom: '0px',
            backgroundColor: '#212529',
            display: 'flex',
            position: 'fixed',
            width: '100%',
          }}
        >
          <button
            className="btn btn-sm pt-0 pb-0"
            style={{ marginLeft: 'auto', marginRight: '280px' }}
            onClick={() => {
              setShowChatFlag(!showChatFlag);
            }}
          >
            <Icon
              size={1}
              horizontal
              vertical
              rotate={180}
              color="#EFEFEF"
              path={mdiChatQuestionOutline}
            ></Icon>
          </button>
        </Box>
      </>
    );
  };

  const renderPart = (rowCount, index) => {
    return (
      <Col
        ref={imageViewAreaRef}
        style={{
          backgroundColor: '#ddd',
          height: ((height - fixedBarHeight) / rowCount).toString() + 'px',
          overflowY: 'auto',
          border: '1px solid black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {userPage && <UserPage />}
        {accountPage && <AccountPage />}
        {vivPage &&
          (index <= channels.length + 1 ? (
            <Avivator source={imagePathForAvivator} index={index} />
          ) : (
            <Avivator index={index} />
          ))}
      </Col>
    );
  };
  console.log('mainframe-channel-count', channels.length, imagePathForAvivator);
  return (
    <>
      <HeaderContent />
      <Container
        fluid={true}
        className="p-0"
        style={{ height: (height - fixedBarHeight).toString() + 'px' }}
      >
        <Row noGutters>
          <Col
            xs={2}
            className="p-2 border-right"
            style={{
              height: (height - fixedBarHeight).toString() + 'px',
              overflowY: 'auto',
            }}
          >
            {' '}
            {/* Left Panel */}
            <div className="card border">
              <Tabs
                // variant="scrollable"
                value={leftTabVal}
                aria-label="tabs example"
                TabIndicatorProps={{
                  style: {
                    flexDirection: 'row-right',
                    justifyContent: 'flex-start',
                  },
                }}
              >
                <Tab
                  className="tab-button"
                  key={0}
                  icon={<SchoolIcon />}
                  aria-label="school"
                  value={0}
                  onFocus={() => handleLeftTabChange(0)}
                />
                <Tab
                  className="tab-button"
                  key={1}
                  icon={<TuneIcon />}
                  aria-label="tune"
                  value={1}
                  onFocus={() => handleLeftTabChange(1)}
                />
                <Tab
                  className="tab-button"
                  key={2}
                  icon={<FilterAltIcon />}
                  aria-label="filter"
                  value={2}
                  onFocus={() => handleLeftTabChange(2)}
                />
                <Tab
                  className="tab-button"
                  key={3}
                  icon={<InsertDriveFileIcon />}
                  aria-label="file"
                  value={3}
                  onFocus={() => handleLeftTabChange(3)}
                />
              </Tabs>
              {leftTabVal === 0 && (
                <TabContainer>
                  <DLMLTab />
                </TabContainer>
              )}
              {leftTabVal === 1 && (
                <TabContainer>
                  <AdjustTab />
                </TabContainer>
              )}
              {leftTabVal === 2 && (
                <TabContainer>
                  <FilterTab />
                </TabContainer>
              )}
              {leftTabVal === 3 && (
                <TabContainer>
                  <FileTab />
                </TabContainer>
              )}
            </div>
          </Col>
          <Col xs={8} className="render-container">
            {channels.length + 1 == 1 && renderPart(1, 1)}
            {channels.length + 1 == 2 && (
              <>
                {renderPart(2, 1)}
                {renderPart(2, 2)}
              </>
            )}
            {channels.length + 1 <= 4 && channels.length + 1 > 2 && (
              <Fragment>
                <Row>
                  <Col xs={6}>
                    {renderPart(2, 1)}
                    {renderPart(2, 3)}
                  </Col>
                  <Col xs={6}>
                    {renderPart(2, 2)}
                    {renderPart(2, 4)}
                  </Col>
                </Row>
              </Fragment>
            )}
            {channels.length + 1 <= 6 && channels.length + 1 > 4 && (
              <Fragment>
                <Row>
                  <Col xs={4}>
                    {renderPart(2, 1)}
                    {renderPart(2, 4)}
                  </Col>
                  <Col xs={4}>
                    {renderPart(2, 2)}
                    {renderPart(2, 5)}
                  </Col>
                  <Col xs={4}>
                    {renderPart(2, 3)}
                    {renderPart(2, 6)}
                  </Col>
                </Row>
              </Fragment>
            )}
            {channels.length + 1 <= 9 && channels.length + 1 > 6 && (
              <Fragment>
                <Row>
                  <Col xs={4}>
                    {renderPart(3, 1)}
                    {renderPart(3, 4)}
                    {renderPart(3, 7)}
                  </Col>
                  <Col xs={4}>
                    {renderPart(3, 2)}
                    {renderPart(3, 5)}
                    {renderPart(3, 8)}
                  </Col>
                  <Col xs={4}>
                    {renderPart(3, 3)}
                    {renderPart(3, 6)}
                    {renderPart(3, 9)}
                  </Col>
                </Row>
              </Fragment>
            )}
            {channels.length + 1 <= 12 && channels.length + 1 > 9 && (
              <Fragment>
                <Row>
                  <Col xs={3}>
                    {renderPart(3, 1)}
                    {renderPart(3, 5)}
                    {renderPart(3, 9)}
                  </Col>
                  <Col xs={3}>
                    {renderPart(3, 2)}
                    {renderPart(3, 6)}
                    {renderPart(3, 10)}
                  </Col>
                  <Col xs={3}>
                    {renderPart(3, 3)}
                    {renderPart(3, 7)}
                    {renderPart(3, 11)}
                  </Col>
                  <Col xs={3}>
                    {renderPart(3, 4)}
                    {renderPart(3, 8)}
                    {renderPart(3, 12)}
                  </Col>
                </Row>
              </Fragment>
            )}
            {channels.length + 1 <= 16 && channels.length + 1 > 12 && (
              <Fragment>
                <Row>
                  <Col xs={3}>
                    {renderPart(4, 1)}
                    {renderPart(4, 5)}
                    {renderPart(4, 9)}
                    {renderPart(4, 13)}
                  </Col>
                  <Col xs={3}>
                    {renderPart(4, 2)}
                    {renderPart(4, 6)}
                    {renderPart(4, 10)}
                    {renderPart(4, 14)}
                  </Col>
                  <Col xs={3}>
                    {renderPart(4, 3)}
                    {renderPart(4, 7)}
                    {renderPart(4, 11)}
                    {renderPart(4, 15)}
                  </Col>
                  <Col xs={3}>
                    {renderPart(4, 4)}
                    {renderPart(4, 8)}
                    {renderPart(4, 12)}
                    {renderPart(4, 16)}
                  </Col>
                </Row>
              </Fragment>
            )}
            {channels.length + 1 <= 20 && channels.length + 1 > 16 && (
              <Fragment>
                <Row>
                  <Col xs={3}>
                    {renderPart(5, 1)}
                    {renderPart(5, 5)}
                    {renderPart(5, 9)}
                    {renderPart(5, 13)}
                    {renderPart(5, 17)}
                  </Col>
                  <Col xs={3}>
                    {renderPart(5, 2)}
                    {renderPart(5, 6)}
                    {renderPart(5, 10)}
                    {renderPart(5, 14)}
                    {renderPart(5, 18)}
                  </Col>
                  <Col xs={3}>
                    {renderPart(5, 3)}
                    {renderPart(5, 7)}
                    {renderPart(5, 11)}
                    {renderPart(5, 15)}
                    {renderPart(5, 19)}
                  </Col>
                  <Col xs={3}>
                    {renderPart(5, 4)}
                    {renderPart(5, 8)}
                    {renderPart(5, 12)}
                    {renderPart(5, 16)}
                    {renderPart(5, 20)}
                  </Col>
                </Row>
              </Fragment>
            )}
          </Col>
          <Col
            xs={2}
            className="border-left p-2"
            style={{
              height: (height - fixedBarHeight).toString() + 'px',
              overflowY: 'auto',
            }}
          >
            <div className="card border">
              <Tabs
                allowScrollButtonsMobile
                value={rightTabVal}
                aria-label="scrollable auto tabs example"
              >
                <Tab
                  className="tab-button"
                  variant="fullWidth"
                  icon={<BiotechIcon />}
                  aria-label="BiotechIcon"
                  onFocus={() => handleRightTabChange(0)}
                />
                <Tab
                  className="tab-button"
                  variant="fullWidth"
                  icon={<EditOffIcon />}
                  aria-label="EditOffIcon"
                  onFocus={() => handleRightTabChange(1)}
                />
                <Tab
                  className="tab-button"
                  variant="fullWidth"
                  icon={<PollIcon />}
                  aria-label="PollIcon"
                  onFocus={() => handleRightTabChange(2)}
                />
                <Tab
                  className="tab-button"
                  variant="fullWidth"
                  icon={<EngineeringIcon />}
                  aria-label="EngineeringIcon"
                  onFocus={() => handleRightTabChange(3)}
                />
              </Tabs>
              {rightTabVal === 0 && (
                <TabContainer>
                  <ViewTab />
                </TabContainer>
              )}
              {rightTabVal === 1 && (
                <TabContainer>
                  <MeasureTab />
                </TabContainer>
              )}
              {rightTabVal === 2 && (
                <TabContainer>
                  <ReportTab />
                </TabContainer>
              )}
              {rightTabVal === 3 && (
                <TabContainer>
                  <SettingsTab />
                </TabContainer>
              )}
            </div>
          </Col>
        </Row>
      </Container>
      {showChatFlag && (
        <SupportChatSlack
          updateShowFlag={() => {
            setShowChatFlag(false);
          }}
        />
      )}
      {DialogLoadingFlag && <LoadingDialog />}
      <FooterContent />
    </>
  );
};

export default connect(mapStateToProps)(MainFrame);
