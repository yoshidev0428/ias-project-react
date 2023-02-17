import {useState} from 'react';
import TreeItem from '@mui/lab/TreeItem';
import { FormControlLabel, Checkbox } from '@mui/material';

const TreeViewFoldersExp = (props) => {
    const experiments = props.data

    const makeTree = (experiment) => {
        let treeData = {
            id: experiment.expName,
            label: experiment.expName,
            checked: false,
            children: []
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
                };
                tree.push(item);
                tree = item.children;
            }
            data.files.forEach((file) => tree.push({ id:path + "/" + file, label: file, checked: false }));
        });
        return treeData
    }

    const root_node = [];
    experiments.map(experiment => {
        const experiment_node = makeTree(experiment)
        root_node.push(experiment_node);
    })

    const renderTree = (node) => (
        <div key={node.id} className="d-flex">
            {/* {!Array.isArray(node.children)?"":<div className="position-absolute top-0 start-0"><input type="checkbox" /></div>} */}
            {/* <div className="position-absolute top-0 start-0"><input type="checkbox" /></div> */}
            <TreeItem nodeId={node.id} label={
                    <FormControlLabel
                        control={
                            <Checkbox />
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
