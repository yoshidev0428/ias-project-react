import { useCallback, useMemo, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import MuiTabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import { toTiffPath } from '@/helpers/avivator';
import { getImageUrl } from '@/helpers/file';
import { PositionTabLabels, PositionTabs } from './constants';
import ExperimentDialog from '../ExperimentDialog';
import TabImage from './tabs/TabImage';
import TabMetadata from './tabs/TabMetadata';
import TabNaming from './tabs/TabNaming';

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
      case PositionTabs.naming:
        return (
          <>
            <Button variant="contained" color="primary">
              Update
            </Button>
            <Button variant="contained" color="error">
              Clear
            </Button>
          </>
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

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
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
          </DialogTitle>
          <DialogContent sx={{ px: 3, pb: 3 }} dividers>
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
              <TabPanel value={PositionTabs.naming}>
                <TabNaming images={selectedImages} />
              </TabPanel>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            {dialogActions}
            <Button color="warning" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </TabContext>
      </Dialog>
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
