import { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { PositionTabLabels, PositionTabs } from './tabs/constants';
import TabImage from './tabs/TabImage';
import TabMetadata from './tabs/TabMetadata';
import TabNaming from './tabs/TabNaming';

const TabPanel = ({ value, selected, children }) =>
  value === selected ? children : null;

const PositionDialog = ({ open, onClose }) => {
  const [selectedTab, setSelectedTab] = useState(PositionTabs.images);

  const handleTabChange = (_event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'start',
        },
      }}
    >
      <TabContext value={selectedTab}>
        <DialogTitle sx={{ m: 0, p: 0 }}>
          <Box sx={{ px: 3, pt: 2, pb: 1 }}>
            Position Dialog
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 12,
                top: 12,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ borderTop: 1, borderColor: 'divider', px: 3 }}>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              {Object.keys(PositionTabs).map((tabId) => (
                <Tab
                  key={tabId}
                  value={tabId}
                  label={PositionTabLabels[tabId]}
                />
              ))}
            </Tabs>
          </Box>
        </DialogTitle>
        <TabPanel value={PositionTabs.images} selected={selectedTab}>
          <TabImage onClose={onClose} />
        </TabPanel>
        <TabPanel value={PositionTabs.tiling} selected={selectedTab}></TabPanel>
        <TabPanel value={PositionTabs.metadata} selected={selectedTab}>
          <TabMetadata />
        </TabPanel>
        <TabPanel value={PositionTabs.naming} selected={selectedTab}>
          <TabNaming />
        </TabPanel>
      </TabContext>
    </Dialog>
  );
};

export default PositionDialog;
