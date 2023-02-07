import React, { useState, useRef, useEffect } from 'react';
import TabItem from '../custom/TabItem';
import SmallCard from "../custom/SmallCard";
import CustomButton from "../custom/CustomButton";
import Divider from '@mui/material/Divider';
import OpenCloudDialogExp from "./contents/file/OpenCloudDialog";  
import OpenFileDialogForUpload from './contents/file/OpenFileDialog';
import OpenFolderUpload from './contents/file/OpenFolderUpload';
import OpenFolderDialogForUpload from './contents/file/OpenFolderDialog';
import OpenPositionDialog from "./contents/file/OpenPositionDialog";
import * as api_experiment from "../../api/experiment";
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

import { connect } from 'react-redux';
import store from "../../reducers";

const mapStateToProps = state => ({
    isFilesAvailable: state.files.isFilesAvailable,
    filesChosen: state.vessel.selectedVesselHole,
    isFilesChosenAvailable: state.files.isFilesChosenAvailable,
    content: state.files.content,
    selectedVesselHole: state.vessel.selectedVesselHole,
})

const FileTab = (props) => {

    // const refresh = () => {
    //     console.log("click refresh");
    // };
    // const help = () => {
    //     console.log("click help");
    // };
    // buttons={true} refresh={refresh} help={help}
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

    const swapDimension = (isEntire) => {
        const { content, selectedVesselHole } = props;
        // console.log("Before swap dimension: ", content);

        let newContent = [];
        for (let i = 0; i < content.length; i++) {
            if (isEntire || content[i].row == selectedVesselHole.row && content[i].col == selectedVesselHole.col) {
                let tempContent = {...content[i]};
                const tempVal = tempContent.z;
                tempContent.z = tempContent.time;
                tempContent.time = tempVal;
                tempContent.dimensionChanged = !tempContent.dimensionChanged;
                newContent.push(tempContent);
            }
        }

        // console.log("After swap dimension: ", newContent);
        store.dispatch({type: "content_addContent", content: newContent});
    }

    const onChangeDimensionZ2T = () => {
        // console.log("ChangeDimension: click Z->T");
        swapDimension(false);
    }

    const onChangeDimensionT2Z = () => {
        // console.log("ChangeDimension: click T->Z");
        swapDimension(false);
    }

    const onChangeDimensionSet = () => {
        // console.log("ChangeDimension: click set");
        swapDimension(true);
    }

    const [cloudDialog, setcloudDialog] = useState(false);
    const [folderDialog, setFolderDialog] = useState(false);
    const [fileDialog, setfileDialog] = useState(false);
    const [selectTab, setSelectTab] = useState(0);
    const [positionDialog, setpositionDialog] = useState(false);
    const [cloudDialogClose, setCloudDialogClose] = useState(false);
    const [fileDialogClose, setfileDialogClose] = useState(false);
    const [folderDialogClose, setFolderDialogClose] = useState(false);
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [treeData, setTreeData] = useState([]);

    const showPositionDialog = () => {
        setpositionDialog(true);
    }
    const setCloudDialog = () => {
        setcloudDialog(true);
        setCloudDialogClose(false);
    }

    const handleClose = () => {
        setpositionDialog(false);
    }
    const handleCloudClose = () => {
        setcloudDialog(false);
        setCloudDialogClose(true);
    }
    const setFileDialog = () => {
        setfileDialog(true);
        setfileDialogClose(false);
    }
    const handleFileClose = () => {
        setfileDialog(false);
        setfileDialogClose(true);
    }
    const setfolderDialog = () => {
        setFolderDialog(true);
        setFolderDialogClose(false);
    }
    const handleFolderClose = () => {
        setFolderDialog(false);
        setFolderDialogClose(true);
    }

    const inputFile = useRef(null);
    const OpenFileDialog = () => {
        inputFile.current.click();
    };
    const onFileChangeCapture = (e) => {
        console.log("FileTab.js onFolderChangeCapture : file information : ", e.target.files);
    };

    const folderInput = useRef(null);
    const OpenFolderDialog = () => {
        folderInput.current.click();
        // inputFile.current.click();
    };
    const onFolderChangeCapture = (e) => {
        console.log("FileTab.js onFolderChangeCapture : folder information : ", e.target.files);
        setSelectTab(3);
        showPositionDialog(true)
    }

    // useEffect(() => {
    //     const getImageTree = async () => {
    //         let response = await api_experiment.getImageTree()
    //         let data = response.data
    //         if(data.error) {
    //             setTreeData([])
    //             console.log("Error occured while invoking getImageTree api");
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
            <input type="file" id="file" ref={inputFile} onChange={onFileChangeCapture} style={{ display: "none" }} />
            <input directory="" webkitdirectory="" type="file" ref={folderInput} onChange={onFolderChangeCapture} style={{ display: "none" }} />
            <SmallCard title="Open">
                <CustomButton icon={mdiCloudDownloadOutline} label="Cloud" click={() => setCloudDialog(true)} />
                {
                    cloudDialog && <OpenCloudDialogExp handleClose={handleCloudClose} treeData={treeData}
                    />
                }
                <CustomButton icon={mdiEmailNewsletter} label="File" click={() => { setFileDialog(true) }} />
                {
                    fileDialog && <OpenFileDialogForUpload handleClose={handleFileClose} treeData={treeData} />
                }
                <CustomButton icon={mdiFolderOpenOutline} label="Folder" click={() => { setFolderDialog(true) }} />
                {
                    folderDialog && <OpenFolderUpload handleClose={handleFolderClose} treeData={treeData} />
                }
                <CustomButton icon={mdiDotsGrid} label="Position" click={() => showPositionDialog(true)} />
                {positionDialog && <OpenPositionDialog title=" " handleClose={handleClose} setCloudDialog={setCloudDialog} cloudDialogClose={cloudDialogClose} selectTab={selectTab}/>}
            </SmallCard>
            <Divider />
            <SmallCard title="Save / Load">
                <CustomButton icon={mdiContentSaveOutline} label="Save" click={onSave} />
                <CustomButton icon={mdiContentSaveEditOutline} label="SaveAs" click={onSaveAs} />
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
                <div className='d-flex justify-content-around' style={{ width: '100%' }}>
                    <CustomButton icon={mdiNearMe} click={onSelect1} />
                    <CustomButton icon={mdiPencil} click={onSelect1} />
                    <CustomButton icon={mdiCheckboxBlankCircleOutline} click={onSelect1} />
                    <CustomButton icon={mdiDotsVertical} click={onSelect1} />
                    <CustomButton icon={mdiVectorRectangle} click={onSelect1} />
                    <CustomButton icon={mdiSquareEditOutline} click={onSelect1} />
                    <CustomButton icon={mdiTrashCanOutline} click={onSelect1} />
                </div>
            </SmallCard>
            <Divider />
            <SmallCard title="Change Dimension">
                <CustomButton icon={mdiSortClockDescendingOutline} label="Z->T" click={onChangeDimensionZ2T} />
                <CustomButton icon={mdiSortClockAscending} label="T->Z" click={onChangeDimensionT2Z} />
                <CustomButton icon={mdiCog} label="Set" click={onChangeDimensionSet} />
            </SmallCard>
        </TabItem>
    );
};

export default connect(mapStateToProps)(FileTab);