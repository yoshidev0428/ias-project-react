import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';
import { useFlagsStore } from '@/state';
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

export default function BoxSelect() {
  const UserCanvasFlag = useFlagsStore((store) => store.UserCanvasFlag);

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
    // console.log("Select-3");
  };
  const select4 = () => {};
  const select5 = async () => {
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
    // console.log("Select-5");
  };
  const select6 = () => {
    // useFlagsStore.setState({ UserCanvasFlag: !UserCanvasFlag });
    // console.log("Select-6");
  };
  const select7 = () => {
    // useFlagsStore.setState({ UserCanvasFlag: !UserCanvasFlag });
    // console.log("Select-7")
  };
  const get_outline = async () => {
    const state = store.getState();
    if (state.files.imagePathForAvivator == null) {
      // alert('Please enter your image file!');
      return 'NO';
    }
    let imgPath = state.files.imagePathForAvivator[0].path;
    let exp_name = imgPath.split('/');
    exp_name = exp_name[0];
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
    <div className="">
      <SmallCard title="Box &#38; Select">
        <div className="d-flex flex-row justify-content-around w-100 ">
          <CustomButton icon={mdiNearMe} click={() => select1()} />
          <CustomButton icon={mdiPencil} click={() => select2()} />
          <CustomButton
            icon={mdiCheckboxBlankCircleOutline}
            click={() => select3()}
          />
          <CustomButton icon={mdiDotsVertical} click={() => select4()} />
          <CustomButton icon={mdiVectorRectangle} click={() => select5()} />
          <CustomButton icon={mdiSquareEditOutline} click={() => select6()} />
          <CustomButton icon={mdiTrashCanOutline} click={() => select7()} />
        </div>
      </SmallCard>
    </div>
  );
}
