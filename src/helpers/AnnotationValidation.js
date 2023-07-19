import { useSelector } from "react-redux";

// const annotations = useSelector((state) => state.annotation.annotations);

export const validateAnnotationStart = (annotations, category, startTime) => {
  // console.log(category, startTime, "🍠");

  const sameCategoryData = annotations.filter(
    (segment) => segment.categoryName === category
  );

  const startSegmentOverlapData = sameCategoryData.map((segment) => {
    return {
      segmentID: segment.segmentID,
      greaterThanStart: startTime >= segment.timeStartSec,
      lessThanEnd: startTime <= segment.timeEndSec,
    };
  });

  const startOverlapSegments = startSegmentOverlapData.filter(
    (segment) =>
      segment.greaterThanStart === true && segment.lessThanEnd === true
  );

  if (startOverlapSegments.length > 0) {
    // console.log(
    //   "start segment is inside another segment ❌❌ from annovalidation func"
    // );
    return false;
  } else {
    return true;
  }
};

export const validateFinishedAnnotation = (
  annotations,
  category,
  startTime,
  endTime,
  whichIsNew,
  selectedID
) => {
  // console.log(category, startTime, endTime, "🦪");

  let newTime;

  if (whichIsNew === "start") {
    newTime = startTime;
  }
  if (whichIsNew === "end") {
    newTime = endTime;
  }

  // console.log(selectedID, "🦪");
  const sameCategoryData = annotations
    .filter((annotation) => annotation.categoryName === category)
    .filter((annotation) => annotation.segmentID !== selectedID);

  // console.log(sameCategoryData);

  const segmentOverlapData = sameCategoryData.map((segment) => {
    return {
      greaterThanStart: newTime >= segment.timeStartSec,
      lessThanEnd: newTime <= segment.timeEndSec,
      containsAnotherSegment:
        startTime <= segment.timeStartSec && endTime >= segment.timeEndSec,
    };
  });

  const newTimeOverlapSegments = segmentOverlapData.filter(
    (segment) =>
      segment.greaterThanStart === true && segment.lessThanEnd === true
  );
  const envelopingSegments = segmentOverlapData.filter(
    (segment) => segment.containsAnotherSegment === true
  );

  if (newTimeOverlapSegments.length > 0) {
    // console.log(`segment ${whichIsNew} overlaps another annotation! 😅😅`);
    return [false, `Annotation ${whichIsNew} overlaps another annotation!`];
  }
  if (envelopingSegments.length > 0) {
    // console.log("segment cannot contain another segment inside! 😅😅");
    return [false, "Annotation cannot contain another segment inside!"];
  }
  if (endTime <= startTime) {
    // console.log("segment end mut be greater than start time 😅😅");
    return [false, "Ending time must be greater than start time!"];
  } else {
    return [true, ""];
  }
};
