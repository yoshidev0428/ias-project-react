import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import { Row, Col} from 'react-bootstrap';
import SmallCard from '@/components/custom/SmallCard';
import CustomButton from '@/components/custom/CustomButton';
import {
  mdiNearMe,
  mdiPencil,
  mdiCheckboxBlankCircleOutline,
  mdiDotsVertical,
  mdiVectorRectangle,
  mdiSquareEditOutline,
  mdiTrashCanOutline,
} from '@mdi/js';
import store from '@/reducers';
import * as api_experiment from '@/api/experiment';

const TargetDrawingDialog = () => {
  const DialogTargetDrawingFlag = useFlagsStore((store) => store.DialogTargetDrawingFlag);
  const UserCanvasFlag = useFlagsStore((store) => store.UserCanvasFlag);
  const [password, setPassword] = React.useState('');
  
  const close = () => {
    useFlagsStore.setState({ DialogTargetDrawingFlag: false });
  };

  const select1 = async () => {
    const state = store.getState();
    let outlines = state.experiment.canvas_info.outlines;
    if(outlines.length === 0) {
      outlines = await get_outline();
      if(outlines === 'NO') {
        alert('Please enter your image file and rocess with cellpose!');
        return;
      }
    }
    let canvas_info = state.experiment.canvas_info;
    let canv_info = {
      ...canvas_info,
      draw_style: 'user_custom_select',
      outlines: outlines,
    };
    store.dispatch({
      type: 'set_canvas',
      content: canv_info,
    });
    localStorage.setItem('CANV_STYLE', 'user_custom_select');
    useFlagsStore.setState({ UserCanvasFlag: true });
    useFlagsStore.setState({ DialogTargetDrawingFlag: false });
  };
  const select2 = async () => {
    // useFlagsStore.setState({ UserCanvasFlag: !UserCanvasFlag });
    const state = store.getState();
    let outlines = state.experiment.canvas_info.outlines;
    if(outlines.length === 0) {
      outlines = await get_outline();
      if(outlines === 'NO') {
        alert('Please enter your image file and rocess with cellpose!');
        return;
      }
    }
    let canvas_info = state.experiment.canvas_info;
    let canv_info = {
      ...canvas_info,
      draw_style: 'user_custom_area',
      outlines: outlines,
    };
    store.dispatch({
      type: 'set_canvas',
      content: canv_info,
    });
    localStorage.setItem('CANV_STYLE', 'user_custom_area');
    useFlagsStore.setState({ UserCanvasFlag: true });
    // console.log("Select-2");
  };
  const select3 = async () => {
    const state = store.getState();
    let outlines = state.experiment.canvas_info.outlines;
    if(outlines.length === 0) {
      outlines = await get_outline();
      if(outlines === 'NO') {
        alert('Please enter your image file and rocess with cellpose!');
        return;
      }
    }
    let canvas_info = state.experiment.canvas_info;
    let canv_info = {
      ...canvas_info,
      draw_style: 'user_custom_ellipse',
      outlines: outlines,
    };
    store.dispatch({
      type: 'set_canvas',
      content: canv_info,
    });
    localStorage.setItem('CANV_STYLE', 'user_custom_ellipse');
    useFlagsStore.setState({ UserCanvasFlag: true });
    useFlagsStore.setState({ DialogTargetDrawingFlag: false });
    // console.log("Select-3");
  };
  const select4 = async () => {
    const state = store.getState();
    let outlines = state.experiment.canvas_info.outlines;
    if(outlines.length === 0) {
      outlines = await get_outline();
      if(outlines === 'NO') {
        alert('Please enter your image file and rocess with cellpose!');
        return;
      }
    }
    let canvas_info = state.experiment.canvas_info;
    let canv_info = {
      ...canvas_info,
      draw_style: 'user_custom_rectangle',
      outlines: outlines,
    };
    store.dispatch({
      type: 'set_canvas',
      content: canv_info,
    });
    localStorage.setItem('CANV_STYLE', 'user_custom_rectangle');
    useFlagsStore.setState({ UserCanvasFlag: true });
    useFlagsStore.setState({ DialogTargetDrawingFlag: false });
    // console.log("Select-5");
  };
  const get_outline = async () => {
    const state = store.getState();
    if (state.files.imagePathForAvivator == null) {
      // alert('Please enter your image file!');
      return 'NO';
    }
    let imgPath = '';
    if(typeof state.files.imagePathForAvivator === 'string') {
      imgPath = state.files.imagePathForAvivator;
    }
    else if (typeof state.files.imagePathForAvivator === 'object') {
      imgPath = state.files.imagePathForAvivator[0].path;
    }
    let exp_name = imgPath.split('/');
    let result = await api_experiment.get_outlines(imgPath, exp_name);
    if (result.data.error) {
      alert('Error occured while getting the data');
    } else {
      if (result.data.success === 'NO') {
        alert('Your custom model is not applied to your image.');
        return;
      }
      let temp = [];
      for (let i in result.data.success) {
        let temp_row = result.data.success[i];
        temp_row.replace(/\\n/g, '');
        temp_row = temp_row.split(',');
        let num_temp_row = temp_row.map(Number);
        temp.push(num_temp_row);
      }
      return temp;
    }
  };

  return (
    <>
      <Dialog open={DialogTargetDrawingFlag} onClose={close} maxWidth={'450'}>
        <div className="d-flex border-bottom">
          <DialogTitle>Select Method for drawing target area.</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div className="mx-3 my-2" style={{ width: 450 }}>
          <Row>
            <Col xs={12}>
            <SmallCard title="Select drawing tools">
              <div className="d-flex flex-row justify-content-around w-100 ">
                <CustomButton icon={mdiNearMe} click={() => select1()} />
                <CustomButton icon={mdiPencil} click={() => select2()} />
                <CustomButton
                  icon={mdiCheckboxBlankCircleOutline}
                  click={() => select3()}
                />
                <CustomButton icon={mdiVectorRectangle} click={() => select4()} />
              </div>
            </SmallCard>
            </Col>
          </Row>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
export default TargetDrawingDialog;
