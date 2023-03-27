import MuiTreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const TreeView = ({ nodes, selected, onNodeSelect }) => {
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
      endIcon={
        selected.includes(node.id) ? (
          <CheckBoxIcon />
        ) : (
          <CheckBoxOutlineBlankIcon />
        )
      }
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
      multiSelect
    >
      {nodes.map((node) => renderTree(node))}
    </MuiTreeView>
  );
};
export default TreeView;
