import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

import ExpTreeView from '@/components/assemblies/ExpTreeView';
import ExpAutoComplete from '@/components/assemblies/ExpAutoComplete';
import InfoDialog from '@/components/dialogs/InfoDialog';
import ClosableDialog from '@/components/dialogs/ClosableDialog';

import { setExperiment_folder } from '@/api/experiment';
import { getImageByPath } from '@/api/image';

import store from '@/reducers';
import { useExperimentStore } from '@/stores/useExperimentStore';

const OpenFileDialog = ({ handleClose }) => {
  const { experiments, loadExperiments } = useExperimentStore();

  const [experiment, setExperiment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedExp, setSelectedExp] = useState(null);

  useEffect(() => {
    setUploading(true);
    setExperiment(null);
    loadExperiments();
    setUploading(false);
  }, []);

  const handleLoadFile = async () => {
    const path = selectedFile.endsWith('.ome.tiff')
      ? selectedFile
      : selectedFile.replace(/\.\w+/, '.ome.tiff');
    const file = await getImageByPath(path);
    const files = [];
    if (file) files.push(file);
    store.dispatch({ type: 'set_image_path_for_avivator', content: files });
    handleClose();
  };

  const handleUpload = async () => {
    setUploading(true);

    const response = await setExperiment_folder(
      experiment.experiment_name,
      uploadFiles,
    );

    if (response.status === 200 && response.data === true) {
      setSuccessDialog(true);
      loadExperiments(true);
    } else if (response.data.error) {
      alert(response.data.error);
    } else if (response.status !== 200) {
      alert('Server connection is error');
    }

    setUploading(false);
  };

  return (
    <>
      <ClosableDialog title="Files" onClose={handleClose} maxWidth="sm">
        <Grid container direction="row">
          <Grid
            container
            item
            xs
            direction="column"
            justifyContent="space-between"
          >
            <Box flexGrow={1} display="flex" flexDirection="column">
              <Typography mb={2}>Upload Experiment data</Typography>
              <ExpAutoComplete
                value={experiment}
                onChange={setExperiment}
                options={experiments}
                sx={{ mb: 2 }}
              />
              <Dropzone onDrop={(files) => setUploadFiles(files)}>
                {({ getRootProps, getInputProps }) => (
                  <Box {...getRootProps()} flexGrow={1} mb={2}>
                    <input {...getInputProps()} multiple />
                    <Box
                      sx={{
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        textAlign: 'center',
                        alignItems: 'center',
                        border: 'solid lightgray thin',
                        borderRadius: 2,
                      }}
                    >
                      {uploadFiles.length === 0 ? (
                        <span>
                          Drag 'n' drop some files here, or click to select
                          files
                        </span>
                      ) : (
                        <span>Selected {uploadFiles.length} files</span>
                      )}
                    </Box>
                  </Box>
                )}
              </Dropzone>
            </Box>
            <Button
              variant="outlined"
              color="info"
              fullWidth
              disabled={!experiment || !uploadFiles.length || uploading}
              onClick={handleUpload}
            >
              {uploading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
          </Grid>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ mx: 3, my: -3 }}
          />
          <Grid container item xs spacing={2}>
            <Grid item xs={12}>
              <Typography>Experiment Data Sources</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: 300,
                  pt: 1,
                  overflow: 'auto',
                  border: 'solid lightgray thin',
                  borderRadius: 1,
                }}
              >
                <ExpTreeView
                  data={experiments}
                  onSelectFile={(file) => setSelectedFile(file)}
                  onSelectExp={(exp) => {
                    setSelectedExp(exp);
                    setSelectedFile(null);
                  }}
                />
              </Box>
            </Grid>
            <Grid item container xs={12} spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!selectedFile}
                  onClick={handleLoadFile}
                >
                  Load
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  disabled={!selectedFile && !selectedExp}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ClosableDialog>
      <InfoDialog
        open={successDialog}
        title="Uploading images"
        onClose={() => setSuccessDialog(false)}
      >
        Uploading completed successfully
      </InfoDialog>
    </>
  );
};

export default OpenFileDialog;
