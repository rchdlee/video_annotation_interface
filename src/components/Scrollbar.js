import { useState } from "react";
import Draggable from "react-draggable";

import classes from "../styles/Scrollbar.module.css";

const Scrollbar = (props) => {
  const [deltaPositionX, setDeltaPositionX] = useState(0);
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
    // console.log(data.deltaX, data.x, thumbLeftOffset);
    if (deltaX === 0 || Math.abs(deltaX) > 21) {
      return;
    }
    // setDeltaPositionX((prevState) => prevState + deltaX);
    const timeChange =
      (deltaX / (props.trackWidth - thumbWidth)) * props.duration;

    const tickInterval =
      props.duration / (props.zoomLevel * props.numberOfTicks);
    const test2 = [];

    // NEED TO FIX STUFF FOR WEIRD MICRO SCROLLING WHEN REACHING NEAR END

    if (props.timelineValueRange[1] === props.duration && deltaX > -19) {
      // console.log("ntiesroatneisrontuyfwtnyuwfnywtu");
      return;
    }

    // maybe when mouse down and is outside parent div (right) dragging doesn't work?

    props.setZoomTimelineTicks((prevState) => {
      const test = prevState.map((time) => time + timeChange);
      // const test2 = [];
      // const tickInterval =
      //   props.duration / (props.zoomLevel * props.numberOfTicks);
      // console.log(test, props.duration, tickInterval, deltaX, timeChange);

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
        // props.seekTo(test[0] + 1);
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
        console.log("more🎎");
        for (let i = 0; i <= props.numberOfTicks; i++) {
          test2.push(props.duration + (i - props.numberOfTicks) * tickInterval);
        }
        // console.log(test2);
        return test2;
      }

      return test;
    });
  };

  // const backHandler = () => {
  //   const test2 = [];
  //   const tickInterval =
  //     props.duration / (props.zoomLevel * props.numberOfTicks);
  //   const timeChange = (20 / (props.trackWidth - thumbWidth)) * props.duration;
  //   props.setZoomTimelineTicks((prevState) => {
  //     const test = prevState.map((time) => time - timeChange);
  //     // const test2 = [];
  //     // const tickInterval =
  //     //   props.duration / (props.zoomLevel * props.numberOfTicks);
  //     // console.log(test, props.duration, tickInterval, deltaX, timeChange);

  //     if (props.playedSec > test[props.numberOfTicks]) {
  //       // console.log("set time to tick-9 🎢");
  //       // props.seekTo(test[8]);
  //       props.seekTo(test[9]);
  //       if (props.currentlySelectedSegment) {
  //         props.escFunction();
  //       }
  //     }
  //     if (props.playedSec < test[0]) {
  //       // console.log("set time to tick-0 🎗");
  //       // props.seekTo(test[1]);
  //       // props.seekTo(test[0] + 1);
  //       props.seekTo(test[0]);
  //       if (props.currentlySelectedSegment) {
  //         props.escFunction();
  //       }
  //     }

  //     if (test[0] < 0) {
  //       // console.log("less🎎");
  //       for (let i = 0; i <= props.numberOfTicks; i++) {
  //         test2.push(i * tickInterval);
  //       }
  //       return test2;
  //     }
  //     if (test[props.numberOfTicks] > props.duration) {
  //       console.log("more🎎");
  //       for (let i = 0; i <= props.numberOfTicks; i++) {
  //         test2.push(props.duration + (i - props.numberOfTicks) * tickInterval);
  //       }
  //       // console.log(test2);
  //       return test2;
  //     }

  //     return test;
  //   });
  // };

  // const forwardHandler = () => {
  //   const test2 = [];
  //   const tickInterval =
  //     props.duration / (props.zoomLevel * props.numberOfTicks);
  //   const timeChange = (20 / (props.trackWidth - thumbWidth)) * props.duration;
  //   props.setZoomTimelineTicks((prevState) => {
  //     const test = prevState.map((time) => time + timeChange);
  //     // const test2 = [];
  //     // const tickInterval =
  //     //   props.duration / (props.zoomLevel * props.numberOfTicks);
  //     // console.log(test, props.duration, tickInterval, deltaX, timeChange);

  //     if (props.playedSec > test[props.numberOfTicks]) {
  //       // console.log("set time to tick-9 🎢");
  //       // props.seekTo(test[8]);
  //       props.seekTo(test[9]);
  //       if (props.currentlySelectedSegment) {
  //         props.escFunction();
  //       }
  //     }
  //     if (props.playedSec < test[0]) {
  //       // console.log("set time to tick-0 🎗");
  //       // props.seekTo(test[1]);
  //       // props.seekTo(test[0] + 1);
  //       props.seekTo(test[0]);
  //       if (props.currentlySelectedSegment) {
  //         props.escFunction();
  //       }
  //     }

  //     if (test[0] < 0) {
  //       // console.log("less🎎");
  //       for (let i = 0; i <= props.numberOfTicks; i++) {
  //         test2.push(i * tickInterval);
  //       }
  //       return test2;
  //     }
  //     if (test[props.numberOfTicks] > props.duration) {
  //       console.log("more🎎");
  //       for (let i = 0; i <= props.numberOfTicks; i++) {
  //         test2.push(props.duration + (i - props.numberOfTicks) * tickInterval);
  //       }
  //       // console.log(test2);
  //       return test2;
  //     }

  //     return test;
  //   });
  // };

  return (
    <div
      className={classes["scroll-bar-container"]}
      style={{ display: `${props.zoomLevel !== 1 ? "flex" : "none"}` }}
    >
      <div className={classes["empty"]}>
        {/* <button onClick={backHandler}>b</button>
        <button onClick={forwardHandler}>f</button> */}
      </div>
      <div className={classes["scroll-bar-track"]}>
        <Draggable
          axis="x"
          bounds="parent"
          onStart={dragStartHandler}
          onStop={dragStopHandler}
          onDrag={handleDrag}
          grid={[20, 0]}
          // disabled={true}
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
