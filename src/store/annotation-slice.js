import { createSlice } from "@reduxjs/toolkit";

const annotationSlice = createSlice({
  name: "annotations",
  initialState: {
    inputData: null,
    annotations: [],
    currentlySelectedSegment: null,
    timelineValueRange: null,
    zoom: 1,
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
    zoomIn(state) {
      state.zoom = state.zoom + 0.5;
    },
    zoomOut(state) {
      state.zoom = state.zoom - 0.5;
    },
  },
});

export const annotationActions = annotationSlice.actions;

export default annotationSlice;
