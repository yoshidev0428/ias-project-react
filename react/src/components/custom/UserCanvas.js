import React, { useRef, useState, useCallback, useEffect } from 'react';
import store from '@/reducers';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useViewerStore } from '@/state';

const mapStateToProps = (state) => ({
  canvas_info: state.experiment.canvas_info,
});

function Usercanvas(props) {
  const canvas = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [position, setPosition] = useState(null);
  const [activeColor, setActiveColor] = useState(props.colors[0]);
  const [width, setWidth] = React.useState(
    props.canvas_info.width * Math.pow(2, props.canvas_info.zoom),
  );
  const [height, setHeight] = React.useState(
    props.canvas_info.height * Math.pow(2, props.canvas_info.zoom),
  );
  const [top, setTop] = React.useState(props.canvas_info.top);
  const [left, setLeft] = React.useState(props.canvas_info.left);
  const [outlines, setOutlines] = React.useState(props.canvas_info.outlines);
  const selected_rois = [];

  const get_selected_rois = (pos, new_pos = null) => {
    for (let i in outlines) {
      // let temp = outlines[i];
      // let temp_border = get_roi_border(i);
      if (check_roi_valid(i, pos, new_pos) === true) {
        if (selected_rois.indexOf(i) == -1) selected_rois.push(i);
      }
    }
  };

  const check_roi_valid = (roi_num, pos, new_pos = null) => {
    // let zoom = props.canvas_info.zoom
    // let count = 0;
    // if(outlines > 0) {
    //   let temp_row = outlines[roi_num];
    //   for (let j = 0; j < temp_row.length; j += 2) {
    //     let x = temp_row[j] * Math.pow(2, zoom);
    //     let y = temp_row[j + 1] * Math.pow(2, zoom);
    //     if((pos.y === y) && (pos.x <= x))
    //       count++;
    //   }
    // }
    let now_border = get_roi_border(roi_num);
    let draw_style = props.canvas_info.draw_style;
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
    let zoom = props.canvas_info.zoom;
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
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setPosition(coordinates);
      setDrawing(true);
      if (props.canvas_info.draw_style === 'user_custom_select') {
        get_selected_rois(coordinates);
        drawOutlines();
      }
    }
  }, []);

  const onUp = useCallback(() => {
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
    // console.log(`X: ${x} PL: ${left} PPL: ${parent_left}`)

    return {
      x: x - canv_left - parent_left,
      y: y - canv_top - parent_top,
    };
  };

  const onMove = useCallback(
    (event) => {
      if (drawing) {
        const newPosition = getCoordinates(event);
        // console.log(`MouseX: ${event.pageX} MouseY: ${event.pageY}`)
        // console.log(`CaX: ${newPosition.x} CaY: ${newPosition.y}`)
        if (position && newPosition) {
          if (props.canvas_info.draw_style === 'user_custom_area') {
            drawLine(position, newPosition);
            setPosition(newPosition);
          } else if (props.canvas_info.draw_style === 'user_custom_rectangle') {
            drawRectangle(position, newPosition);
            get_selected_rois(position, newPosition);
            drawOutlines();
          } else if (props.canvas_info.draw_style === 'user_custom_ellipse') {
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

      context.beginPath();
      context.moveTo(originalPosition.x, originalPosition.y);
      context.lineTo(newPosition.x, newPosition.y);
      context.closePath();

      context.stroke();
      handleDraw(context.getImageData(0, 0, width, height));
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
    // handleDraw(context.getImageData(0, 0, width, height));
  };

  const drawEllipse = (originalPosition, newPosition) => {
    if (!canvas.current) {
      return null;
    }

    const context = canvas.current.getContext('2d');
    context.fillStyle = activeColor;
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
    // handleDraw(context.getImageData(0, 0, width, height));
  };

  const drawOutlines = () => {
    // console.log('cells', selected_rois)
    let zoom = props.canvas_info.zoom;
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

  const handleDraw = (data) => {
    if (typeof props.onDraw === 'function') {
      props.onDraw(data);
    }
  };

  const initCanvas = () => {
    const context = canvas.current.getContext('2d');
    context.fillStyle = 'blue';
    context.fillRect(0, 0, canvas.current.width, canvas.current.height);
  };

  useEffect(() => {
    // initCanvas();
    // SetCanvasInfo(props.canvas_info)
    setWidth(props.canvas_info.width * Math.pow(2, props.canvas_info.zoom));
    setHeight(props.canvas_info.height * Math.pow(2, props.canvas_info.zoom));
    setOutlines(props.canvas_info.outlines);
  }, [props, width, height]);

  useEffect(() => {
    setTop(props.canvas_info.top);
    setLeft(props.canvas_info.left);
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
        width={width}
        height={height}
      />
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
