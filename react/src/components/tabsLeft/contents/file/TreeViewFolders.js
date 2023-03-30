import TreeItem from '@mui/lab/TreeItem';
import { FormControlLabel, Checkbox } from '@mui/material';
import store from '../../../../reducers';
import { useState } from 'react';

const TreeViewFoldersExp = (props) => {
  const experiments = props.data;
  const selectedPath = props.selectedPath;

  const makeTree = (experiment) => {
    let treeData = {
      id: experiment.experiment_name,
      label: experiment.experiment_name,
      checked:
        selectedPath.indexOf(experiment.experiment_name) >= 0 ? true : false,
      children: [],
      type: 'experiment',
    };

    experiment.experiment_data.forEach((data) => {
      let tree = treeData.children;
      let path = experiment.experiment_name;
      if (data.folder != '') {
        let folders = data.folder.split('/');
        for (let i = 1; i < folders.length; i++) {
          path = path + '/' + folders[i];
          const existingNode = tree.find((node) => node.label === folders[i]);
          if (existingNode) {
            tree = existingNode.children;
            continue;
          }
          const item = {
            id: path,
            label: folders[i],
            checked: selectedPath.indexOf(path) >= 0 ? true : false,
            children: [],
            type: 'folder',
          };
          tree.push(item);
          tree = item.children;
        }
      }
      data.files.forEach((file) =>
        tree.push({
          id: path + '/' + file,
          label: file,
          checked: selectedPath.indexOf(path + '/' + file) >= 0 ? true : false,
          type: 'file',
        }),
      );
    });
    return treeData;
  };

  const root_node = [];
  experiments.map((experiment) => {
    const experiment_node = makeTree(experiment);
    root_node.push(experiment_node);
  });

  let checkedFile = selectedPath;
  const handleChange = (e, node) => {
    // const path = e.target.id;
    // if (path.indexOf('.') < 0) return;
    checkCheckedNode(node, e.target.checked);
  };

  const checkCheckedNode = (e, isChecked) => {
    updateRootNodeForChecked(root_node, isChecked, e);
    if (Array.isArray(e.children) && e.children.length > 0) {
      for (let i = 0; i < e.children.length; i++) {
        checkCheckedNode(e.children[i], isChecked);
      }
    } else {
      let selectedFiles = checkedFile ? checkedFile.split(',') : [];
      if (isChecked) {
        selectedFiles.push(e.id);
      } else {
        selectedFiles.splice(selectedFiles.indexOf(e.id), 1);
      }
      checkedFile = selectedFiles.join(',');
      store.dispatch({ type: 'set_image_path_for_tree', content: checkedFile });
    }
  };

  const updateRootNodeForChecked = (nodes, isChecked, targetNode) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id == targetNode.id) {
        nodes[i].checked = isChecked;
      }
      if (Array.isArray(nodes[i].children)) {
        updateRootNodeForChecked(nodes[i].children, isChecked, targetNode);
      }
    }
  };

  const renderTree = (node) => (
    <div key={node.id} className="d-flex">
      {/* {!Array.isArray(node.children)?"":<div className="position-absolute top-0 start-0"><input type="checkbox" /></div>} */}
      {/* <div className="position-absolute top-0 start-0"><input type="checkbox" /></div> */}
      <TreeItem
        nodeId={node.id}
        label={
          <FormControlLabel
            control={
              <Checkbox
                id={node.id}
                checked={node.checked}
                onChange={(e) => {
                  handleChange(e, node);
                }}
              />
            }
            label={<>{node.label}</>}
          />
        }
        className="ml-2"
      >
        {Array.isArray(node.children)
          ? node.children.map((children_node) => renderTree(children_node))
          : null}
      </TreeItem>
    </div>
  );
  return (
    <div>{root_node.map((experiment_node) => renderTree(experiment_node))}</div>
  );
};
export default TreeViewFoldersExp;
