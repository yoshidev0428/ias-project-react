import React, { useRef, useState, useCallback, useEffect } from 'react';
import store from '@/reducers';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useViewerStore, useFlagsStore } from '@/state';
import DLRightContext from './DLRightContext';
import * as image from '@/api/image';
import * as api_experiment from '@/api/experiment';
import { isNull } from 'lodash';
import { toTiffPath } from '@/helpers/avivator';
import { getImageUrl } from '@/helpers/file';

const mapStateToProps = (state) => ({
  canvas_info: state.experiment.canvas_info,
  selectedModel: state.experiment.current_model,
});

function Usercanvas(props) {
  const canvas = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [position, setPosition] = useState(null);
  const [activeColor, setActiveColor] = useState('red');
  const [width, setWidth] = React.useState(
    props.canvas_info.width * Math.pow(2, props.canvas_info.zoom),
  );
  const [height, setHeight] = React.useState(
    props.canvas_info.height * Math.pow(2, props.canvas_info.zoom),
  );
  const [top, setTop] = React.useState(props.canvas_info.top);
  const [left, setLeft] = React.useState(props.canvas_info.left);
  const [outlines, setOutlines] = React.useState(props.canvas_info.outlines);
  const [context, setContext] = React.useState(false);
  const [contLeft, setContLeft] = React.useState(0);
  const [contTop, setContTop] = React.useState(0);
  const [mouse_track, setMouseTrack] = React.useState([]);
  let selected_rois = [];

  const get_selected_rois = (pos, new_pos = null) => {
    if (localStorage.getItem('CANV_ROIS') !== '') {
      selected_rois = localStorage.getItem('CANV_ROIS');
      selected_rois = selected_rois.split(',');
    }
    for (let i in outlines) {
      // let temp = outlines[i];
      // let temp_border = get_roi_border(i);
      if (check_roi_valid(i, pos, new_pos) === true) {
        outlines[i] = {
          line: outlines[i].line, show: !outlines[i].show
        }
        selected_rois.push(i);
        selected_rois = selected_rois.filter( item => outlines[item].show === false)
        localStorage.setItem('CANV_ROIS', selected_rois);
      }
    }
  };

  const check_roi_valid = (roi_num, pos, new_pos = null) => {
    let draw_style = localStorage.getItem('CANV_STYLE');
    let now_border = get_roi_border(roi_num);
    if (draw_style === 'user_custom_select') {
      if (
        pos.x >= now_border.minX &&
        pos.x <= now_border.maxX &&
        pos.y <= now_border.maxY &&
        pos.y >= now_border.minY
      )
        return true;
      else return false;
    }
    if (
      draw_style === 'user_custom_rectangle' ||
      draw_style === 'user_custom_ellipse'
    ) {
      let roi_rectangle = {
        x1: now_border.minX,
        y1: now_border.minY,
        x2: now_border.maxX,
        y2: now_border.maxY,
      };
      let select_rectangle = {
        x1: pos.x,
        y1: pos.y,
        x2: new_pos.x,
        y2: new_pos.y,
      };
      if (contains(select_rectangle, roi_rectangle)) return true;
      return false;
    }
  };

  const get_roi_border = (roi_num) => {
    let zoom = localStorage.getItem('CANV_ZOOM');
    if (outlines.length > 0) {
      let roi_now = outlines[roi_num].line;
      let minX = 10000;
      let minY = 10000;
      let maxX = 0;
      let maxY = 0;
      for (let j = 0; j < roi_now.length; j += 2) {
        let x = roi_now[j] * Math.pow(2, zoom);
        let y = roi_now[j + 1] * Math.pow(2, zoom);
        if (x >= maxX) maxX = x;
        if (x <= minX) minX = x;
        if (y >= maxY) maxY = y;
        if (x <= minY) minY = y;
      }
      return {
        minX: Math.floor(minX),
        maxX: Math.floor(maxX),
        minY: Math.floor(minY),
        maxY: Math.floor(maxY),
      };
    }
  };

  const get_drawing_border = (track) => {
    if (outlines.length > 0) {
      let minX = 10000;
      let minY = 10000;
      let maxX = 0;
      let maxY = 0;
      for (let j = 0; j < track.length; j++) {
        let x = track[j].x;
        let y = track[j].y
        if (x >= maxX) maxX = x;
        if (x <= minX) minX = x;
        if (y >= maxY) maxY = y;
        if (x <= minY) minY = y;
      }
      return {
        minX: Math.floor(minX),
        maxX: Math.floor(maxX),
        minY: Math.floor(minY),
        maxY: Math.floor(maxY),
      };
    }
  }

  function rectanglesOverlap(rect1, rect2) {
    let x1 = rect1.minX; let y1 = rect1.minY;
    let w1 = rect1.maxX - rect1.minX; let h1 = rect1.maxY - rect1.minY;
    let x2 = rect2.minX; let y2= rect2.minY;
    let w2 = rect2.maxX - rect2.minX; let h2 = rect2.maxY - rect2.minY;
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           h1 + y1 > y2;
  }

  const contains = (a, b) =>
    a.x1 <= b.x1 && a.y1 <= b.y1 && a.x2 >= b.x2 && a.y2 >= b.y2;
  
  const check_duplicate = (arr1, arr2) => {
    let dump = {};
    let line_dump = [];
    let zoom = localStorage.getItem('CANV_ZOOM');
    let temp_row = arr2.line;
    for (let j = 0; j < temp_row.length; j += 2) {
      let x = Math.floor(temp_row[j] * Math.pow(2, zoom));
      let y = Math.floor(temp_row[j + 1] * Math.pow(2, zoom));
      line_dump.push({x: x, y: y});
    }
    let myPath = line_dump;
    line_dump = Array.from(new Set(myPath.map(JSON.stringify))).map(JSON.parse);
    myPath= arr1;
    // arr1 = Array.from(new Set(myPath.map(JSON.stringify))).map(JSON.parse);
    // console.log('arr1', arr1);
    // console.log('arr2', line_dump);
    let count = 0;
    for (let i = 0; i < arr1.length ; i++) {
      if(!dump[arr1[i]]) {
        const element = arr1[i];
        dump[element] = true;
      }
    }
    for (let j= 0 ; j < line_dump.length ; j++) {
      if(dump[line_dump[j]]) {
        count ++;
      }
    }
    return count;
  }

  const onDown = useCallback((event) => {
    if (event.button === 0) {
      setContext(false);
      const coordinates = getCoordinates(event);
      if (coordinates) {
        setPosition(coordinates);
        setDrawing(true);
        if (props.canvas_info.draw_style === 'user_custom_select') {
          get_selected_rois(coordinates);
          drawOutlines();
        }
      }
    }
  }, []);

  const onUp = useCallback(() => {
    let draw_style = localStorage.getItem('CANV_STYLE');
    // console.log('track', mouse_track);
    if (draw_style === 'user_custom_area') {
      console.log('final-track', mouse_track);
      for (let i in outlines) {
        let count= check_duplicate(mouse_track,  outlines[i]);
        if(count > 0) {
          console.log('duplicate', i)
        }
      }
    }
    // console.log('user_area', user_custom_areas)
    // drawOutlines();
    setDrawing(false);
    setPosition(null);
  }, []);

  const getCoordinates = (event) => {
    if (!canvas.current) {
      return null;
    }

    let parent_top = localStorage.getItem('imageViewSizeTop');
    let parent_left = localStorage.getItem('imageViewSizeLeft');
    let canv_left = localStorage.getItem('CANV_LEFT');
    let canv_top = localStorage.getItem('CANV_TOP');

    const x = event.pageX || event.touches[0].pageX;
    const y = event.pageY || event.touches[0].pageY;

    return {
      x: Math.floor(x - canv_left - parent_left),
      y: Math.floor(y - canv_top - parent_top),
    };
  };

  const onMove = useCallback(
    (event) => {
      if (drawing) {
        const newPosition = getCoordinates(event);
        let draw_style = localStorage.getItem('CANV_STYLE');
        if (position && newPosition) {
          if (draw_style === "user_custom_area") {
            drawLine(position, newPosition);
            setPosition(newPosition);
          } else if (draw_style === "user_custom_rectangle") {
            drawRectangle(position, newPosition);
            get_selected_rois(position, newPosition);
            drawOutlines();
          } else if (draw_style === "user_custom_ellipse") {
            drawEllipse(position, newPosition);
            get_selected_rois(position, newPosition);
            drawOutlines();
          } else if (draw_style == "user_custom_eraser") {
            Eraser(position, newPosition);
            setPosition(newPosition);
          }
        }
      }
    },
    [drawing, position],
  );

  const drawLine = (originalPosition, newPosition) => {
    if (!canvas.current) {
      return null;
    }
    const context = canvas.current.getContext('2d');
    context.fillStyle = activeColor;

    if (context) {
      // context.strokeStyle = activeColor
      const track = [...mouse_track, originalPosition];
      setMouseTrack(track);
      context.globalCompositeOperation="source-over";
      context.lineJoin = 'round';
      context.beginPath();
      context.lineWidth = "15";
      context.strokeStyle = "red";
      context.moveTo(originalPosition.x, originalPosition.y);
      context.lineTo(newPosition.x, newPosition.y);
      context.closePath();
      context.stroke();
    }
  };

  const Eraser = (originalPosition, newPosition) => {
    const context = canvas.current.getContext('2d');
    context.beginPath();
    context.globalCompositeOperation="destination-out";
    context.arc(originalPosition.x,originalPosition.y,8,0,Math.PI*2,false);
    context.fill();
  }

  const drawRectangle = (originalPosition, newPosition) => {
    if (!canvas.current) {
      return null;
    }

    const context = canvas.current.getContext('2d');
    context.clearRect(0, 0, canvas.current.width, canvas.current.height); //clear canvas
    context.beginPath();
    context.lineWidth = "2";
    context.strokeStyle = "red";
    let rwidth = newPosition.x - originalPosition.x;
    let rheight = newPosition.y - originalPosition.y;
    context.rect(originalPosition.x, originalPosition.y, rwidth, rheight);
    context.stroke();
  };

  const drawEllipse = (originalPosition, newPosition) => {
    if (!canvas.current) {
      return null;
    }

    const context = canvas.current.getContext('2d');
    context.clearRect(0, 0, canvas.current.width, canvas.current.height); //clear canvas
    context.beginPath();
    context.lineWidth = "2";
    context.strokeStyle = "red";
    let radiusX = (newPosition.x - originalPosition.x) / 2;
    let radiusY = (newPosition.y - originalPosition.y) / 2;
    let centerX = originalPosition.x + radiusX;
    let centerY = originalPosition.y + radiusY;
    context.ellipse(
      centerX,
      centerY,
      Math.abs(radiusX),
      Math.abs(radiusY),
      0,
      0,
      2 * Math.PI,
    );
    context.stroke();
  };

  const drawOutlines = async () => {
    let zoom = localStorage.getItem('CANV_ZOOM');
    const context = canvas.current.getContext('2d');
    context.clearRect(0, 0, canvas.current.width, canvas.current.height); //clear canvas
    // for(let i = 0; i< outlines.length; i++) {
    //   if(selected_rois.length > 0) {
    //     if (selected_rois.indexOf(i.toString()) !== -1) {
    //       continue;
    //     }
    //   }
    //   let temp_row = outlines[i].line;
    //   context.font = '20px san-serif';
    //   for (let j = 0; j < temp_row.length; j += 2) {
    //     context.fillStyle = activeColor;
    //     let x = temp_row[j] * Math.pow(2, zoom);
    //     let y = temp_row[j + 1] * Math.pow(2, zoom);
    //     context.fillRect(x, y, 2, 2);
    //     if(j === (temp_row.length-8)) {
    //       context.fillStyle = 'green';
    //       context.fillText(`${i}`, x, y);
    //     }
    //   }
    // }
    const state = store.getState();
    let imgPath = '';
    if(typeof state.files.imagePathForAvivator === 'string') {
      imgPath = state.files.imagePathForAvivator;
    }
    else if (typeof state.files.imagePathForAvivator === 'object') {
      imgPath = state.files.imagePathForAvivator[0].path;
    }
    let exp_name = imgPath.split('/');
    let result = await api_experiment.get_mask_path(
      imgPath,
      exp_name
    );
    const image = new Image();
    image.src = result.data.success;
    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.current.width, canvas.current.height);
    };
    image.setAttribute('crossorigin', 'anonymous');
  };

  const showNav = useCallback((event) => {
    event.preventDefault();
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setContext(true);
      setContLeft(coordinates.x);
      setContTop(coordinates.y);
    }
  }, []);

  const ContextItem = async (item, model) => {
    if(item === 'train') {
      if(model === null) {
        alert('Please select the model by doing cell segment');
        return;
      }
      const state = store.getState();
      let imgPath = '';
      if(typeof state.files.imagePathForAvivator === 'string') {
        imgPath = state.files.imagePathForAvivator;
      }
      else if (typeof state.files.imagePathForAvivator === 'object') {
        imgPath = state.files.imagePathForAvivator[0].path;
      }
      let exp_name = imgPath.split('/');
      let mask_info = canvas.current.toDataURL("image/png");
      let result = await api_experiment.upload_mask(
        imgPath,
        exp_name,
        mask_info,
      );
      useFlagsStore.setState({ UserCanvasFlag: false });
      setContext(false);
      useFlagsStore.setState({ DialogTrainingFlag: true });
    }
    if(item === 'clear') {
      const context = canvas.current.getContext('2d');
      context.clearRect(0, 0, canvas.current.width, canvas.current.height); //clear canvas
      localStorage.setItem('CANV_ROIS', '');
      selected_rois = [];
      setContext(false);
    }
    if(item === 'close') {
      useFlagsStore.setState({ UserCanvasFlag: false });
      localStorage.setItem('CANV_ROIS', '');
      selected_rois = [];
      setContext(false);
    }
    if(item === 'eraser') {
      localStorage.setItem('CANV_STYLE', 'user_custom_eraser');
      setContext(false);
    }
    if(item === 'drawing') {
      localStorage.setItem('CANV_STYLE', 'user_custom_area');
      setContext(false);
    }
  }

  useEffect(() => {
    localStorage.setItem('CANV_ROIS', '');
  }, []);

  useEffect(() => {
    // initCanvas();
    // SetCanvasInfo(props.canvas_info)
    let zoom = localStorage.getItem('CANV_ZOOM');
    setWidth(props.canvas_info.width * Math.pow(2, zoom));
    setHeight(props.canvas_info.height * Math.pow(2, zoom));
    setOutlines(props.canvas_info.outlines);
    drawOutlines();
  }, [props, width, height]);

  useEffect(() => {
    setTop(props.canvas_info.top);
    setLeft(props.canvas_info.left);
    drawOutlines();
  }, [props.canvas_info.left, props.canvas_info.top]);

  return (
    <div
      className={'user-custom-canvas'}
      style={{ top: top + 'px', left: left + 'px' }}
    >
      <canvas
        ref={canvas}
        onMouseDown={props.viewOnly ? undefined : onDown}
        onTouchStart={props.viewOnly ? undefined : onDown}
        onMouseUp={props.viewOnly ? undefined : onUp}
        onTouchEnd={props.viewOnly ? undefined : onUp}
        onMouseLeave={props.viewOnly ? undefined : onUp}
        onMouseMove={props.viewOnly ? undefined : onMove}
        onTouchMove={props.viewOnly ? undefined : onMove}
        onContextMenu={props.viewOnly ? undefined : showNav}
        width={width}
        height={height}
      />
      {context && <DLRightContext 
        left={contLeft} 
        top={contTop} 
        handleItem={ContextItem} 
        selectedModel={props.selectedModel}
      />}
    </div>
  );
}

Usercanvas.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  viewOnly: PropTypes.bool,
  data: PropTypes.object,
  onDraw: PropTypes.func,
  colors: PropTypes.arrayOf(PropTypes.string),
  strokeWidth: PropTypes.number,
};

Usercanvas.defaultProps = {
  width: 400,
  height: 400,
  viewOnly: false,
  data: undefined,
  onDraw: undefined,
  colors: ['red', '#000000', '#0170C1', '#FE0002', '#FFFF01', '#00AF52'],
  strokeWidth: 3,
};

export default connect(mapStateToProps)(Usercanvas);
