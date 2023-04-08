import React, { useRef, useState, useCallback, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useFlagsStore } from '@/state';
import store from '@/reducers';

const mapStateToProps = (state) => ({
  canvas_info: state.experiment.canvas_info,
});

function MLLabelCanvas(props) {
  const selectedLabel = useFlagsStore((store) => store.selectedLabel);
  const MLSelectTargetMode = useSelector(
    (state) => state.experiment.MLSelectTargetMode,
  );
  const getActiveColor = () => {
    return MLSelectTargetMode === 'object' ? '#FF0000' : '#00FF00';
  };

  const canvas = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [position, setPosition] = useState(null);
  const [width, setWidth] = useState(
    props.canvas_info.width * Math.pow(2, props.canvas_info.zoom),
  );
  const [height, setHeight] = useState(
    props.canvas_info.height * Math.pow(2, props.canvas_info.zoom),
  );
  const [top, setTop] = useState(props.canvas_info.top);
  const [left, setLeft] = useState(props.canvas_info.left);
  const [mouseTrack, setMouseTrack] = useState([]);
  // const [objectLabelPosInfo, setObjectLabelPosInfo] = useState([])
  // const [backgroundLabelPosInfo, setBackgroundLabelPosInfo] = useState([])

  let user_custom_area = [];
  let track_record = [];

  const onDown = useCallback((event) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setPosition(coordinates);
      setDrawing(true);
    }
  }, []);

  const onUp = () => {
    // add the drawn curve to the specific label position information.
    if (mouseTrack?.length === 0) return;
    if (MLSelectTargetMode === 'object') {
      store.dispatch({
        type: 'setMLObjectLabelPosInfo',
        content: mouseTrack,
      });
      // let _labelPosInfo = objectLabelPosInfo;
      // _labelPosInfo.push(...mouseTrack)
      // setObjectLabelPosInfo(_labelPosInfo)
      // console.log('===============> objet pos', _labelPosInfo)
    } else if (MLSelectTargetMode === 'background') {
      store.dispatch({
        type: 'setMLBackgroundLabelPosInfo',
        content: mouseTrack,
      });
      // let _labelPosInfo = backgroundLabelPosInfo;
      // _labelPosInfo.push(...mouseTrack)
      // setBackgroundLabelPosInfo(_labelPosInfo)
      // console.log('===============> background pos', _labelPosInfo)
    }

    let draw_style = localStorage.getItem('CANV_ STYLE');
    if (draw_style == 'user_custom_area') {
      user_custom_area.push(mouseTrack);
    }
    // console.log('user_area', user_custom_area)
    setMouseTrack([]);
    setDrawing(false);
    setPosition(null);
  };

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
      // update the mouse move track record **QmQ
      let _mouseTrack = [...mouseTrack];
      _mouseTrack.push(originalPosition);
      setMouseTrack(_mouseTrack);

      context.lineJoin = 'round';
      context.lineWidth = props.strokeWidth;
      context.beginPath();
      context.moveTo(originalPosition.x, originalPosition.y);
      context.lineTo(newPosition.x, newPosition.y);
      context.closePath();
      context.strokeStyle = getActiveColor();
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
    context.strokeStyle = getActiveColor();
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
    context.strokeStyle = getActiveColor();
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

  // const initCanvas = () => {
  //   const context = canvas.current.getContext('2d');
  //   context.fillStyle = 'blue';
  //   context.fillRect(0, 0, canvas.current.width, canvas.current.height);
  // };

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

MLLabelCanvas.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  viewOnly: PropTypes.bool,
  data: PropTypes.object,
  onDraw: PropTypes.func,
  colors: PropTypes.arrayOf(PropTypes.string),
  strokeWidth: PropTypes.number,
};

MLLabelCanvas.defaultProps = {
  width: 400,
  height: 400,
  viewOnly: false,
  data: undefined,
  onDraw: undefined,
  colors: ['#7030A2', '#000000', '#0170C1', '#FE0002', '#FFFF01', '#00AF52'],
  strokeWidth: 3,
};

export default connect(mapStateToProps)(MLLabelCanvas);
