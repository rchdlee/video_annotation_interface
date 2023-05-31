import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { annotationActions } from "../store/annotation-slice";

import classes from "./Annotations.module.css";
import Timebar from "../media/timebar.svg";
import { secondsToMinAndSecDecimal } from "../helpers/SecondsTimeFormat";

const Annotations = (props) => {
  // const [zoom, setZoom] = useState(1);

  const dispatch = useDispatch();
  const inputData = useSelector((state) => state.annotation.inputData);
  // const zoom = useSelector((state) => state.annotation.zoom);

  // const duration = props.duration;
  const trackWidth = 800;
  // const numberOfTicks = 9;
  // const timelineTicks = [];

  // const windowTime = props.duration / zoom ?? -1; //0
  // const windowNumber = Math.trunc(props.playedSec / windowTime) + 1;
  // const tickInterval = windowTime / numberOfTicks;

  // for (let i = 0; i <= numberOfTicks; i++) {
  //   timelineTicks.push(windowTime * (windowNumber - 1) + i * tickInterval);
  // }

  // const timelineValueRange = [timelineTicks[0], timelineTicks[numberOfTicks]];

  // console.log(
  //   props.playedSec,
  //   windowTime,
  //   windowNumber,
  //   timelineTicks,
  //   timelineValueRange,
  //   "🥩"
  // );

  // if (windowTime !== 0) {
  //   dispatch(annotationActions.setTimelineValueRange(timelineValueRange));
  //   console.log("redux setTimelineValueRange");
  // }

  const timelineValues = props.timelineTicks.map((timeTick) => {
    // only have timeline values if non NaN values in timetick - not sure if this is right though
    if (props.windowNumber) {
      return (
        <div style={{ position: "relative" }} key={timeTick}>
          <div style={{ height: "8px", borderLeft: "2px solid black" }}></div>
          <p style={{ position: "absolute", margin: "0" }}>
            {secondsToMinAndSecDecimal(timeTick)}
          </p>
        </div>
      );
    }
  });

  const DUMMY_ANNOTATIONS = [
    {
      segmentID: "1249-yu23",
      timeStartSec: 14,
      timeEndSec: 17.9,
      categoryName: "Head movements",
      radio: null,
      comments: null,
    },
    {
      segmentID: "2f2t-3tku",
      timeStartSec: 125,
      timeEndSec: 142,
      categoryName: "Head movements",
      radio: null,
      comments: null,
    },
    {
      segmentID: "2pvf-tvh2",
      timeStartSec: 218,
      timeEndSec: 224,
      categoryName: "Expressions",
      radio: null,
      comments: null,
    },
    {
      segmentID: "9849-th38",
      timeStartSec: 232,
      timeEndSec: 265,
      categoryName: "QC Problems",
      radio: null,
      comments: null,
    },
    {
      segmentID: "t33t-38fb",
      timeStartSec: 278,
      timeEndSec: 283,
      categoryName: "Speech",
      radio: null,
      comments: null,
    },
  ];

  const numberOfCategories = inputData?.channels.length;


  const Annotations = inputData?.channels.map((channel) => {
    return (
      <div className={classes["annotation-row"]} key={channel.name}>
        <div className={classes["category-name"]}>
          <p>{channel.name}</p>
        </div>
        <div
          className={classes["annotations"]}
          style={{ height: `${250 / numberOfCategories}px` }}
        >
          {DUMMY_ANNOTATIONS.filter(
            (annotation) => annotation.categoryName === channel.name
          )
            .filter(
              (annotation) =>
                (annotation.timeStartSec <
                  props.windowNumber * props.windowTime &&
                  annotation.timeStartSec >
                    (props.windowNumber - 1) * props.windowTime) ||
                (annotation.timeEndSec <
                  props.windowNumber * props.windowTime &&
                  annotation.timeEndSec >
                    (props.windowNumber - 1) * props.windowTime) ||
                (annotation.timeStartSec <
                  (props.windowNumber - 1) * props.windowTime &&
                  annotation.timeEndSec > props.windowNumber * props.windowTime)
            )
            .map((annotation) => {
              const width =
                ((annotation.timeEndSec - annotation.timeStartSec) /
                  props.duration) *
                trackWidth *
                props.zoomLevel;
              const offsetLeft =
                ((annotation.timeStartSec -
                  (props.windowNumber - 1) * props.windowTime) /
                  props.duration) *
                trackWidth *
                props.zoomLevel;

              return (
                <div
                  style={{
                    position: "absolute",
                    width: `${width}px`,
                    height: `${250 / numberOfCategories}px`,
                    backgroundColor: "blue",
                    left: `${offsetLeft}px`,
                  }}
                  key={annotation.segmentID}
                  id={annotation.segmentID}
                ></div>
              );
            })}
        </div>
      </div>
    );
  });

  // const zoomOutHandler = () => {
  //   if (zoom > 1) {
  //     dispatch(annotationActions.zoomOut());
  //   }
  // };

  // const zoomInHandler = () => {
  //   dispatch(annotationActions.zoomIn());
  // };

  // left: `${
  //   ((currentTime - timelineValueRange[0]) /
  //     (timelineValueRange[1] - timelineValueRange[0])) *
  //     800 +
  //   50
  // }px`,

  const timebarMouseDownHandler = () => {
    console.log("mouse down");
  };

  return (
    <div>
      <div className={classes["timeline-container"]}>
        <div className={classes["top-left-container"]}>
          <button onClick={props.zoomOut}>zoom out</button>
          <button onClick={props.zoomIn}>zoom in</button>
        </div>
        <div className={classes["timeline"]}>
          <div style={{ height: "24px", width: "800px" }}>
            <div
              style={{ borderBottom: "2px solid black", marginTop: "16px" }}
            ></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {timelineValues}
            </div>
          </div>
          <div
            onMouseDown={timebarMouseDownHandler}
            className={classes["timebar"]}
            style={{
              left: `${
                ((props.playedFrac * props.duration -
                  props.timelineValueRange[0]) /
                  (props.timelineValueRange[1] - props.timelineValueRange[0])) *
                  trackWidth -
                5
              }px`,
            }}
          >
            <img src={Timebar} alt="timebar" />
          </div>
          {/* <div
            className={classes["time-bar"]}
            style={{
              left: `${
                ((props.playedFrac * props.duration -
                  props.timelineValueRange[0]) /
                  (props.timelineValueRange[1] - props.timelineValueRange[0])) *
                  trackWidth -
                8
              }px`,
            }}
          >
            <div className={classes["triangle"]}>
              <div className={classes["line"]}></div>
            </div>
          </div> */}
        </div>
      </div>
      <div className={classes["annotation-container"]}>
        {Annotations}
        {/* <div className={classes["annotation-row"]}>
          <div className={classes["category-name"]}>
            <p>category</p>
          </div>
          <div className={classes["annotations"]}>
            <div
              style={{
                position: "absolute",
                width: "43px",
                height: "10vh",
                backgroundColor: "blue",
                left: "70px",
                zIndex: "999",
              }}
            ></div>
          </div>
        </div>
        <div className={classes["annotation-row"]}>
          <div>category</div>
          <div className={classes["annotations"]}>annotations</div>
        </div>
        <div className={classes["annotation-row"]}>
          <div>category</div>
          <div className={classes["annotations"]}>annotations</div>
        </div> */}
      </div>
    </div>
  );
};

export default Annotations;
