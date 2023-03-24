import MuiTreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

const TreeView = ({ rootNode, onNodeSelect }) => {
  const renderTree = (node) => (
    <TreeItem
      key={node.id}
      nodeId={node.id}
      label={
        <Typography
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            width: 150,
          }}
        >
          {node.label}
        </Typography>
      }
      endIcon={<InsertDriveFileOutlinedIcon />}
    >
      {Array.isArray(node.children)
        ? node.children.map((child) => renderTree(child))
        : null}
    </TreeItem>
  );

  return (
    <MuiTreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={onNodeSelect}
    >
      {rootNode.map((node) => renderTree(node))}
    </MuiTreeView>
  );
};
export default TreeView;
