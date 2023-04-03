import React, { useEffect } from 'react';
function DLRightContext(props) {
  const [xYPosition, setXyPosition] = React.useState({ x: 0, y: 0 });
  const initMenu = (chosen) => {
    props.handleItem(chosen);
  };

  useEffect(() => {
    setXyPosition({ x: props.left, y: props.top });
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