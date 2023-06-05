import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { annotationActions } from "../store/annotation-slice";

import Slider, { Handle } from "rc-slider";
import { v4 as uuidv4 } from "uuid";

import classes from "./Annotations.module.css";
// import Timebar from "../media/timebar.svg";
import Timebar from "../media/Timebar";
import FinishIcon from "../media/FinishIcon";
import { secondsToMinAndSecDecimal } from "../helpers/SecondsTimeFormat";

const Annotations = (props) => {
  //
  // MOVE TO APP.JS FOR SELECTEDANNO DESELECTING
  const [currentlySelectedSegment, setCurrentlySelectedSegment] =
    useState(null);
  const [isSelectingFinishTime, setIsSelectingFinishTime] = useState(false);
  const [initialAnnotationData, setInitialAnnotationData] = useState({
    category: null,
    startTimeSec: null,
  });

  const dispatch = useDispatch();
  const inputData = useSelector((state) => state.annotation.inputData);
  const annotations = useSelector((state) => state.annotation.annotations);
  const trackWidth = 800;

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

  const startSegmentHandler = (e) => {
    const category = e.target.closest("div").id;
    const startTime = props.duration * props.playedFrac;
    console.log(category, startTime, "🧩");

    // OVERLAP VALIDATION
    const sameCategoryData = annotations.filter(
      (segment) => segment.categoryName === category
    );

    const startSegmentOverlapData = sameCategoryData.map((segment) => {
      return {
        segmentID: segment.segmentID,
        greaterThanStart: startTime > segment.timeStartSec,
        lessThanEnd: startTime < segment.timeEndSec,
      };
    });

    const startOverlapSegments = startSegmentOverlapData.filter(
      (segment) =>
        segment.greaterThanStart === true && segment.lessThanEnd === true
    );

    if (startOverlapSegments.length > 0) {
      console.log("start segment is inside another segment ❌");
      return;
    } else {
      setInitialAnnotationData((prevState) => ({
        ...prevState,
        category: category,
        startTimeSec: startTime,
      }));
      setIsSelectingFinishTime(true);
    }
  };

  // const testID = uuidv4();
  // console.log(testID, "☕");

  // {
  //   segmentID: "1249-yu23",
  //   timeStartSec: 14,
  //   timeEndSec: 27.9,
  //   categoryName: "Head movements",
  //   radio: null,
  //   comments: "test comment",
  // }

  const finishSegmentHandler = () => {
    const finishTime = props.duration * props.playedFrac;
    setIsSelectingFinishTime(false);
    console.log(finishTime);

    const data = {
      segmentID: uuidv4(),
      timeStartSec: initialAnnotationData.startTimeSec,
      timeEndSec: finishTime,
      categoryName: initialAnnotationData.category,
    };

    // check for overlap
    const sameCategoryData = annotations.filter(
      (annotation) => annotation.categoryName === data.category
    );

    // const segmentEndOverlapData = sameCategoryData.map((segment) => {
    //   return {
    //     segmentID: segment.segmentID,
    //     greaterThanStart: data.timeEndSec > segment.timeStartSec,
    // CONTINUE HERE
    //   }
    // })
  };

  const annotationClickHandler = (e) => {
    const id = e.target.closest("div").id;
    console.log(id);
    setCurrentlySelectedSegment(id);
    dispatch(annotationActions.setCurrentlySelectedSegment(id));
  };

  const numberOfCategories = inputData?.channels.length;

  const Annotations = inputData?.channels.map((channel) => {
    return (
      <div className={classes["annotation-row"]} key={channel.name}>
        <div className={classes["category-name"]} id={channel.name}>
          <p>{channel.name}</p>
          {!isSelectingFinishTime ? (
            <button onClick={startSegmentHandler}>+</button>
          ) : (
            <button onClick={finishSegmentHandler}>
              <FinishIcon />
            </button>
          )}
        </div>
        <div
          className={classes["annotations"]}
          style={{ height: `${250 / numberOfCategories}px` }}
        >
          {annotations
            .filter((annotation) => annotation.categoryName === channel.name)
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
                    backgroundColor: "lightblue",
                    left: `${offsetLeft}px`,
                    border: `${
                      currentlySelectedSegment === annotation.segmentID
                        ? "3px solid blue"
                        : ""
                    }`,
                  }}
                  key={annotation.segmentID}
                  id={annotation.segmentID}
                  onClick={annotationClickHandler}
                ></div>
              );
            })}
        </div>
      </div>
    );
  });

  const sliderFrac =
    (props.playedFrac * props.duration - props.timelineValueRange[0]) /
    (props.timelineValueRange[1] - props.timelineValueRange[0]);

  const sliderChangeHandler = (e) => {
    const playedFrac =
      (e * (props.timelineValueRange[1] - props.timelineValueRange[0]) +
        props.timelineValueRange[0]) /
      props.duration;
    props.onSliderChange(parseFloat(playedFrac));
  };

  const mouseDownHandler = () => {
    props.onMouseDown();
  };

  const mouseUpHandler = (e) => {
    const playedFrac =
      (e * (props.timelineValueRange[1] - props.timelineValueRange[0]) +
        props.timelineValueRange[0]) /
      props.duration;
    props.onMouseUp(parseFloat(playedFrac));
  };

  return (
    <div>
      <div className={classes["timeline-container"]}>
        <div className={classes["top-left-container"]}>
          <button onClick={props.zoomOut}>zoom out</button>
          <button onClick={props.zoomIn}>zoom in</button>
          <button onClick={props.resetZoom}>reset zoom</button>
        </div>
        <div className={classes["timeline"]}>
          <Slider
            min={0}
            max={0.999}
            step={0.001}
            value={sliderFrac}
            onMouseDown={mouseDownHandler}
            onMouseUp={mouseUpHandler}
            onChange={sliderChangeHandler}
            trackStyle={{ display: "none" }}
            railStyle={{ display: "none" }}
            handleStyle={{
              border: "2px solid white",
              boxShadow: "none",
              zIndex: 999,
            }}
            handle={(handleProps) => {
              return (
                <Handle {...handleProps}>
                  <Timebar />
                </Handle>
              );
            }}
          />

          <div style={{ height: "24px", width: "800px" }}>
            <div
              style={{ borderBottom: "2px solid black", marginTop: "4px" }}
            ></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {timelineValues}
            </div>
          </div>

          {/* TO BE DELETED */}
          {/* <div
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
            <Timebar />
          </div> */}
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
