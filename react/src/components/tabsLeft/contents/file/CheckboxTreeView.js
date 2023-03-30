import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { data } from './sampleData';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  checkbox: {
    '&.MuiCheckbox-root': {
      color: 'rgba(81, 185, 201, 0.8)',
    },
    '&.MuiCheckbox-colorSecondary': {
      '&.Mui-checked': {
        color: 'rgba(160, 81, 201, 1)',
      },
    },
  },
}));

export default function RecursiveTreeView() {
  const [selected, setSelected] = React.useState([]);

  //node is always the root "Parent"
  //id is id of node clicked
  function getChildById(node, id) {
    let array = [];

    //returns an array of nodes ids: clicked node id and all children node ids
    function getAllChild(nodes) {
      if (nodes === null) return [];
      array.push(nodes.id);
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach((node) => {
          array = [...array, ...getAllChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    }

    //returns the node object that was selected
    function getNodeById(nodes, id) {
      if (nodes.id === id) {
        return nodes;
      } else if (Array.isArray(nodes.children)) {
        let result = null;
        nodes.children.forEach((node) => {
          if (!!getNodeById(node, id)) {
            result = getNodeById(node, id);
          }
        });
        return result;
      }

      return null;
    }

    return getAllChild(getNodeById(node, id));
  }

  function getOnChange(checked, nodes) {
    //gets all freshly selected or unselected nodes
    const allNode = getChildById(data, nodes.id);
    //console.log("This is all nodes", allNode)
    //combines newly selected nodes with existing selection
    //or filters out newly deselected nodes from existing selection
    let array = checked
      ? [...selected, ...allNode]
      : selected.filter((value) => !allNode.includes(value));

    setSelected(array);
  }

  const RenderTreeWithCheckboxes = (nodes) => {
    const classes = useStyles();
    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <FormControlLabel
            control={
              <Checkbox
                checked={selected.some((item) => item === nodes.id)}
                onChange={(event) =>
                  getOnChange(event.currentTarget.checked, nodes)
                }
                //onClick={(e) => e.stopPropagation()}
                className={classes.checkbox}
              />
            }
            label={<>{nodes.name}</>}
            key={nodes.id}
          />
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => RenderTreeWithCheckboxes(node))
          : null}
      </TreeItem>
    );
  };

  return (
    <>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={['0', '3', '4']}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {RenderTreeWithCheckboxes(data)}
      </TreeView>
      <br />
      <a
        target="_blank"
        href="https://smartdevpreneur.com/how-to-create-a-material-ui-treeview-with-styled-checkboxes/"
        rel="noreferrer"
      >
        How do we add checkboxes to TreeView?
      </a>
    </>
  );
}
