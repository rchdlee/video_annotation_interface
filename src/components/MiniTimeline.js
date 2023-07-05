import Slider, { Handle } from "rc-slider";
import "rc-slider/assets/index.css";
import Timetick from "../media/Timetick";

import { secondsToMinAndSec } from "../helpers/SecondsTimeFormat";

import classes from "../styles/MiniTimeline.module.css";

const MiniTimeline = (props) => {
  const miniTimelineValues = props.miniTimelineTicks.map((timeTick) => {
    return (
      <div className={classes["tick"]} key={timeTick}>
        <div
          style={{ height: "8px", width: "2px", backgroundColor: "black" }}
        ></div>
        <p style={{ position: "absolute", zIndex: "2" }}>
          {secondsToMinAndSec(timeTick)}
        </p>
      </div>
    );
  });

  const sliderChangeHandler = (e) => {
    props.onSliderChange(parseFloat(e));
  };

  const mouseDownHandler = () => {
    props.onMouseDown();
  };

  const mouseUpHandler = (e) => {
    props.onMouseUp(parseFloat(e));
  };

  return (
    <div style={{ marginTop: "8px" }}>
      <Slider
        min={0}
        max={0.999}
        step={0.001}
        value={props.playedFrac}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onChange={sliderChangeHandler}
        trackStyle={{ display: "none" }}
        railStyle={{ display: "none" }}
        handleStyle={{
          border: "none",
          backgroundColor: "none",
          boxShadow: "none",
          zIndex: 3,
          // paddingLeft: "2px",
        }}
        handle={(handleProps) => {
          return (
            <Handle {...handleProps}>
              <Timetick />
            </Handle>
          );
        }}
      />
      <div className={classes["mini-timeline"]}>
        <div className={classes["tick-container"]}>{miniTimelineValues}</div>
        {/* <div
          className={classes["zone-indicator"]}
          // maybe try to have these as variable first, to make sure that values are there before putting into code? problem is that video duration data takes a little time before it loads
          style={{
            left: `${(props.timelineValueRange[0] / props.duration) * props.playerWidth}px`,
            width: `${
              ((props.timelineValueRange[1] - props.timelineValueRange[0]) /
                props.duration) *
              props.playerWidth
            }px`,
            opacity: `${props.zoomLevel === 1 ? 0 : 1}`,
          }}
        ></div> */}
        <div
          className={classes["left-bracket"]}
          style={{
            left: `${
              (props.timelineValueRange[0] / props.duration) * props.playerWidth
            }px`,
            opacity: `${props.zoomLevel === 1 ? 0 : 1}`,
          }}
        ></div>
        <div
          className={classes["right-bracket"]}
          style={{
            left: `${
              (props.timelineValueRange[0] / props.duration) *
                props.playerWidth +
              ((props.timelineValueRange[1] - props.timelineValueRange[0]) /
                props.duration) *
                props.playerWidth -
              12
            }px`,
            opacity: `${props.zoomLevel === 1 ? 0 : 1}`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default MiniTimeline;
