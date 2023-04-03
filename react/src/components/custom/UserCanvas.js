import React, { useRef, useState, useCallback, useEffect } from 'react';
import store from '@/reducers';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useViewerStore, useFlagsStore } from '@/state';
import DLRightContext from './DLRightContext';

const mapStateToProps = (state) => ({
  canvas_info: state.experiment.canvas_info,
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
  let selected_rois = [];
  let mouse_track = [];
  let user_custom_areas = [];

  const get_selected_rois = (pos, new_pos = null) => {
    if(localStorage.getItem('CANV_ROIS') !== '') {
      selected_rois = localStorage.getItem('CANV_ROIS');
      selected_rois = selected_rois.split(',');
    }
    for (let i in outlines) {
      // let temp = outlines[i];
      // let temp_border = get_roi_border(i);
      if (check_roi_valid(i, pos, new_pos) === true) {
        if (selected_rois.indexOf(i) === -1) {
          selected_rois.push(i);
          localStorage.setItem(
            'CANV_ROIS',selected_rois
          );
        }
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
      let roi_now = outlines[roi_num];
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
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
      };
    }
  };

  const contains = (a, b) =>
    a.x1 <= b.x1 && a.y1 <= b.y1 && a.x2 >= b.x2 && a.y2 >= b.y2;

  const onDown = useCallback((event) => {
    if(event.button === 0) {
      setContext(false);
      const coordinates = getCoordinates(event);
      if (coordinates) {
        setPosition(coordinates);
        setDrawing(true);
        // if (props.canvas_info.draw_style === 'user_custom_select') {
          get_selected_rois(coordinates);
          drawOutlines();
        // }
      }
    }
  }, []);

  const onUp = useCallback(() => {
    let draw_style = localStorage.getItem('CANV_STYLE');
    // console.log('track', mouse_track);
    if(draw_style === 'user_custom_area') {
      user_custom_areas.push(mouse_track);
      // mouse_track = [];
    }
    console.log('user_area', user_custom_areas)
    drawOutlines();
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
      x: x - canv_left - parent_left,
      y: y - canv_top - parent_top,
    };
  };

  const onMove = useCallback(
    (event) => {
      if (drawing) {
        const newPosition = getCoordinates(event);
        let draw_style = localStorage.getItem('CANV_STYLE');
        if (position && newPosition) {
          if (draw_style === 'user_custom_area') {
            drawLine(position, newPosition);
            setPosition(newPosition);
          } else if (draw_style === 'user_custom_rectangle') {
            drawRectangle(position, newPosition);
            get_selected_rois(position, newPosition);
            drawOutlines();
          } else if (draw_style === 'user_custom_ellipse') {
            drawEllipse(position, newPosition);
            get_selected_rois(position, newPosition);
            drawOutlines();
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
      context.lineJoin = 'round';
      context.lineWidth = props.strokeWidth;
      mouse_track.push(originalPosition);
      console.log('track', mouse_track);
      context.beginPath();
      context.moveTo(originalPosition.x, originalPosition.y);
      context.lineTo(newPosition.x, newPosition.y);
      context.closePath();
      context.stroke();
    }
  };

  const drawRectangle = (originalPosition, newPosition) => {
    if (!canvas.current) {
      return null;
    }

    const context = canvas.current.getContext('2d');
    context.fillStyle = activeColor;
    context.clearRect(0, 0, canvas.current.width, canvas.current.height); //clear canvas
    context.beginPath();
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
    context.fillStyle = 'red';
    context.clearRect(0, 0, canvas.current.width, canvas.current.height); //clear canvas
    context.beginPath();
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

  const drawOutlines = () => {
    let zoom = localStorage.getItem('CANV_ZOOM')
    const context = canvas.current.getContext('2d');
    context.fillStyle = activeColor;
    for (let i in selected_rois) {
      let temp_row = outlines[selected_rois[i]];
      for (let j = 0; j < temp_row.length; j += 2) {
        let x = temp_row[j] * Math.pow(2, zoom);
        let y = temp_row[j + 1] * Math.pow(2, zoom);
        context.fillRect(x, y, 2, 2);
      }
    }
    // console.log('draw-outlines')
  };

  const initCanvas = () => {
    const context = canvas.current.getContext('2d');
    context.fillStyle = 'blue';
    context.fillRect(0, 0, canvas.current.width, canvas.current.height);
  };

  useEffect(() => {
    localStorage.setItem('CANV_ROIS', '');
  }, [])

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
    setTop(props.canvas_info.top );
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
      {context && <DLRightContext left={contLeft} top={contTop} handleItem={ContextItem}/>}
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
