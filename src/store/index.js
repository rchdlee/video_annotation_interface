import { configureStore } from "@reduxjs/toolkit";

import annotationSlice from "./annotation-slice";

const store = configureStore({
  reducer: { annotation: annotationSlice.reducer },
});

export default store;