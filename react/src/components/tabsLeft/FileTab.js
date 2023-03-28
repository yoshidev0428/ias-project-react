import React, { useState, useRef } from 'react';
import TabItem from '../custom/TabItem';
import SmallCard from '../custom/SmallCard';
import CustomButton from '../custom/CustomButton';
import Divider from '@mui/material/Divider';
import ExperimentDialog from './contents/file/ExperimentDialog';
import OpenPositionDialog from './contents/file/PositionDialog/PositionDialog';
import {
  mdiCloudDownloadOutline,
  mdiEmailNewsletter,
  mdiFolderOpenOutline,
  mdiDotsGrid,
  mdiContentSaveOutline,
  mdiContentSaveEditOutline,
  mdiUpload,
  mdiDownload,
  mdiContentCut,
  mdiContentCopy,
  mdiContentPaste,
  mdiFileOutline,
  mdiNearMe,
  mdiPencil,
  mdiCheckboxBlankCircleOutline,
  mdiDotsVertical,
  mdiVectorRectangle,
  mdiSquareEditOutline,
  mdiTrashCanOutline,
  mdiSortClockDescendingOutline,
  mdiSortClockAscending,
  mdiCog,
} from '@mdi/js';

import { connect } from 'react-redux';
import store from '../../reducers';

const mapStateToProps = (state) => ({
  isFilesAvailable: state.files.isFilesAvailable,
  filesChosen: state.vessel.selectedVesselHole,
  isFilesChosenAvailable: state.files.isFilesChosenAvailable,
  content: state.files.content,
  selectedVesselHole: state.vessel.selectedVesselHole,
});

const FileTab = (props) => {
  const swapDimension = (isEntire) => {
    const { content, selectedVesselHole } = props;

    let newContent = [];
    for (let i = 0; i < content.length; i++) {
      if (
        isEntire ||
        (content[i].row === selectedVesselHole.row &&
          content[i].col === selectedVesselHole.col)
      ) {
        let tempContent = { ...content[i] };
        const tempVal = tempContent.z;
        tempContent.z = tempContent.time;
        tempContent.time = tempVal;
        tempContent.dimensionChanged = !tempContent.dimensionChanged;
        newContent.push(tempContent);
      }
    }

    store.dispatch({ type: 'content_addContent', content: newContent });
  };

  const onChangeDimensionZ2T = () => {
    swapDimension(false);
  };

  const onChangeDimensionT2Z = () => {
    swapDimension(false);
  };

  const onChangeDimensionSet = () => {
    swapDimension(true);
  };

  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [openUploadFolder, setOpenUploadFolder] = useState(false);
  const [isOnPosition, setIsOnPosition] = useState(false);
  const [positionDialog, setpositionDialog] = useState(false);

  const showPositionDialog = () => {
    setpositionDialog(true);
  };

  const handleCloseUpload = () => {
    setOpenUploadFile(false);
    setOpenUploadFolder(false);
  };

  return (
    <TabItem title="File/Edit">
      <SmallCard title="Open">
        <CustomButton
          icon={mdiCloudDownloadOutline}
          label="Cloud"
          click={() => {
            setIsOnPosition(false);
            setOpenUploadFolder(true);
          }}
        />
        <CustomButton
          icon={mdiEmailNewsletter}
          label="File"
          click={() => setOpenUploadFile(true)}
        />
        <CustomButton
          icon={mdiFolderOpenOutline}
          label="Folder"
          click={() => {
            setIsOnPosition(false);
            setOpenUploadFolder(true);
          }}
        />
        <CustomButton
          icon={mdiDotsGrid}
          label="Position"
          click={() => showPositionDialog(true)}
        />
      </SmallCard>
      <Divider />
      <SmallCard title="Save / Load">
        <CustomButton icon={mdiContentSaveOutline} label="Save" />
        <CustomButton icon={mdiContentSaveEditOutline} label="SaveAs" />
        <CustomButton icon={mdiUpload} label="Export" />
        <CustomButton icon={mdiDownload} label="Load" />
      </SmallCard>
      <Divider />
      <SmallCard title="Edit">
        <CustomButton icon={mdiContentCut} label="Cut" />
        <CustomButton icon={mdiContentCopy} label="Copy" />
        <CustomButton icon={mdiContentPaste} label="Paste" />
        <CustomButton icon={mdiFileOutline} label="New" />
      </SmallCard>
      <Divider />
      <SmallCard title="Comment">
        <div
          className="d-flex justify-content-around"
          style={{ width: '100%' }}
        >
          <CustomButton icon={mdiNearMe} />
          <CustomButton icon={mdiPencil} />
          <CustomButton icon={mdiCheckboxBlankCircleOutline} />
          <CustomButton icon={mdiDotsVertical} />
          <CustomButton icon={mdiVectorRectangle} />
          <CustomButton icon={mdiSquareEditOutline} />
          <CustomButton icon={mdiTrashCanOutline} />
        </div>
      </SmallCard>
      <Divider />
      <SmallCard title="Change Dimension">
        <CustomButton icon={mdiSortClockDescendingOutline} label="Z->T" />
        <CustomButton icon={mdiSortClockAscending} label="T->Z" />
        <CustomButton icon={mdiCog} label="Set" />
      </SmallCard>
      <ExperimentDialog
        open={openUploadFile || openUploadFolder}
        onClose={handleCloseUpload}
        folderUploadable={openUploadFolder}
        isOnPosition={isOnPosition}
      />
      <OpenPositionDialog
        open={positionDialog}
        onClose={() => setpositionDialog(false)}
      />
    </TabItem>
  );
};

export default connect(mapStateToProps)(FileTab);
