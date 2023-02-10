import * as React from 'react';
import TreeItem from '@mui/lab/TreeItem';
import { FormControl,  } from '@mui/material';

const TreeViewFoldersExp = (props) => {
    const node_datas = props.data
    console.log(node_datas)
    const renderTree = (nodes) => (
        <div key={nodes.id} className="d-flex">
            {/* {!Array.isArray(nodes.children)?"":<div className="position-absolute top-0 start-0"><input type="checkbox" /></div>} */}
            {/* <div className="position-absolute top-0 start-0"><input type="checkbox" /></div> */}
            <TreeItem nodeId={nodes.id} label={nodes.label} className="ml-2">
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
            </TreeItem>
        </div>
        
    );
    return (
        <div>
            {renderTree(node_datas)}
        </div>
    )
}
export default TreeViewFoldersExp
