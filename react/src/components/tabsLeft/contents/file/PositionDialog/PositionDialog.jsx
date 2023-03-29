import React, { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TabContext, TabList, TabPanel as MuiTabPanel } from '@mui/lab';
import ClosableDialog from '@/components/dialogs/ClosableDialog';
import TabImage from './tabs/TabImage';
import ExperimentDialog from '../ExperimentDialog';
import { PositionTabLabels, PositionTabs } from './constants';
import { getImageUrl } from '@/helpers/file';
import TabMetadata from './tabs/TabMetadata';
import { toTiffPath } from '@/helpers/avivator';

const PositionDialog = ({ open, onClose }) => {
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

  const TabPanel = useCallback(
    (props) => (
      <MuiTabPanel {...props} sx={{ p: 0 }}>
        {selectedImages.length === 0 ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={300}
          >
            <Typography>No images selected</Typography>
          </Box>
        ) : (
          props.children
        )}
      </MuiTabPanel>
    ),
    [selectedImages],
  );

  const handleTabChange = (_event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSelectImages = (files) => {
    const images = files.map((path) => ({
      url: getImageUrl(path, true),
      tiffUrl: getImageUrl(toTiffPath(path), true, true),
      filename: path.split('/').slice(-1)[0],
      path: path,
    }));
    setSelectedImages(images);
  };

  const handleRemoveImage = (path) => {
    setSelectedImages((images) => images.filter((img) => img.path !== path));
  };

  const handleExit = () => {
    setSelectedTab(PositionTabs.images);
    setSelectedImages([]);
    onClose();
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
            <Button color="error" variant="outlined" onClick={handleExit}>
              Exit
            </Button>
            <Button color="warning" variant="outlined" onClick={onClose}>
              Close
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
          <Box sx={{ minHeight: 300 }}>
            <TabPanel value={PositionTabs.images}>
              <TabImage
                images={selectedImages}
                onRemoveImage={handleRemoveImage}
              />
            </TabPanel>
            <TabPanel value={PositionTabs.tiling}></TabPanel>
            <TabPanel value={PositionTabs.metadata}>
              <TabMetadata images={selectedImages} />
            </TabPanel>
            <TabPanel value={PositionTabs.naming}></TabPanel>
          </Box>
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
