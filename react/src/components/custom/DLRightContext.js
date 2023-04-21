import React, { useEffect } from 'react';
function DLRightContext(props) {
  const [xYPosition, setXyPosition] = React.useState({ x: 0, y: 0 });
  const [current_model, setCurrentModel] = React.useState(null);
  const initMenu = (chosen, model=null) => {
    props.handleItem(chosen, model);
  };

  useEffect(() => {
    setXyPosition({ x: props.left, y: props.top });
    setCurrentModel(props.selectedModel);
  }, [props])

  return (
    <>
      <div
        className="contextContainer"
        style={{ top: xYPosition.y, left: xYPosition.x }}
      >
        <div
          className="rightClick"
        >
          { current_model && <div className="menuElement" onClick={() => initMenu('train', current_model)}>
            {`Train (${current_model.custom_name})`}
          </div> }
          {/* <div className="menuElement" onClick={() => initMenu('train', 'current_mode')}>
            Train
          </div> */}
          <div className="menuElement" onClick={() => initMenu("drawing")}>
            Drawing Tool
          </div> 
          <div className="menuElement" onClick={() => initMenu("eraser")}>
            Eraser Tool
          </div> 
          <div className="menuElement" onClick={() => initMenu("clear")}>
            Clear Drawing Area
          </div> 
          <div className="menuElement" onClick={() => initMenu("close")}>
            Close Drawing Area
          </div>
        </div>
      </div>
    </>
  );
}
export default DLRightContext;