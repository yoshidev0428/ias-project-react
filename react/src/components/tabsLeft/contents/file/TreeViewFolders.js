import {useState} from 'react';
import TreeItem from '@mui/lab/TreeItem';
import { FormControlLabel, Checkbox } from '@mui/material';
import store from "../../../../reducers";

const TreeViewFoldersExp = (props) => {
    const experiments = props.data

    const makeTree = (experiment) => {
        let treeData = {
            id: experiment.expName,
            label: experiment.expName,
            checked: false,
            children: [],
            type: "experiment"
        };

        experiment.folders.forEach((data) => {
            let tree = treeData.children;
            let path = experiment.expName;
            for (let i = 1; i < data.folder.length - 1; i++) {
                path = path + "/" + data.folder[i];
                const existingNode = tree.find((node) => node.label === data.folder[i]);
                if (existingNode) {
                    tree = existingNode.children;
                    continue;
                }
                const item = {
                    id: path,
                    label: data.folder[i],
                    checked: false,
                    children: [],
                    type: "folder"
                };
                tree.push(item);
                tree = item.children;
            }
            data.files.forEach((file) => tree.push({
                id: path + "/" + file,
                label: file,
                checked: false,
                type: "file"
            }));
        });
        return treeData
    }

    const root_node = [];
    experiments.map(experiment => {
        const experiment_node = makeTree(experiment)
        root_node.push(experiment_node);
    })

    let checkedFile = '';
    const handleChange = (e => {
        const path = e.target.id;
        if(path.indexOf('.') < 0) return;
        if(e.target.checked){
            checkedFile = checkedFile.concat(',' + path);
            store.dispatch({type: "set_image_path_for_tree", content: checkedFile});
            return;
        }
        checkedFile = checkedFile.replaceAll(',' + path, '');
        store.dispatch({type: "set_image_path_for_tree", content: checkedFile});
    });

    const renderTree = (node) => (
        <div key={node.id} className="d-flex">
            {/* {!Array.isArray(node.children)?"":<div className="position-absolute top-0 start-0"><input type="checkbox" /></div>} */}
            {/* <div className="position-absolute top-0 start-0"><input type="checkbox" /></div> */}
            <TreeItem nodeId={node.id} label={
                    <FormControlLabel
                        control={
                            <Checkbox
                                id={node.id}
                                onChange={handleChange}/>
                        }
                        label={<>{node.label}</>}
                    />
                } className="ml-2">
                {Array.isArray(node.children)
                    ? node.children.map((children_node) => renderTree(children_node))
                    : null}
            </TreeItem>
        </div>
    );
    return (
        <div>
            {root_node.map(experiment_node => renderTree(experiment_node))}
        </div>
    )
}
export default TreeViewFoldersExp
