import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { annotationActions } from "../store/annotation-slice";

import Slider, { Handle } from "rc-slider";
import { v4 as uuidv4 } from "uuid";

import classes from "../styles/Annotations.module.css";
// import Timebar from "../media/timebar.svg";
import Timebar from "../media/Timebar";
import FinishIcon from "../media/FinishIcon";
import ZoomInIcon from "../media/icons/zoom-in.svg";
import ZoomOutIcon from "../media/icons/zoom-out.svg";
import ClipIcon from "../media/icons/clip.svg";
import ResetIcon from "../media/icons/reset.svg";
import { secondsToMinAndSecDecimal } from "../helpers/SecondsTimeFormat";
import {
  validateAnnotationStart,
  validateFinishedAnnotation,
} from "../helpers/AnnotationValidation";

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
  let trackWidth;
  let annotationContainerHeight;
  if (props.screenWidth >= 992 && props.screenWidth < 1200) {
    trackWidth = 650;
    annotationContainerHeight = 200;
  }
  if (props.screenWidth >= 1200) {
    trackWidth = 800;
    annotationContainerHeight = 230;
  }

  const timelineValues = props.timelineTicks.map((timeTick) => {
    // only have timeline values if props.timelineTicks array is filled with actual values
    if (props.timelineTicks[1] !== 0) {
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
    props.escFunction();
    const category = e.target.closest("div").id;
    // const startTime = props.duration * props.playedFrac;
    const startTime = props.playedSec;
    // console.log(category, startTime, "🧩");

    const isValidated = validateAnnotationStart(
      annotations,
      category,
      startTime
    );

    if (!isValidated) {
      // ERROR ALERT MODAL
      // console.log("start segment is inside another segment ❌❌");
      return;
    }
    // if (isValidated) {
    setInitialAnnotationData((prevState) => ({
      ...prevState,
      category: category,
      startTimeSec: startTime.toFixed(2),
    }));
    setIsSelectingFinishTime(true);
    // }
  };

  const finishSegmentHandler = () => {
    const finishTime = props.duration * props.playedFrac;
    setIsSelectingFinishTime(false);
    console.log(finishTime);

    // for channelHasRadio and segment color logic
    const annotationChannelInfo = inputData.channels.filter(
      (channel) => channel.name === initialAnnotationData.category
    );
    const channelHasRadio = annotationChannelInfo[0].annotation
      ? annotationChannelInfo[0].annotation
          ?.map((annotation) => {
            if (Object.values(annotation).indexOf("radio") > -1) {
              return true;
            } else {
              return false;
            }
          })
          .includes(true)
      : false;

    console.log(annotationChannelInfo[0], channelHasRadio, "🧇");
    //

    const id = uuidv4().slice(0, 8);
    const data = {
      // segmentID: uuidv4(),
      segmentID: id,
      timeStartSec: +initialAnnotationData.startTimeSec,
      timeEndSec: +finishTime.toFixed(2),
      categoryName: initialAnnotationData.category,
      channelHasRadio: channelHasRadio,
    };

    const isValidated = validateFinishedAnnotation(
      annotations,
      data.categoryName,
      data.timeStartSec,
      data.timeEndSec,
      "end"
    );

    if (!isValidated) {
      setInitialAnnotationData({
        category: null,
        startTimeSec: null,
      });
      return;
    }
    // if (isValidated) {
    console.log("adding new data to redux annotations!!", data);
    dispatch(annotationActions.addAnnotation(data));
    setInitialAnnotationData({
      category: null,
      startTimeSec: null,
    });
    // }
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
            <button onClick={startSegmentHandler}>
              <img src={ClipIcon} alt="" />
            </button>
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
          style={{
            height: `${annotationContainerHeight / numberOfCategories}px`,
          }}
        >
          {annotations
            .filter((annotation) => annotation.categoryName === channel.name)

            .filter(
              (annotation) =>
                (annotation.timeStartSec > props.timelineTicks[0] &&
                  annotation.timeStartSec <
                    props.timelineTicks[props.numberOfTicks]) ||
                (annotation.timeEndSec > props.timelineTicks[0] &&
                  annotation.timeEndSec <
                    props.timelineTicks[props.numberOfTicks]) ||
                (annotation.timeStartSec > props.timelineTicks[0] &&
                  annotation.timeEndSec <
                    props.timelineTicks[props.numberOfTicks])
            )
            .map((annotation) => {
              const width =
                ((annotation.timeEndSec - annotation.timeStartSec) /
                  props.duration) *
                trackWidth *
                props.zoomLevel;

              const offsetLeft =
                ((annotation.timeStartSec - props.timelineTicks[0]) /
                  props.duration) *
                trackWidth *
                props.zoomLevel;

              // console.log(channel.annotation, "🥓");
              // const channelHasRadio = channel.annotation
              //   ?.map((annotation) => {
              //     if (Object.values(annotation).indexOf("radio") > -1) {
              //       return true;
              //     } else {
              //       return false;
              //     }
              //   })
              //   .includes(true);

              const channelHasRadio = annotation.channelHasRadio;

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
                    height: `${
                      annotationContainerHeight / numberOfCategories
                    }px`,
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
                    zIndex: 2,
                  }}
                  key={annotation.segmentID}
                  id={annotation.segmentID}
                  className={classes["annotation"]}
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
                height: `${annotationContainerHeight / numberOfCategories}px`,
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
          <button
            onClick={props.zoomOut}
            disabled={props.zoomLevel === 1}
            style={{ opacity: `${props.zoomLevel === 1 ? 0.5 : 1}` }}
            title="Zoom Out"
          >
            <img src={ZoomOutIcon} alt="" />
          </button>
          <button onClick={props.zoomIn} title="Zoom In">
            <img src={ZoomInIcon} alt="" />
          </button>
          <button
            onClick={props.resetZoom}
            // disabled={props.zoomLevel === 1}
            style={{ opacity: `${props.zoomLevel === 1 ? 0 : 1}` }}
            title="Reset Zoom"
          >
            <img
              src={ResetIcon}
              style={{
                transform: "scale(1, -1)",
              }}
              alt=""
            />
          </button>
          {/* <p>zoom: {props.zoomLevel}</p> */}
        </div>
        <div className={classes["timeline-slider"]}>
          <Slider
            min={0}
            max={1}
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
              // zIndex: `${props.currentlySelectedSegment ? 1 : 999}`,
            }}
            handle={(handleProps) => {
              return (
                <Handle {...handleProps}>
                  <Timebar screenWidth={props.screenWidth} />
                </Handle>
              );
            }}
          />

          <div className={classes["timeline"]}>
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
      <div className={classes["scroll-bar-container"]}>
        <div className={classes["category-name"]}></div>
        <div>test change</div>
      </div>
    </div>
  );
};

export default Annotations;
