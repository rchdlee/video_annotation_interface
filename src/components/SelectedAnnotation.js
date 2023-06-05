import { useSelector, useDispatch } from "react-redux";
import { annotationActions } from "../store/annotation-slice";
import classes from "./SelectedAnnotation.module.css";
import { useState } from "react";

const SelectedAnnotation = () => {
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

  console.log(annotationInfo, "✅");

  const radioOptionsLabel = annotationInfo?.annotation?.filter(
    (anno) => anno.type === "radio"
  )[0]?.label;
  const radioOptions = annotationInfo?.annotation
    ?.filter((anno) => anno.type === "radio")[0]
    ?.options.map((options) => options.option);

  const textBoxLabel = annotationInfo?.annotation?.filter(
    (anno) => anno.type === "textbox"
  )[0]?.label;

  console.log(radioOptionsLabel, radioOptions, textBoxLabel, "👼");

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
      <p>{textBoxLabel}</p>
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
      {isEditingComment ? (
        <button onClick={finishEditingHandler}>Finish Editing</button>
      ) : (
        <button onClick={editCommentHandler}>
          {selectedAnnotation?.comments ? "edit comment" : "add comment"}
        </button>
      )}
    </div>
  ) : (
    ""
  );

  return (
    <div className={classes["container"]}>
      <div className={classes["inner-container"]}>
        <div className={classes["deselect"]}>
          <p>Deselect (esc)</p>
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
            <p>{selectedAnnotation?.timeStartSec}</p>
          </div>
          <div className={classes["annotation-descriptor"]}>
            <p>End Time:</p>
            <p>{selectedAnnotation?.timeEndSec}</p>
          </div>
        </div>
        <div style={{ borderBottom: "1px solid black" }}></div>

        {/* dynamically generate */}
        <div className={classes["radio-form"]}>
          <p>{radioOptionsLabel}</p>
          <form>
            {radioForm}
            {/* <div className={classes["radio-btn"]}>
              <label htmlFor="">
                <input type="radio" value="Nod" checked={true} />
                Nod
              </label>
            </div>
            <div className={classes["radio-btn"]}>
              <label htmlFor="">
                <input type="radio" value="Shake" />
                Shake
              </label>
            </div>
            <div className={classes["radio-btn"]}>
              <label htmlFor="">
                <input type="radio" value="Other" />
                Other
              </label>
            </div> */}
          </form>
        </div>

        {/* NEED TO FIX` */}

        {textBoxForm2}
        {/* <div className={classes["comments"]}>
          <p>Comments:</p>
          <p>test comment</p>
          <button>edit comment</button>
          <input type="text" value="hi" />
        </div> */}
      </div>
    </div>
  );
};

export default SelectedAnnotation;
