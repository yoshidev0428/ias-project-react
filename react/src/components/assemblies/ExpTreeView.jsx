import { useMemo, useState } from 'react';
import TreeView from './TreeView';

const ExpTreeView = ({
  experiments,
  onSelectFiles,
  onSelectExp = () => void 0,
  onSelectFolder = () => void 0,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const nodes = useMemo(
    () =>
      experiments.map((experiment) => {
        const treeData = {
          id: experiment.experiment_name,
          label: experiment.experiment_name,
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
              type: 'file',
            }),
          );
        });
        return treeData;
      }),
    [experiments],
  );

  const handleSelect = (_event, nodeIds) => {
    const files = nodeIds.reduce((acc, nodeId) => {
      if (/\.\w+$/i.test(nodeId)) {
        // file
        acc.push(nodeId);
      } else if (nodeId.includes('/')) {
        // folder
        const expName = nodeId.split('/')[0]; // experiment name
        const folderName = nodeId.split('/').slice(1).join('/'); // folder name
        const exp = experiments.find((e) => e.experiment_name === expName);
        const folder = exp.experiment_data.find(
          (f) => f.folder === `/${folderName}`,
        );
        folder.files.forEach((file) => {
          const path = `${nodeId}/${file}`;
          if (acc.findIndex((fpath) => fpath === path) < 0) {
            acc.push(path);
          }
        });
        onSelectFolder(nodeId);
      } else {
        // experiment
        const exp = experiments.find((e) => e.experiment_name === nodeId);
        exp.experiment_data.forEach((folder) => {
          folder.files.forEach((file) => {
            const path = `${nodeId}${folder.folder}/${file}`;
            if (acc.findIndex((fpath) => fpath === path) < 0) {
              acc.push(path);
            }
          });
        });
        onSelectExp(nodeId);
      }
      return acc;
    }, []);

    setSelectedFiles(files);
    onSelectFiles(files);
  };

  return (
    <TreeView
      nodes={nodes}
      selected={selectedFiles}
      onNodeSelect={handleSelect}
    />
  );
};
export default ExpTreeView;
