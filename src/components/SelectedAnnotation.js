import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { annotationActions } from "../store/annotation-slice";
import classes from "../styles/SelectedAnnotation.module.css";

import PlayCircle from "../media/icons/playcircle.svg";
import TrashIcon from "../media/icons/trashicon.svg";
import PenIcon from "../media/icons/pen-icon.svg";

import { secondsToMinAndSecDecimal } from "../helpers/SecondsTimeFormat";
import { validateFinishedAnnotation } from "../helpers/AnnotationValidation";

const SelectedAnnotation = (props) => {
  const dispatch = useDispatch();
  const annotations = useSelector((state) => state.annotation.annotations);
  const selectedAnnotationIndex = useSelector(
    (state) => state.annotation.currentlySelectedSegmentArrayIndex
  );
  const inputData = useSelector((state) => state.annotation.inputData);
  const selectedAnnotation = annotations?.[selectedAnnotationIndex];
  const selectedAnnotationCategory = selectedAnnotation?.categoryName;
  const annotationInfo = inputData?.channels.filter(
    (channel) => channel.name === selectedAnnotationCategory
  )[0];

  // to cancel play clip pause on timeout
  const [isPlayingSegment, setIsPlayingSegment] = useState(false);

  const radioOptionsLabel = annotationInfo?.annotation?.filter(
    (anno) => anno.type === "radio"
  )[0]?.label;
  const radioOptions = annotationInfo?.annotation
    ?.filter((anno) => anno.type === "radio")[0]
    ?.options.map((options) => options.option);

  const textBoxLabel = annotationInfo?.annotation?.filter(
    (anno) => anno.type === "textbox"
  )[0]?.label;

  // console.log(radioOptionsLabel, radioOptions, textBoxLabel, "👼");

  // const [isEditingComment, setIsEditingComment] = useState(false);

  const radioValueChangeHandler = (e) => {
    dispatch(annotationActions.setRadioValue(e.target.value));
  };

  const textBoxValueChangeHandler = (e) => {
    dispatch(annotationActions.setComment(e.target.value));
  };

  const editCommentHandler = () => {
    props.setIsEditingComment(true);
  };

  const finishEditingHandler = () => {
    props.setIsEditingComment(false);
  };

  const deselectHandler = () => {
    console.log("deselecting");
    props.deselect();
  };

  const playSegmentHandler = () => {
    if (!selectedAnnotation) {
      return;
    }
    console.log(selectedAnnotation.timeStartSec);
    const annotationDurationMS =
      (selectedAnnotation.timeEndSec - selectedAnnotation.timeStartSec) * 1000;
    props.seekTo(selectedAnnotation.timeStartSec);
    setIsPlayingSegment(true);
    props.play();
    const timeoutID = setTimeout(() => {
      console.log("pausing!!! 🤖");
      setIsPlayingSegment(false);
      props.pause();
    }, [annotationDurationMS]);

    const cancelTimeout = () => {
      // console.log("cancel timeout 👜");
      clearTimeout(timeoutID);
      setIsPlayingSegment(false);
    };
    window.addEventListener("mousedown", cancelTimeout);
    window.addEventListener("keydown", cancelTimeout);
  };

  const deleteSegmentHandler = () => {
    if (!selectedAnnotation) {
      return;
    }
    dispatch(annotationActions.deleteSelectedAnnotation());
    props.deselect();
  };

  const editSegmentStartHandler = () => {
    if (!selectedAnnotation) {
      return;
    }
    console.log("editing start");
    const newStartTime = props.playedSec;
    const isValidated = validateFinishedAnnotation(
      annotations,
      selectedAnnotationCategory,
      newStartTime,
      selectedAnnotation.timeEndSec,
      "start",
      selectedAnnotation.segmentID
    );

    if (!isValidated[0]) {
      props.throwNewError(isValidated[1]);
      return;
    }

    dispatch(annotationActions.editSelectedAnnotationStartTime(newStartTime));
  };

  const editSegmentEndHandler = () => {
    if (!selectedAnnotation) {
      return;
    }
    console.log("editing end");
    const newEndTime = props.playedSec;
    const isValidated = validateFinishedAnnotation(
      annotations,
      selectedAnnotationCategory,
      selectedAnnotation.timeStartSec,
      newEndTime,
      "end",
      selectedAnnotation.segmentID
    );

    if (!isValidated[0]) {
      props.throwNewError(isValidated[1]);
      return;
    }
    dispatch(annotationActions.editSelectedAnnotationEndTime(newEndTime));
  };

  const shortcutFunction = (e) => {
    if (props.isEditingComment) {
      return;
    }

    if (e.code === "Digit1") {
      editSegmentStartHandler();
    }

    if (e.code === "Digit2") {
      editSegmentEndHandler();
    }

    if (e.code === "Digit3") {
      playSegmentHandler();
    }

    if (e.code === "Digit4") {
      deleteSegmentHandler();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", shortcutFunction, false);

    return () => {
      document.removeEventListener("keydown", shortcutFunction, false);
    };
  }, [shortcutFunction]);

  const annotationSubmitHandler = () => {
    const annotationsNeedMoreWork = annotations.map((annotation) => {
      if (annotation.channelHasRadio && annotation.radio === null) {
        return true;
      } else {
        return false;
      }
    });
    const numberOfAnnosThatNeedWork = annotationsNeedMoreWork.filter(
      (bool) => bool === true
    ).length;

    console.log(annotationsNeedMoreWork);

    if (annotationsNeedMoreWork.includes(true)) {
      props.throwNewError(
        `${numberOfAnnosThatNeedWork} annotation${
          numberOfAnnosThatNeedWork > 1 ? "s" : ""
        } (gray) still need${
          numberOfAnnosThatNeedWork > 1 ? "" : "s"
        } radio button data to be filled`
      );
      return;
    }

    const annotationData = {
      path: inputData.path,
      annotations: annotations,
    };
    const annotationDataJSON = JSON.stringify(annotationData);
    console.log(annotationDataJSON);
    alert(`successfully submitted data! ${annotationDataJSON}`);
  };

  const radioForm = radioOptions
    ? radioOptions.map((option) => {
        return (
          <div className={classes["radio-btn"]} key={option}>
            <label htmlFor="">
              <input
                type="radio"
                value={option}
                checked={selectedAnnotation?.radio === option}
                onChange={radioValueChangeHandler}
              />
              {option}
            </label>
          </div>
        );
      })
    : "";

  const textBoxForm = textBoxLabel ? (
    <form className={classes["comments"]}>
      <div className={classes["comment-label-container"]}>
        <label>{textBoxLabel}</label>
        {props.isEditingComment ? (
          <input
            type="submit"
            onClick={finishEditingHandler}
            value="Save"
          ></input>
        ) : (
          <button onClick={editCommentHandler}>
            {selectedAnnotation?.comments ? "edit comment" : "add comment"}
          </button>
        )}
      </div>
      {props.isEditingComment ? (
        <input
          type="text"
          value={selectedAnnotation?.comments}
          onChange={textBoxValueChangeHandler}
          className={classes["edit-input"]}
        />
      ) : (
        <p
        // style={{ marginLeft: "16px" }}
        >
          {selectedAnnotation?.comments
            ? selectedAnnotation?.comments
            : "[empty]"}
        </p>
      )}
    </form>
  ) : (
    ""
  );

  return (
    <div className={classes["container"]}>
      {props.currentlySelectedSegment ? (
        <div className={classes["inner-container"]}>
          <div className={classes["deselect"]} onClick={deselectHandler}>
            <p>Deselect (esc)</p>
            {/* {props.currentlySelectedSegment ? <p>Deselect (esc)</p> : ""} */}
          </div>
          <div className={classes["annotation-information"]}>
            <div className={classes["annotation-descriptor"]}>
              <p>Annotation ID:</p>
              <p>{selectedAnnotation?.segmentID}</p>
            </div>
            <div className={classes["annotation-descriptor"]}>
              <p>Category:</p>
              <p>{selectedAnnotation?.categoryName}</p>
            </div>
            <div className={classes["annotation-descriptor"]}>
              <p>Start Time:</p>
              <p>
                {selectedAnnotation?.timeStartSec
                  ? secondsToMinAndSecDecimal(selectedAnnotation?.timeStartSec)
                  : ""}
              </p>
            </div>
            <div className={classes["annotation-descriptor"]}>
              <p>End Time:</p>
              <p>
                {selectedAnnotation?.timeEndSec
                  ? secondsToMinAndSecDecimal(selectedAnnotation?.timeEndSec)
                  : ""}
              </p>
            </div>
          </div>
          <div style={{ borderBottom: "1px solid black" }}></div>

          <div className={classes["radio-form"]}>
            <p>{radioOptionsLabel}</p>
            <form>{radioForm}</form>
          </div>

          {textBoxForm}

          <div className={classes["button-container"]}>
            <button
              onClick={editSegmentStartHandler}
              disabled={isPlayingSegment}
              className={classes["multi-button"]}
              title="Set New Start Time"
            >
              {/* Set New Start */}
              <img src={PenIcon} alt="" />
              <p style={{ fontSize: "18px" }}>[</p>
            </button>
            <button
              onClick={editSegmentEndHandler}
              disabled={isPlayingSegment}
              className={classes["multi-button"]}
              title="Set New End Time"
            >
              {/* Set New End */}
              <img src={PenIcon} alt="" />
              <p style={{ fontSize: "18px" }}>]</p>
            </button>
            <button
              onClick={playSegmentHandler}
              disabled={isPlayingSegment}
              title="Play Clip"
            >
              <img src={PlayCircle} alt="" />
            </button>
            <button
              onClick={deleteSegmentHandler}
              disabled={isPlayingSegment}
              title="Delete Annotation"
            >
              <img src={TrashIcon} alt="" />
            </button>
          </div>
        </div>
      ) : (
        <div className={classes["main-menu-container"]}>
          <div>
            <h4 className={classes["title"]}>
              COMPSY Video Annotation Interface
            </h4>
            <ul className={classes["main-menu"]}>
              <a href="/" target="_blank">
                <li>User Guide</li>
              </a>
              <a href="/" target="_blank">
                <li>FAQs</li>
              </a>
              <a href="/" target="_blank">
                <li>List of Shortcuts</li>
              </a>
              <a href="/" target="_blank">
                <li>Bug/Suggestion Form</li>
              </a>
            </ul>
          </div>
          <div>--</div>
          <div className={classes["main-menu-bottom"]}>
            <div className={classes["video-path"]}>
              <p>Video Path:</p>
              <p>{inputData?.path}</p>
            </div>
            <button
              className={classes["submit-btn"]}
              onClick={annotationSubmitHandler}
            >
              Submit Annotations
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedAnnotation;
