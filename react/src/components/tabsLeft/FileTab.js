import React, { useState, useRef } from 'react';
import TabItem from '../custom/TabItem';
import SmallCard from '../custom/SmallCard';
import CustomButton from '../custom/CustomButton';
import Divider from '@mui/material/Divider';
import UploadDialog from './contents/file/UploadDialog';
import OpenPositionDialog from './contents/file/OpenPositionDialog';
// import * as api_experiment from "../../api/experiment";
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
  const onSave = () => {};
  const onSaveAs = () => {};
  const onExport = () => {};
  const onLoad = () => {};
  const onCut = () => {};
  const onCopy = () => {};
  const onPaste = () => {};
  const onNew = () => {};
  const onSelect1 = () => {};

  const swapDimension = (isEntire) => {
    const { content, selectedVesselHole } = props;

    let newContent = [];
    for (let i = 0; i < content.length; i++) {
      if (
        isEntire ||
        (content[i].row == selectedVesselHole.row &&
          content[i].col == selectedVesselHole.col)
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
  const [positionDialog, setpositionDialog] = useState(false);

  const showPositionDialog = () => {
    setpositionDialog(true);
  };

  const handleCloseUpload = () => {
    setOpenUploadFile(false);
    setOpenUploadFolder(false);
  };

  const handleClose = () => {
    setpositionDialog(false);
  };

  return (
    <TabItem title="File/Edit">
      <SmallCard title="Open">
        <CustomButton
          icon={mdiCloudDownloadOutline}
          label="Cloud"
          click={() => setOpenUploadFolder(true)}
        />
        <CustomButton
          icon={mdiEmailNewsletter}
          label="File"
          click={() => setOpenUploadFile(true)}
        />
        <CustomButton
          icon={mdiFolderOpenOutline}
          label="Folder"
          click={() => setOpenUploadFolder(true)}
        />
        <CustomButton
          icon={mdiDotsGrid}
          label="Position"
          click={() => showPositionDialog(true)}
        />
        {positionDialog && (
          <OpenPositionDialog
            title=" "
            handleClose={handleClose}
            setCloudDialog={() => setOpenUploadFolder(true)}
            cloudDialogClose={() => setOpenUploadFolder(false)}
          />
        )}
      </SmallCard>
      <Divider />
      <SmallCard title="Save / Load">
        <CustomButton
          icon={mdiContentSaveOutline}
          label="Save"
          click={onSave}
        />
        <CustomButton
          icon={mdiContentSaveEditOutline}
          label="SaveAs"
          click={onSaveAs}
        />
        <CustomButton icon={mdiUpload} label="Export" click={onExport} />
        <CustomButton icon={mdiDownload} label="Load" click={onLoad} />
      </SmallCard>
      <Divider />
      <SmallCard title="Edit">
        <CustomButton icon={mdiContentCut} label="Cut" click={onCut} />
        <CustomButton icon={mdiContentCopy} label="Copy" click={onCopy} />
        <CustomButton icon={mdiContentPaste} label="Paste" click={onPaste} />
        <CustomButton icon={mdiFileOutline} label="New" click={onNew} />
      </SmallCard>
      <Divider />
      <SmallCard title="Comment">
        <div
          className="d-flex justify-content-around"
          style={{ width: '100%' }}
        >
          <CustomButton icon={mdiNearMe} click={onSelect1} />
          <CustomButton icon={mdiPencil} click={onSelect1} />
          <CustomButton
            icon={mdiCheckboxBlankCircleOutline}
            click={onSelect1}
          />
          <CustomButton icon={mdiDotsVertical} click={onSelect1} />
          <CustomButton icon={mdiVectorRectangle} click={onSelect1} />
          <CustomButton icon={mdiSquareEditOutline} click={onSelect1} />
          <CustomButton icon={mdiTrashCanOutline} click={onSelect1} />
        </div>
      </SmallCard>
      <Divider />
      <SmallCard title="Change Dimension">
        <CustomButton
          icon={mdiSortClockDescendingOutline}
          label="Z->T"
          click={onChangeDimensionZ2T}
        />
        <CustomButton
          icon={mdiSortClockAscending}
          label="T->Z"
          click={onChangeDimensionT2Z}
        />
        <CustomButton icon={mdiCog} label="Set" click={onChangeDimensionSet} />
      </SmallCard>
      <UploadDialog
        open={openUploadFile || openUploadFolder}
        onClose={handleCloseUpload}
        folderUploadable={openUploadFolder}
      />
    </TabItem>
  );
};

export default connect(mapStateToProps)(FileTab);
