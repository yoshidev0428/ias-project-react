import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import store from '@/reducers';
import CheckboxTree from 'react-checkbox-tree';
import * as api_experiment from '@/api/experiment';
import { Typography } from '@mui/material';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdChevronRight,
  MdKeyboardArrowDown,
  MdAddBox,
  MdIndeterminateCheckBox,
  MdFolder,
  MdFolderOpen,
  MdInsertDriveFile,
} from 'react-icons/md';

const AccountProfile = (props) => {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const icons = {
    check: <MdCheckBox className="rct-icon rct-icon-check" />,
    uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
    halfCheck: (
      <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
    ),
    expandClose: <MdChevronRight className="rct-icon rct-icon-expand-close" />,
    expandOpen: (
      <MdKeyboardArrowDown className="rct-icon rct-icon-expand-open" />
    ),
    expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
    collapseAll: (
      <MdIndeterminateCheckBox className="rct-icon rct-icon-collapse-all" />
    ),
    parentClose: <MdFolder className="rct-icon rct-icon-parent-close" />,
    parentOpen: <MdFolderOpen className="rct-icon rct-icon-parent-open" />,
    leaf: <MdInsertDriveFile className="rct-icon rct-icon-leaf-close" />,
  };

  useEffect(() => {
    const getImages = async () => {
      let response = await api_experiment.getImageTree();
      let data = response.data;
      if (!data.error) {
        store.dispatch({ type: 'set_experiment_data', content: data.data });
      }
    };
    getImages();
  }, []);

  return (
    <div className="w-100 p-5">
      <Typography component="div" className="mb-4 text-center">
        View your cloud data
      </Typography>
      {props.experiments.length ? (
        <CheckboxTree
          id={'account-check-tree'}
          nodes={props.experiments}
          checked={checked}
          expanded={expanded}
          onCheck={(checked) => setChecked(checked)}
          onExpand={(expanded) => setExpanded(expanded)}
          icons={icons}
        />
      ) : (
        <label>No data found, please upload..</label>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  experiments: state.experiment.experiments,
});

export default connect(mapStateToProps)(AccountProfile);
