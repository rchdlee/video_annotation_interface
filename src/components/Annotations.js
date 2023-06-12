import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { annotationActions } from "../store/annotation-slice";

import Slider, { Handle } from "rc-slider";
import { v4 as uuidv4 } from "uuid";

import classes from "../styles/Annotations.module.css";
// import Timebar from "../media/timebar.svg";
import Timebar from "../media/Timebar";
import FinishIcon from "../media/FinishIcon";
import { secondsToMinAndSecDecimal } from "../helpers/SecondsTimeFormat";

const Annotations = (props) => {
  //
  // MOVE TO APP.JS FOR SELECTEDANNO DESELECTING
  // const [currentlySelectedSegment, setCurrentlySelectedSegment] =
  //   useState(null);
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
          {/* <div style={{ height: "8px", borderLeft: "2px solid black" }}></div> */}
          <div
            style={{ height: "8px", width: "2px", backgroundColor: "black" }}
          ></div>
          <p style={{ position: "absolute", margin: "0" }}>
            {secondsToMinAndSecDecimal(timeTick)}
          </p>
        </div>
      );
    }
  });

  const startSegmentHandler = (e) => {
    const category = e.target.closest("div").id;
    const startTime = props.duration * props.playedFrac;
    console.log(category, startTime, "🧩");

    // OVERLAP CHECK
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
        startTimeSec: startTime.toFixed(2),
      }));
      setIsSelectingFinishTime(true);
    }
  };

  const finishSegmentHandler = () => {
    const finishTime = props.duration * props.playedFrac;
    setIsSelectingFinishTime(false);
    console.log(finishTime);

    const data = {
      segmentID: uuidv4(),
      timeStartSec: +initialAnnotationData.startTimeSec,
      timeEndSec: +finishTime.toFixed(2),
      categoryName: initialAnnotationData.category,
    };

    console.log(data, "😡");

    // OVERLAP CHECK
    const sameCategoryData = annotations.filter(
      (annotation) => annotation.categoryName === data.categoryName
    );

    const segmentEndOverlapData = sameCategoryData.map((segment) => {
      return {
        segmentID: segment.segmentID,
        greaterThanStart: data.timeEndSec > segment.timeStartSec,
        lessThanEnd: data.timeEndSec < segment.timeEndSec,
        containsAnotherSegment:
          data.timeStartSec < segment.timeStartSec &&
          data.timeEndSec > segment.timeEndSec,
      };
    });

    const endOverlapSegments = segmentEndOverlapData.filter(
      (segment) =>
        segment.greaterThanStart === true && segment.lessThanEnd === true
    );
    const overlappingSegments = segmentEndOverlapData.filter(
      (segment) => segment.containsAnotherSegment === true
    );

    if (endOverlapSegments.length > 0) {
      console.log("segment end overlaps another annotation! 😅");
      setInitialAnnotationData({
        category: null,
        startTimeSec: null,
      });
      return;
    }

    if (overlappingSegments.length > 0) {
      console.log("segment contains an existing annotation! 😅");
      setInitialAnnotationData({
        category: null,
        startTimeSec: null,
      });
      return;
    }

    if (data.timeEndSec <= data.timeStartSec) {
      console.log("segment end must be greater than start time! 😅");
      setInitialAnnotationData({
        category: null,
        startTimeSec: null,
      });
      return;
    }

    console.log("adding new data to redux annotations!!", data);
    dispatch(annotationActions.addAnnotation(data));
    setInitialAnnotationData({
      category: null,
      startTimeSec: null,
    });
  };

  const annotationClickHandler = (e) => {
    const id = e.target.closest("div").id;
    console.log(id);
    props.setCurrentlySelectedSegment(id);
    dispatch(annotationActions.setCurrentlySelectedSegment(id));

    const annotationStartTime = annotations.filter(
      (anno) => anno.segmentID === id
    )[0].timeStartSec;
    props.seekTo(annotationStartTime);
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
            <button
              onClick={finishSegmentHandler}
              disabled={channel.name !== initialAnnotationData.category}
            >
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

              // console.log(channel.annotation, "🥓");
              const channelHasRadio = channel.annotation
                ?.map((annotation) => {
                  if (Object.values(annotation).indexOf("radio") > -1) {
                    return true;
                  } else {
                    return false;
                  }
                })
                .includes(true);

              const annotationHasRadioData = annotation.radio;

              // console.log(
              //   channel.name,
              //   channelHasRadio,
              //   annotationHasRadioData,
              //   "🍴"
              // );

              const needsMoreWork =
                channelHasRadio && annotationHasRadioData === null;

              return (
                <div
                  style={{
                    position: "absolute",
                    width: `${width}px`,
                    height: `${250 / numberOfCategories}px`,
                    // backgroundColor: "lightblue",
                    backgroundColor: `${
                      needsMoreWork ? "lightcoral" : "lightblue"
                    }`,
                    left: `${offsetLeft}px`,
                    border: `${
                      props.currentlySelectedSegment === annotation.segmentID
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

          {/* start tick */}
          {initialAnnotationData.category === channel.name ? (
            <div
              style={{
                position: "absolute",
                width: `2px`,
                height: `${250 / numberOfCategories}px`,
                backgroundColor: "black",
                left: `${
                  ((initialAnnotationData.startTimeSec -
                    (props.windowNumber - 1) * props.windowTime) /
                    props.duration) *
                  trackWidth *
                  props.zoomLevel
                }px`,
              }}
            ></div>
          ) : (
            ""
          )}
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
            max={1}
            step={0.001}
            value={sliderFrac}
            onMouseDown={mouseDownHandler}
            onMouseUp={mouseUpHandler}
            onChange={sliderChangeHandler}
            // trackStyle={{ display: "none" }}
            // railStyle={{ display: "none" }}
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
        </div>
      </div>
      <div className={classes["annotation-container"]}>{Annotations}</div>
    </div>
  );
};

export default Annotations;
