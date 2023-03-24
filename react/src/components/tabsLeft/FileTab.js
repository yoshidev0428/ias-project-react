import React, { useState, useRef } from 'react';
import TabItem from '../custom/TabItem';
import SmallCard from '../custom/SmallCard';
import CustomButton from '../custom/CustomButton';
import Divider from '@mui/material/Divider';
import OpenFileDialog from './contents/file/OpenFileDialog';
import OpenFolderUpload from './contents/file/OpenFolderUpload';
import OpenPositionDialog from './contents/file/OpenPositionDialog';
import OpenCloudUploadNew from './contents/file/OpenCloudUpload';
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
  // const refresh = () => {
  // };
  // const help = () => {
  // };
  // buttons={true} refresh={refresh} help={help}
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

  const [cloudDialog, setcloudDialog] = useState(false);
  const [folderDialog, setFolderDialog] = useState(false);
  const [fileDialog, setfileDialog] = useState(false);
  const [selectTab, setSelectTab] = useState(0);
  const [positionDialog, setpositionDialog] = useState(false);
  const [cloudDialogClose, setCloudDialogClose] = useState(false);
  const [_fileDialogClose, setfileDialogClose] = useState(false);
  const [_folderDialogClose, setFolderDialogClose] = useState(false);
  const [_filesUploaded] = useState([]);
  const [treeData] = useState([]);
  const [folderDialogFlag, setFolderDialogFlag] = useState(false);

  const showPositionDialog = () => {
    setpositionDialog(true);
  };
  const setCloudDialog = () => {
    setcloudDialog(true);
    setCloudDialogClose(false);
  };

  const handleClose = () => {
    setpositionDialog(false);
  };
  const handleCloudClose = () => {
    setcloudDialog(false);
    setCloudDialogClose(true);
  };
  const setFileDialog = () => {
    setfileDialog(true);
    setfileDialogClose(false);
  };
  const handleFileClose = () => {
    setfileDialog(false);
    setfileDialogClose(true);
  };
  // const setfolderDialog = () => {
  //     setFolderDialog(true);
  //     setFolderDialogClose(false);
  // }
  const handleFolderClose = () => {
    setFolderDialog(false);
    setFolderDialogClose(true);
  };

  const inputFile = useRef(null);
  // const OpenFileDialog = () => {
  //     inputFile.current.click();
  // };
  const onFileChangeCapture = () => {};

  const folderInput = useRef(null);
  // const OpenFolderDialog = () => {
  //     folderInput.current.click();
  //     // inputFile.current.click();
  // };
  const onFolderChangeCapture = () => {
    setSelectTab(3);
    showPositionDialog(true);
  };

  // useEffect(() => {
  //     const getImageTree = async () => {
  //         let response = await api_experiment.getImageTree()
  //         let data = response.data
  //         if(data.error) {
  //             setTreeData([])
  //             // alert("Error occured while getting the tree");
  //         } else {
  //             setTreeData(data.data);
  //         }
  //     }
  //     getImageTree()
  //         .catch(console.error)
  // }, [])
  return (
    <TabItem title="File/Edit">
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={onFileChangeCapture}
        style={{ display: 'none' }}
      />
      <input
        directory=""
        webkitdirectory=""
        type="file"
        ref={folderInput}
        onChange={onFolderChangeCapture}
        style={{ display: 'none' }}
      />
      <SmallCard title="Open">
        <CustomButton
          icon={mdiCloudDownloadOutline}
          label="Cloud"
          click={() => setCloudDialog(true)}
        />
        {cloudDialog && (
          <OpenCloudUploadNew
            handleClose={handleCloudClose}
            treeData={treeData}
          />
        )}
        <CustomButton
          icon={mdiEmailNewsletter}
          label="File"
          click={() => {
            setFileDialog(true);
          }}
        />
        {fileDialog && (
          <OpenFileDialog handleClose={handleFileClose} treeData={treeData} />
        )}
        <CustomButton
          icon={mdiFolderOpenOutline}
          label="Folder"
          click={() => {
            setFolderDialog(true);
          }}
        />
        {folderDialog && (
          <OpenFolderUpload
            handleClose={handleFolderClose}
            treeData={treeData}
            // folderDialogFlag = {true}
          />
        )}
        <CustomButton
          icon={mdiDotsGrid}
          label="Position"
          click={() => showPositionDialog(true)}
        />
        {positionDialog && (
          <OpenPositionDialog
            title=" "
            handleClose={handleClose}
            setCloudDialog={setCloudDialog}
            cloudDialogClose={cloudDialogClose}
            selectTab={selectTab}
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
    </TabItem>
  );
};

export default connect(mapStateToProps)(FileTab);
