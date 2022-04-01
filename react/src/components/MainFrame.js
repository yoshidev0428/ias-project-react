import * as React from 'react';
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
import LinearProgress from '@mui/material/LinearProgress';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';

import ImageViewer from './ImageViewer';
import DLMLTab from "./tabs/DLMLTab";
import AdjustTab from "./tabs/AdjustTab";
import FilterTab from "./tabs/FilterTab";
import FileTab from "./tabs/FileTab";
import ViewTab from "./tabs/ViewTab";
import MeasureTab from "./tabs/MeasureTab";
import ReportTab from "./tabs/ReportTab";
import SettingsTab from "./tabs/SettingsTab";


import store from "../reducers";
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
const MainFrame = () => {
  const [rightTabVal, setRightTabVal] = React.useState(0);
  
  const [leftTabVal, setLeftTabVal] = React.useState(3);


const handleRightTabChange = (event, newValue) => {
  setRightTabVal(newValue);
};
const handleLeftTabChange = (event, newValue) => {
  setLeftTabVal(newValue);
};
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("click");
    store.dispatch({type:"auth_logOut"});
  };


  const HeaderContent = () =>{
    return (
      <Box sx={{ flexGrow: 1 }}>
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
                <img
                  width="116"
                  height="48"
                  src='./assets/images/logo75.png'
                  alt="Logo"
                />
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
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                </Menu>

                <IconButton
                  size="large"
                >
                  <Avatar sx={{ width: 30, height: 30, bgcolor: blue[500] }}>
                    JM
                  </Avatar>
                </IconButton>

                <IconButton
                  size="large"
                  onClick={handleLogout}
                  color="inherit"
                >
                  <Logout />
                </IconButton>

              </div>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
      </Box>
    );
  }

  return (
    <>
      <HeaderContent/>
      <Container fluid={true} className="pa-0">
        <Row noGutters>
          <Col xs={2} className='border-right p-2'> {/* Left Panel */}
            <div>
              <Tabs variant="scrollable" 
                    scrollButtons="auto" 
                    value={leftTabVal} onChange={handleLeftTabChange} 
                    aria-label="scrollable auto tabs example"
              >
                <Tab style={{ minWidth: "35%" }} icon={<SchoolIcon />} aria-label="school" />
                <Tab style={{ minWidth: "35%" }} icon={<TuneIcon />} aria-label="tune" />
                <Tab style={{ minWidth: "35%" }} icon={<FilterAltIcon />} aria-label="filter" />
                <Tab style={{ minWidth: "35%" }} icon={<InsertDriveFileIcon />} aria-label="file" />
              </Tabs>
              {leftTabVal === 0 && <TabContainer ><DLMLTab /></TabContainer>}
              {leftTabVal === 1 && <TabContainer><AdjustTab /></TabContainer>}
              {leftTabVal === 2 && <TabContainer><FilterTab /></TabContainer>}
              {leftTabVal === 3 && <TabContainer><FileTab/></TabContainer>}
              <LinearProgress variant="determinate" value={30}/>
            </div>
          </Col>
          <Col xs={8}> {/* Central Panel, Viv Image Viewer */}
            <Container>
              <ImageViewer/>
            </Container>
          </Col>
          <Col xs={2} className='border-left p-2'>
            <div>
              <Tabs variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                value={rightTabVal} onChange={handleRightTabChange}
                aria-label="scrollable auto tabs example">
                <Tab style={{ minWidth: "35%" }} variant="fullWidth" icon={<BiotechIcon />} aria-label="BiotechIcon" />
                <Tab style={{ minWidth: "35%" }} variant="fullWidth" icon={<EditOffIcon />} aria-label="EditOffIcon" />
                <Tab style={{ minWidth: "35%" }} variant="fullWidth" icon={<PollIcon />} aria-label="PollIcon" />
                <Tab style={{ minWidth: "35%" }} variant="fullWidth" icon={<EngineeringIcon />} aria-label="EngineeringIcon" />
                <Tab style={{ minWidth: "35%" }} variant="fullWidth" icon={<BiotechIcon />} aria-label="BiotechIcon" />
              </Tabs>
              {rightTabVal === 0 && <TabContainer><ViewTab /></TabContainer>}
              {rightTabVal === 1 && <TabContainer><MeasureTab /></TabContainer>}
              {rightTabVal === 2 && <TabContainer><ReportTab /></TabContainer>}
              {rightTabVal === 3 && <TabContainer><SettingsTab /></TabContainer>}
              {/* {rightTabVal === 4 && <TabContainer><Controller/></TabContainer>} */}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MainFrame;
