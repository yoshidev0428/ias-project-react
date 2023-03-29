import React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';
import { useFlagsStore } from '@/state';
import LabelItem from './widgets/LabelItem';
import LabelItemInput from './widgets/LabelItemInput';

import {
  mdiPlayCircle,
  mdiStopCircle,
  mdiPencil,
  mdiCheckboxBlankCircleOutline,
  mdiVectorRectangle,
  mdiTrashCanOutline,
  mdiUpdate,
} from '@mdi/js';
import { toast } from 'react-toastify';

import store from '@/reducers';
import * as api_experiment from '@/api/experiment';

const defaultLabelList = [
  { id: 0, name: 'label1', color: '#FF0000' },
  { id: 1, name: 'label2', color: '#00FF00' },
];

export default function MLBoxSelect() {
  const MLCanvasFlag = useFlagsStore((store) => store.MLCanvasFlag);
  const MLSelectTargetMode = useSelector(
    (state) => state.experiment.MLSelectTargetMode,
  );

  // const selectedLabel = useFlagsStore((store) => store.selectedLabel);
  // const [labelList, setLabelList] = useState(defaultLabelList);

  // useEffect(()=>{
  //   return ()=>{
  //     useFlagsStore.setState({ MLCanvasFlag: false });
  //   }
  // })

  const start = async () => {
    const state = store.getState();
    if (state.files.imagePathForAvivator == null) {
      toast.error('Please select the image file!', {
        position: 'top-center',
      });
      // alert('Please enter your image file!');
      return;
    }
    useFlagsStore.setState({ MLCanvasFlag: true });
    let imgPath = state.files.imagePathForAvivator[0].path;
    let exp_name = imgPath.split('/');
    exp_name = exp_name[0];
    // console.log("file information ======>")
    // console.log(imgPath, exp_name)
    // let result = await api_experiment.get_outlines(imgPath, exp_name);
    // if (result.data.error) {
    //   alert('Error occured while getting the data');
    // } else {
    //   if (result.data.success === 'NO') {
    //     alert('Your custom model is not applied to your image.');
    //     return;
    //   }
    //   let temp = [];
    //   for (let i in result.data.success) {
    //     let temp_row = result.data.success[i];
    //     temp_row.replace(/\\n/g, '');
    //     temp_row = temp_row.split(',');
    //     let num_temp_row = temp_row.map(Number);
    //     temp.push(num_temp_row);
    //   }
    //   let canvas_info = state.experiment.canvas_info;
    //   let canv_info = {
    //     ...canvas_info,
    //     outlines: temp,
    //   };
    //   store.dispatch({
    //     type: 'set_canvas',
    //     content: canv_info,
    //   });
    // }
  };

  const stop = () => {
    useFlagsStore.setState({ MLCanvasFlag: false });
  };

  const liveUpdate = () => {};

  const drawCurve = () => {
    // useFlagsStore.setState({ MLCanvasFlag: !MLCanvasFlag });
    const state = store.getState();
    let canvas_info = state.experiment.canvas_info;
    let canv_info = {
      ...canvas_info,
      draw_style: 'user_custom_area',
    };
    store.dispatch({
      type: 'set_canvas',
      content: canv_info,
    });
  };

  const drawCircle = () => {
    const state = store.getState();
    let canvas_info = state.experiment.canvas_info;
    let canv_info = {
      ...canvas_info,
      draw_style: 'user_custom_ellipse',
    };
    store.dispatch({
      type: 'set_canvas',
      content: canv_info,
    });
  };

  const select5 = () => {
    const state = store.getState();
    let outlines = state.experiment.canvas_info.outlines;
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
  };

  const ClearRegion = () => {
    useFlagsStore.setState({ MLCanvasFlag: false });
  };

  // const onSelectLabel = (label) => {
  //   useFlagsStore.setState({ selectedLabel: label });
  // };

  // const onDeleteLabel = (label) => {
  //   const _labelList = labelList?.filter((lb) => lb.name !== label.name);
  //   setLabelList(_labelList);
  // };

  // const onAddLabel = (label) => {
  //   if (label.name === '') {
  //     toast.error('Please input the label name', {
  //       position: 'top-center',
  //     });
  //     return;
  //   }

  //   for (let i = 0; i < labelList.length; i++) {
  //     if (labelList[i].name === label.name) {
  //       toast.error('Same Label Exist. Please input another name', {
  //         position: 'top-center',
  //       });
  //       return;
  //     }
  //   }
  //   const _labelList = [...labelList, label];
  //   // console.log('======> after add, ', _labelList)
  //   setLabelList(_labelList);
  // };

  return (
    <div className="">
      {/* <div className="pt-2 pl-1" style={{ padding: '2px' }}>
        <div
          className={'mb-2'}
          style={{ fontWeight: 'bold', fontSize: '14px' }}
        >
          {`Label`}
        </div>
        <div>
          <div className="" style={{ paddingBottom: '4px' }}>
            {labelList.map((label, idx) => {
              return (
                <LabelItem
                  label={label}
                  key={idx}
                  onDelete={() => onDeleteLabel(label)}
                  onSelect={() => onSelectLabel(label)}
                  selectedLabel={selectedLabel}
                />
              );
            })}
            <div style={{ height: '10px' }}></div>
            <LabelItemInput onAdd={onAddLabel} />
          </div>
        </div>
      </div> */}

      <SmallCard title="Training">
        <div className="d-flex flex-row justify-content-around w-100 ">
          {!MLCanvasFlag ? (
            <CustomButton
              icon={mdiPlayCircle}
              label={'play'}
              click={() => start()}
            />
          ) : (
            <CustomButton
              icon={mdiStopCircle}
              label={'stop'}
              click={() => stop()}
            />
          )}
          <CustomButton
            icon={mdiPencil}
            label={'pencil'}
            click={() => drawCurve()}
          />
          <CustomButton
            icon={mdiCheckboxBlankCircleOutline}
            label={'ellipse'}
            click={() => drawCircle()}
          />
          {/* <CustomButton icon={mdiVectorRectangle} click={() => select5()} /> */}
          <CustomButton
            icon={mdiTrashCanOutline}
            label={'delete'}
            click={() => ClearRegion()}
          />
          <CustomButton
            icon={mdiUpdate}
            label={'update'}
            click={() => liveUpdate()}
          />
        </div>
      </SmallCard>
    </div>
  );
}
