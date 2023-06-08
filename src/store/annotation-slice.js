import { createSlice } from "@reduxjs/toolkit";

const annotationSlice = createSlice({
  name: "annotations",
  initialState: {
    inputData: null,
    annotations: [
      {
        segmentID: "1249-yu23",
        timeStartSec: 14,
        timeEndSec: 27.9,
        categoryName: "Head movements",
        radio: null,
        comments: "test comment",
      },
      {
        segmentID: "2f2t-3tku",
        timeStartSec: 125,
        timeEndSec: 142,
        categoryName: "Head movements",
        radio: "Shake",
        comments: "",
      },
      {
        segmentID: "2pvf-tvh2",
        timeStartSec: 218,
        timeEndSec: 224,
        categoryName: "Expressions",
        radio: null,
        comments: "",
      },
      {
        segmentID: "9849-th38",
        timeStartSec: 232,
        timeEndSec: 265,
        categoryName: "QC Problems",
        radio: null,
        comments: "",
      },
      {
        segmentID: "t33t-38fb",
        timeStartSec: 278,
        timeEndSec: 283,
        categoryName: "Speech",
        radio: null,
        comments: "",
      },
    ],
    currentlySelectedSegmentID: null,
    currentlySelectedSegmentArrayIndex: null,
    timelineValueRange: null,
    // zoom: 1,
  },
  reducers: {
    setVideoInputData(state, action) {
      const input = action.payload;
      state.inputData = input;
    },
    setTimelineValueRange(state, action) {
      const rangeArray = action.payload;
      state.timelineValueRange = rangeArray;
      console.log("set new value range! 😎");
    },
    setCurrentlySelectedSegment(state, action) {
      const id = action.payload;
      const index = state.annotations.findIndex(
        (anno) => anno.segmentID === id
      );
      state.currentlySelectedSegment = id;
      state.currentlySelectedSegmentArrayIndex = index;
    },
    setRadioValue(state, action) {
      const option = action.payload;
      state.annotations[state.currentlySelectedSegmentArrayIndex].radio =
        option;
      console.log("updated radio 🔥");
    },
    setComment(state, action) {
      const comment = action.payload;
      state.annotations[state.currentlySelectedSegmentArrayIndex].comments =
        comment;
    },
    addAnnotation(state, action) {
      const data = action.payload;
      const annotation = {
        segmentID: data.segmentID,
        timeStartSec: data.timeStartSec,
        timeEndSec: data.timeEndSec,
        categoryName: data.categoryName,
        radio: null,
        comments: null,
      };
      state.annotations.push(annotation);
    },
  },
});

export const annotationActions = annotationSlice.actions;

export default annotationSlice;
