import { useState } from "react";
import Draggable from "react-draggable";

import classes from "../styles/Scrollbar.module.css";

const Scrollbar = (props) => {
  const [timeoutID, setTimeoutID] = useState(null);

  const thumbWidth =
    ((props.timelineValueRange[1] - props.timelineValueRange[0]) /
      props.duration) *
    props.trackWidth;

  const thumbLeftOffset =
    (props.timelineValueRange[0] / props.duration) * props.trackWidth;

  const dragStartHandler = () => {
    clearTimeout(timeoutID);
    props.setIsDraggingScrollBar(true);
  };

  const dragStopHandler = () => {
    const timeoutID = setTimeout(() => {
      props.setIsDraggingScrollBar(false);
    }, 1000);
    setTimeoutID(timeoutID);
  };

  const handleDrag = (e, data) => {
    const deltaX = data.deltaX;
    const timeChange =
      (deltaX / (props.trackWidth - thumbWidth)) * props.duration;

    props.setZoomTimelineTicks((prevState) => {
      const test = prevState.map((time) => time + timeChange);
      // if (
      //   test[props.numberOfTicks].toFixed(0) === props.duration.toFixed(0) ||
      //   test[0] === 0
      // ) {
      //   return prevState;
      // }
      const test2 = [];
      const tickInterval =
        props.duration / (props.zoomLevel * props.numberOfTicks);

      if (props.playedSec > test[props.numberOfTicks]) {
        // console.log("set time to tick-9 🎢");
        // props.seekTo(test[8]);
        props.seekTo(test[9]);
        if (props.currentlySelectedSegment) {
          props.escFunction();
        }
      }
      if (props.playedSec < test[0]) {
        // console.log("set time to tick-0 🎗");
        // props.seekTo(test[1]);
        props.seekTo(test[0] + 1);
        props.seekTo(test[0]);
        if (props.currentlySelectedSegment) {
          props.escFunction();
        }
      }

      if (test[0] < 0) {
        // console.log("less🎎");
        for (let i = 0; i <= props.numberOfTicks; i++) {
          test2.push(i * tickInterval);
        }
        return test2;
      }
      if (test[props.numberOfTicks] > props.duration) {
        // console.log("more🎎");
        for (let i = 0; i <= props.numberOfTicks; i++) {
          test2.push((i - props.numberOfTicks) * tickInterval + props.duration);
        }
        return test2;
      }

      return test;
    });
  };

  return (
    <div
      className={classes["scroll-bar-container"]}
      style={{ display: `${props.zoomLevel !== 1 ? "flex" : "none"}` }}
    >
      <div className={classes["empty"]}></div>
      <div className={classes["scroll-bar-track"]}>
        <Draggable
          axis="x"
          bounds="parent"
          onStart={dragStartHandler}
          onStop={dragStopHandler}
          onDrag={handleDrag}
          grid={[20, 0]}
          position={{ x: thumbLeftOffset, y: 0 }}
        >
          <div
            className={classes["scroll-thumb"]}
            style={{
              width: `${thumbWidth}px`,
              // position: "absolute",
              // left: `${thumbLeftOffset}px`,
            }}
          >
            {/* <div>drag: {deltaPositionX}</div> */}
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default Scrollbar;
