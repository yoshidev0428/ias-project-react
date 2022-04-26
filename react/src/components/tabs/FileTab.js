import React, { useState } from 'react';
import TabItem from '../custom/TabItem';
import SmallCard from "../custom/SmallCard";
import CustomButton from "../custom/CustomButton";
import Divider from '@mui/material/Divider';
import OpenCloudDialog from "./contents/file/OpenCloudDialog";
import OpenFileDialog from "./contents/file/OpenFileDialog";
import OpenFolderDialog from "./contents/file/OpenFolderDialog";
import OpenPositionDialog from "./contents/file/OpenPositionDialog";
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
  mdiCog
 } from '@mdi/js';
export default function FileTab (props) {
  const refresh = () => {
    console.log("click refresh");
  };
  const help = () => {
    console.log("click help");
  };
  const onSave = () => {
    console.log("click onSave");
  };
  const onSaveAs = () => {
    console.log("click onSaveAs");
  };
  const onExport = () => {
    console.log("click onExport");
  };
  const onLoad = () => {
    console.log("click onLoad");
  };
  const onCut = () => {
    console.log("click onCut");
  };
  const onCopy = () => {
    console.log("click onCopy");
  };
  const onPaste = () => {
    console.log("click onPaste");
  };
  const onNew = () => {
    console.log("click onNew");
  };
  const onSelect1 = () => {
    console.log("click onSelect1");
  };
  const [cloudDialog, setcloudDialog] = useState(false);
  const [fileDialog, setfileDialog] = useState(false);
  const [folderDialog, setfolderDialog] = useState(false);
  const [positionDialog, setpositionDialog] = useState(false);
  const showCloudDialog = () =>{
    setcloudDialog(true);
  }
  const showPositionDialog = () =>{
    setpositionDialog(true);
  }
  const handleClose = () => {
    setcloudDialog(false);
    setpositionDialog(false);
  }
  return (
    <TabItem title="File/Edit" buttons={true} refresh={refresh} help={help}>
      <SmallCard title="Open">
        {/* {<CustomButton icon={mdiCloudDownloadOutline} label="Cloud" click={showCloudDialog}/>}
        {cloudDialog && <OpenCloudDialog handleClose={handleClose}/>} */}
        <CustomButton icon={mdiEmailNewsletter} label="File" style={fileDialog && <OpenFileDialog/>}/>
        <CustomButton icon={mdiFolderOpenOutline} label="Folder" style={folderDialog && <OpenFolderDialog/>}/>
        <CustomButton icon={mdiDotsGrid} label="Position" click={showPositionDialog}/>
        {positionDialog && <OpenPositionDialog title=" " handleClose = {handleClose}/>}
      </SmallCard>
      <Divider/>
      <SmallCard title="Save / Load">
        <CustomButton icon={mdiContentSaveOutline} label="Save" click={onSave}/>
        <CustomButton icon={mdiContentSaveEditOutline} label="SaveAs" click={onSaveAs}/>
        <CustomButton icon={mdiUpload} label="Export" click={onExport}/>
        <CustomButton icon={mdiDownload} label="Load" click={onLoad}/>
      </SmallCard>
      <Divider/>
      <SmallCard title="Edit">
        <CustomButton icon={mdiContentCut} label="Cut" click={onCut}/>
        <CustomButton icon={mdiContentCopy} label="Copy" click={onCopy}/>
        <CustomButton icon={mdiContentPaste} label="Paste" click={onPaste}/>
        <CustomButton icon={mdiFileOutline} label="New" click={onNew}/>
      </SmallCard>
      <Divider/>
      <SmallCard title="Comment">
        <CustomButton icon={mdiNearMe} click={onSelect1}/>
        <CustomButton icon={mdiPencil} click={onSelect1}/>
        <CustomButton icon={mdiCheckboxBlankCircleOutline} click={onSelect1}/>
        <CustomButton icon={mdiDotsVertical} click={onSelect1}/>
        <CustomButton icon={mdiVectorRectangle} click={onSelect1}/>
        <CustomButton icon={mdiSquareEditOutline} click={onSelect1}/>
        <CustomButton icon={mdiTrashCanOutline} click={onSelect1}/>
      </SmallCard>
      <Divider/>
      <SmallCard title="Change Dimension">
        <CustomButton icon={mdiSortClockDescendingOutline} label="Z->T" click={onSelect1}/>
        <CustomButton icon={mdiSortClockAscending} label="T->Z" click={onSelect1}/>
        <CustomButton icon={mdiCog} label="Set" click={onSelect1}/>
      </SmallCard>
    </TabItem>
  );
};
