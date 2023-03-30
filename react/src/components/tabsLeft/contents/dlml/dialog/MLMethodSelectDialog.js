import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
// import { Row, Col, Image } from 'react-bootstrap';
// import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
import Icon from '@mdi/react';
import { mdiCloseCircle } from '@mdi/js';
import IconButton from '@mui/material/IconButton';
// import Box from '@mui/material/Box';
// import Slider from '@mui/material/Slider';
// import TextField from '@mui/material/TextField';
// import { toast } from 'react-toastify';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MLMethodItem from '../widgets/MLMethodItem';
import Divider from '@mui/material/Divider';

import { useFlagsStore } from '@/state';
import store from '../../../../../reducers';
import { useSelector } from 'react-redux';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 0 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const MLMethodSelectDialog = () => {
  const MLMethodList = useSelector((state) => state.experiment.MLMethodList);
  // console.log('ML method list', MLMethodList)
  const MLDialogMethodSelecFlag = useFlagsStore(
    (store) => store.MLDialogMethodSelectFlag,
  );
  // const showCellposeDialog = () => {
  //   useFlagsStore.setState({ MLDialogMethodSelecFlag: false });
  //   useFlagsStore.setState({ DialogCellposeFlag: true });
  //   store.dispatch({ type: 'setMethod', content: selectedMethod });
  //   store.dispatch({ type: 'set_custom_name', content: 'New Model' });
  // };
  const [selectedMethod, setSelectedMethod] = useState({});

  const handleSelectedMethod = (mth) => {
    setSelectedMethod(mth);
  };
  const handleDeleteMethod = (mth) => {
    store.dispatch({ type: 'deleteMLMethod', content: mth });
  };

  const setMLMethod = () => {
    useFlagsStore.setState({ MLDialogMethodSelectFlag: false });
    store.dispatch({ type: 'setMLMethod', content: selectedMethod });
  };
  const close = () => {
    useFlagsStore.setState({ MLDialogMethodSelectFlag: false });
  };

  return (
    <>
      <Dialog open={MLDialogMethodSelecFlag} onClose={close} maxWidth={'450'}>
        <div className="d-flex border-bottom flex-row justify-content-between">
          <DialogTitle>{`Select the Method`}</DialogTitle>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            onClick={close}
          >
            <Icon path={mdiCloseCircle} size={1} />
          </IconButton>
        </div>

        <div>
          <List
            sx={{
              width: '400px',
              marginX: 'auto',
              maxWidth: 450,
              bgcolor: 'background.paper',
            }}
          >
            {MLMethodList?.map((mth) => {
              return (
                <ListItem>
                  <MLMethodItem
                    method={mth}
                    onDelete={() => handleDeleteMethod(mth)}
                    onSelect={() => handleSelectedMethod(mth)}
                    selectedMethod={selectedMethod}
                  />
                  <Divider />
                </ListItem>
              );
            })}
          </List>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
            <Button
              sx={{ marginRight: '8px' }}
              variant="outlined"
              component="label"
              onClick={setMLMethod}
            >
              Set
            </Button>
            <Button variant="outlined" onClick={close}>
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
export default MLMethodSelectDialog;
