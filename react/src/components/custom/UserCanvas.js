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

  const onDown = useCallback((event) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setPosition(coordinates);
      setDrawing(true);
    }
  }, []);

  const onUp = useCallback(() => {
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
          } else if (props.canvas_info.draw_style === 'user_custom_ellipse') {
            drawEllipse(position, newPosition);
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
    context.fillStyle = 'blue';

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
    context.fillStyle = 'blue';
    context.clearRect(0, 0, canvas.current.width, canvas.current.height); //clear canvas
    context.beginPath();
    let rwidth = newPosition.x - originalPosition.x;
    let rheight = newPosition.y - originalPosition.y;
    context.rect(originalPosition.x, originalPosition.y, rwidth, rheight);
    context.stroke();
    handleDraw(context.getImageData(0, 0, width, height));
  };

  const drawEllipse = (originalPosition, newPosition) => {
    if (!canvas.current) {
      return null;
    }

    const context = canvas.current.getContext('2d');
    context.fillStyle = 'blue';
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
    handleDraw(context.getImageData(0, 0, width, height));
  };

  const drawOutlines = (outlines, zoom) => {
    const context = canvas.current.getContext('2d');
    context.clearRect(0, 0, canvas.current.width, canvas.current.height);
    context.fillStyle = 'red';
    for (let i in outlines) {
      let temp_row = outlines[i];
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
    if (props.canvas_info.outlines.length > 0)
      drawOutlines(props.canvas_info.outlines, props.canvas_info.zoom);
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
  colors: ['#7030A2', '#000000', '#0170C1', '#FE0002', '#FFFF01', '#00AF52'],
  strokeWidth: 3,
};

export default connect(mapStateToProps)(Usercanvas);
