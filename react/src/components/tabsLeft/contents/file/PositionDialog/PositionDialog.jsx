import { useCallback, useEffect, useMemo, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import MuiTabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import { uploadTiles } from '@/api/tiling';
import BoxCenter from '@/components/mui/BoxCenter';
import CircularProgress from '@mui/material/CircularProgress';
import ExperimentDialog from '../ExperimentDialog';
import { PositionTabLabels, PositionTabs } from './constants';
import TabImage from './tabs/TabImage';
import TabMetadata from './tabs/TabMetadata';
import TabNaming from './tabs/TabNaming';
import useTilingStore from '@/stores/useTilingStore';

const PositionDialog = ({ open, onClose }) => {
  const [selectedTab, setSelectedTab] = useState(PositionTabs.images);
  const [loading, setLoading] = useState(false);
  const [openExpDlg, setOpenExpDlg] = useState(false);

  const { tiles, loadTiles, setTiles } = useTilingStore();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadTiles();
  }, []);

  const handleTabChange = (_event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleUploadFiles = async () => {
    setLoading(true);
    const tiles = await uploadTiles(files);
    setTiles(tiles);
    setLoading(false);
  };

  const handleAdd = () => {};

  const dialogActions = useMemo(() => {
    switch (selectedTab) {
      case PositionTabs.images:
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              disabled={files.length === 0}
              onClick={handleUploadFiles}
            >
              Upload
            </Button>
            {tiles.length > 0 && (
              <Button variant="contained" color="info" onClick={handleAdd}>
                Add Images
              </Button>
            )}
            <Button
              variant="outlined"
              color="success"
              onClick={() => setOpenExpDlg(true)}
            >
              Cloud
            </Button>
          </>
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
  }, [selectedTab, files, tiles]);

  const TabPanel = useCallback(
    (props) => (
      <MuiTabPanel {...props} sx={{ p: 0 }}>
        {tiles.length === 0 && selectedTab !== PositionTabs.images ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={300}
          >
            <Typography>No images selected</Typography>
          </Box>
        ) : loading ? (
          <BoxCenter height={300}>
            <CircularProgress />
          </BoxCenter>
        ) : (
          props.children
        )}
      </MuiTabPanel>
    ),
    [tiles, loading, selectedTab],
  );

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
                <TabImage tiles={tiles} onChange={(files) => setFiles(files)} />
              </TabPanel>
              <TabPanel value={PositionTabs.tiling}></TabPanel>
              <TabPanel value={PositionTabs.metadata}>
                <TabMetadata />
              </TabPanel>
              <TabPanel value={PositionTabs.naming}>
                <TabNaming />
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
      />
    </>
  );
};

export default PositionDialog;
