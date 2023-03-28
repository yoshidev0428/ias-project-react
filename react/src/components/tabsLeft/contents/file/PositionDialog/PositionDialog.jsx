import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import { PositionTabLabels, PositionTabs } from './constants';
import { TabContext, TabList, TabPanel as MuiTabPanel } from '@mui/lab';
import ClosableDialog from '@/components/dialogs/ClosableDialog';
import PanelImages from './PanelImages';
import ExperimentDialog from '../ExperimentDialog';
import { getStaticPath } from '@/helpers/file';

const TabPanel = (props) => (
  <MuiTabPanel {...props} sx={{ p: 0 }}>
    {props.children}
  </MuiTabPanel>
);

const PositionDialog = ({ open, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(PositionTabs.images);

  const [openExpDlg, setOpenExpDlg] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const dialogActions = useMemo(() => {
    switch (selectedTab) {
      case PositionTabs.images:
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenExpDlg(true)}
          >
            Cloud
          </Button>
        );
      default:
        return null;
    }
  }, [selectedTab]);

  const handleTabChange = (_event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSelectImages = (files) => {
    const images = files.map((path) => ({
      url: getStaticPath(path, true),
      filename: path.split('/').slice(-1)[0],
      path: path,
    }));
    setSelectedImages(images);
  };

  const handleRemoveImage = (path) => {
    setSelectedImages((images) => images.filter((img) => img.path !== path));
  };

  return (
    <>
      <ClosableDialog
        title="Position Dialog"
        fullWidth
        maxWidth="md"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'start',
          },
        }}
        actions={
          <>
            {dialogActions}
            <Button color="warning" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </>
        }
      >
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
            <TabList onChange={handleTabChange}>
              {Object.keys(PositionTabs).map((tabId) => (
                <Tab
                  key={tabId}
                  value={tabId}
                  label={PositionTabLabels[tabId]}
                />
              ))}
            </TabList>
          </Box>
          <TabPanel value={PositionTabs.images}>
            <PanelImages
              images={selectedImages}
              onRemoveImage={handleRemoveImage}
            />
          </TabPanel>
          <TabPanel value={PositionTabs.tiling}></TabPanel>
          <TabPanel value={PositionTabs.metadata}></TabPanel>
          <TabPanel value={PositionTabs.naming}></TabPanel>
        </TabContext>
      </ClosableDialog>
      <ExperimentDialog
        open={openExpDlg}
        onClose={() => setOpenExpDlg(false)}
        title="Experiments"
        onSelectFiles={handleSelectImages}
      />
    </>
  );
};

export default PositionDialog;
