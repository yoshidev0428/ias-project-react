import { useMemo } from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ExpTreeView = ({ data, onSelectFile, onSelectExp }) => {
  const root_node = useMemo(
    () =>
      data.map((experiment) => {
        const treeData = {
          id: experiment.experiment_name,
          label: experiment.experiment_name,
          checked: false,
          children: [],
          type: 'experiment',
        };

        experiment.experiment_data.forEach((data) => {
          let tree = treeData.children;
          let path = experiment.experiment_name;
          if (data.folder !== '') {
            let folders = data.folder.split('/');
            for (let i = 1; i < folders.length; i++) {
              path = path + '/' + folders[i];
              const existingNode = tree.find(
                (node) => node.label === folders[i],
              );
              if (existingNode) {
                tree = existingNode.children;
                continue;
              }
              const item = {
                id: path,
                label: folders[i],
                checked: false,
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
              checked: false,
              type: 'file',
            }),
          );
        });
        return treeData;
      }),
    [data],
  );

  const handleSelect = (_event, nodeId) => {
    if (/\.(tif(f?)|jpg|jpeg|png)/i.test(nodeId)) {
      onSelectFile(nodeId);
    } else {
      onSelectExp(nodeId);
    }
  };

  const renderTree = (node) => (
    <TreeItem key={node.id} nodeId={node.id} label={node.label}>
      {Array.isArray(node.children)
        ? node.children.map((child) => renderTree(child))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={handleSelect}
    >
      {root_node.map((experiment_node) => renderTree(experiment_node))}
    </TreeView>
  );
};
export default ExpTreeView;
