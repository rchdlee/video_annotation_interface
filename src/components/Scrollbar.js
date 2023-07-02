import { useState } from "react";
import Draggable from "react-draggable";

import classes from "../styles/Scrollbar.module.css";

const Scrollbar = (props) => {
  const [deltaPositionX, setDeltaPositionX] = useState(0);

  const thumbWidth =
    ((props.timelineValueRange[1] - props.timelineValueRange[0]) /
      props.duration) *
    props.trackWidth;

  console.log(thumbWidth);

  const thumbLeftOffset =
    (props.timelineValueRange[0] / props.duration) * props.trackWidth;

  const handleDrag = (e, data) => {
    // setDeltaPositionX((prevState) => prevState + ui.deltaX);
    setDeltaPositionX(data.x);
    console.log(data);
    const deltaX = data.deltaX;
    const timeChange =
      (deltaX / (props.trackWidth - thumbWidth)) * props.duration;
    console.log(timeChange);

    // need to add validation for reaching start and end
    // props.setZoomTimelineTicks((prevState) => {
    //   const test = prevState.map((time) => time + timeChange);
    //   return test;
    // });
  };

  return (
    <div className={classes["scroll-bar-container"]}>
      <div className={classes["category-name"]}></div>
      <div className={classes["scroll-bar-track"]}>
        <Draggable axis="x" bounds="parent" onDrag={handleDrag} grid={[25, 0]}>
          <div
            // className="handle"
            className={classes["scroll-thumb"]}
            style={{
              width: `${thumbWidth}px`,
              position: "absolute",
              left: `${thumbLeftOffset}px`,
            }}
          >
            <div>drag: {deltaPositionX}</div>
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default Scrollbar;
