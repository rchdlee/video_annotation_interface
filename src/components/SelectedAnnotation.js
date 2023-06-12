import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { annotationActions } from "../store/annotation-slice";
import classes from "../styles/SelectedAnnotation.module.css";

import { secondsToMinAndSecDecimal } from "../helpers/SecondsTimeFormat";

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

  const [isEditingComment, setIsEditingComment] = useState(false);

  const radioValueChangeHandler = (e) => {
    dispatch(annotationActions.setRadioValue(e.target.value));
  };

  const textBoxValueChangeHandler = (e) => {
    dispatch(annotationActions.setComment(e.target.value));
  };

  const editCommentHandler = () => {
    setIsEditingComment(true);
  };

  const finishEditingHandler = () => {
    setIsEditingComment(false);
  };

  const deselectHandler = () => {
    console.log("deselecting");
    props.deselect();
  };

  const playSegmentHandler = () => {
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
      console.log("cancel timeout 👜");
      clearTimeout(timeoutID);
      setIsPlayingSegment(false);
    };
    window.addEventListener("mousedown", cancelTimeout);
    window.addEventListener("keydown", cancelTimeout);
  };

  const deleteSegmentHandler = () => {
    dispatch(annotationActions.deleteSelectedAnnotation());
    props.deselect();
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
    <div className={classes["comments"]}>
      <p>{textBoxLabel}</p>
      <input
        type="text"
        value={selectedAnnotation?.comments}
        onChange={textBoxValueChangeHandler}
      />
    </div>
  ) : (
    ""
  );

  const textBoxForm2 = textBoxLabel ? (
    <div className={classes["comments"]}>
      <div>
        <p>{textBoxLabel}</p>
        {isEditingComment ? (
          <button onClick={finishEditingHandler}>Save</button>
        ) : (
          <button onClick={editCommentHandler}>
            {selectedAnnotation?.comments ? "edit comment" : "add comment"}
          </button>
        )}
      </div>
      {isEditingComment ? (
        <input
          type="text"
          value={selectedAnnotation?.comments}
          onChange={textBoxValueChangeHandler}
        />
      ) : (
        <p style={{ marginLeft: "16px" }}>
          {selectedAnnotation?.comments ? selectedAnnotation?.comments : ""}
        </p>
      )}
    </div>
  ) : (
    ""
  );

  const textBoxForm3 = textBoxLabel ? (
    <form className={classes["comments"]}>
      <div className={classes["comment-label-container"]}>
        <label>{textBoxLabel}</label>
        {isEditingComment ? (
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
      {isEditingComment ? (
        <input
          type="text"
          value={selectedAnnotation?.comments}
          onChange={textBoxValueChangeHandler}
          className={classes["edit-input"]}
        />
      ) : (
        <p style={{ marginLeft: "16px" }}>
          {selectedAnnotation?.comments ? selectedAnnotation?.comments : ""}
        </p>
      )}
      <div style={{ borderBottom: "1px solid black" }}></div>
    </form>
  ) : (
    ""
  );

  return (
    <div className={classes["container"]}>
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

        {textBoxForm3}
        <div>
          <button onClick={playSegmentHandler} disabled={isPlayingSegment}>
            Play Segment
          </button>
          <button disabled={isPlayingSegment}>Edit Segment</button>
          <button onClick={deleteSegmentHandler} disabled={isPlayingSegment}>
            Delete Segment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedAnnotation;
