import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import ReactPlayer from "react-player";
// import "./App.css";
import classes from "./App.module.css";

import MiniTimeline from "./components/MiniTimeline";
import SelectedAnnotation from "./components/SelectedAnnotation";
import PlayerControls from "./components/PlayerControls";
import MiniTimeline2 from "./components/MiniTimeline2";

import clip from "./media/lexclip.mp4";
import inputData from "./media/input.json";
import { annotationActions } from "./store/annotation-slice";
import Annotations from "./components/Annotations";
import MiniTimeline3 from "./components/MiniTimeline3";
import MiniTimeline4 from "./components/MiniTimeline4";
import { current } from "@reduxjs/toolkit";

function App() {
  const playerRef = useRef(null);
  const dispatch = useDispatch();

  const screenWidth = window.innerWidth;
  const playerWidth = 0.4 * screenWidth;

  // video data from input.json

  // dispatch(annotationActions.setVideoInputData(inputData));

  useEffect(() => {
    dispatch(annotationActions.setVideoInputData(inputData));
    console.log("useeffect: set redux input data");
    // const categories = inputData.channels.map((channel) => {
    //   return channel.name;
    // });
    // console.log(inputData, categories);
  }, []);
  //

  // video state
  const [videoState, setVideoState] = useState({
    playing: false,
    playedFrac: 0,
    playedSec: 0,
    seeking: false,
    duration: 0,
    playbackSpeed: 1,
  });

  // timeline
  const [zoom, setZoom] = useState(1);
  const zoomIncrement = 1;
  const numberOfTicks = 9;
  const windowTime = videoState.duration / zoom;
  const initialTickInterval = videoState.duration / numberOfTicks;
  const tickInterval = windowTime / numberOfTicks;

  //  DELETED WINDOWNUMBER
  const windowNumber = Math.trunc(videoState.playedSec / windowTime) + 1;

  const miniTimelineTicks = [];
  const initialTimelineTicks = [];
  // const zoomTimelineTicks = [];
  const [zoomTimelineTicks, setZoomTimelineTicks] = useState([]);

  const timelineTicks = zoom === 1 ? initialTimelineTicks : zoomTimelineTicks;

  if (videoState.duration !== 0) {
    for (let i = 0; i <= numberOfTicks; i++) {
      miniTimelineTicks.push(0 + (videoState.duration / numberOfTicks) * i);
    }
  }

  for (let i = 0; i <= numberOfTicks; i++) {
    initialTimelineTicks.push(i * initialTickInterval);
  }

  console.log(
    timelineTicks[0],
    timelineTicks[numberOfTicks],
    timelineTicks,
    "🍜"
  );

  const calculateZoomTimelineTicks = (method, offset) => {
    let tickIntervalTest;
    // let offset;
    switch (method) {
      case "zoomin":
        tickIntervalTest =
          videoState.duration / ((zoom + zoomIncrement) * numberOfTicks);
        break;
      case "zoomout":
        tickIntervalTest =
          videoState.duration / ((zoom - zoomIncrement) * numberOfTicks);
        break;
      case "recalculate":
        tickIntervalTest = videoState.duration / (zoom * numberOfTicks);
        break;
    }

    // switch (method) {
    //   case "zoomin":
    //   case "zoomout":
    //     offset = -4;
    //     break;
    //   case "recalculate":
    //     offset = -1;
    //     break;
    // }

    // console.log(tickIntervalTest, "🌭");

    // const tickIntervalTest =
    //   videoState.duration / ((zoom + zoomIncrement) * numberOfTicks);

    const zoomTimelineTicksTest = [];
    const initialTime = videoState.playedSec - 4 * tickIntervalTest;
    const finalTime = videoState.playedSec + 5 * tickIntervalTest;
    // console.log(
    //   "recalculating timeline ticks 🧃",
    //   videoState.playedSec,
    //   initialTime,
    //   finalTime
    // );

    if (initialTime < 0) {
      console.log("calculate zoom IN set initial as 0");
      for (let i = 0; i <= numberOfTicks; i++) {
        zoomTimelineTicksTest.push(
          // (i * videoState.duration) / ((zoom + zoomIncrement) * numberOfTicks)
          i * tickIntervalTest
        );
      }
      console.log(zoomTimelineTicksTest);
      setZoomTimelineTicks(zoomTimelineTicksTest);
    }
    if (finalTime > videoState.duration) {
      console.log("calculate zoom IN set max value as video duration");

      for (let i = 0; i <= numberOfTicks; i++) {
        zoomTimelineTicksTest.push(
          // ((i - numberOfTicks) * videoState.duration) /
          //   ((zoom + zoomIncrement) * numberOfTicks) +
          //   videoState.duration

          (i - numberOfTicks) * tickIntervalTest + videoState.duration
        );
        setZoomTimelineTicks(zoomTimelineTicksTest);
      }
    }
    if (initialTime > 0 && finalTime < videoState.duration) {
      console.log("calculate zoom IN as normal");

      for (let i = 0; i <= numberOfTicks; i++) {
        zoomTimelineTicksTest.push(
          // videoState.playedSec + (i - 4) * tickIntervalTest
          videoState.playedSec + (i - offset) * tickIntervalTest
        );
      }
      setZoomTimelineTicks(zoomTimelineTicksTest);
    }
  };

  if (zoom > 1 && videoState.playedSec > timelineTicks[numberOfTicks] - 1) {
    calculateZoomTimelineTicks("recalculate", 7);
  }

  if (
    zoom > 1 &&
    videoState.playedSec > 0 &&
    videoState.playedSec < timelineTicks[0] + 1
  ) {
    console.log("recalculating to prev 🥟");
    calculateZoomTimelineTicks("recalculate", 2);
  }

  const timelineValueRange = [timelineTicks[0], timelineTicks[numberOfTicks]];

  // console.log(miniTimelineTicks, timelineTicks, timelineValueRange, "🅱");
  // console.log(
  //   initialTickInterval,
  //   windowTime,
  //   tickInterval,
  //   initialTimelineTicks,
  //   zoomTimelineTicks,
  //   timelineTicks,
  //   "🍣"
  // );

  // Handlers
  const zoomOutHandler = () => {
    if (zoom > 1) {
      setZoom((prevState) => prevState - zoomIncrement);
      // calculateZoomOutTimelineTicks();
      calculateZoomTimelineTicks("zoomout", 4);
    }
  };

  const zoomInHandler = () => {
    setZoom((prevState) => prevState + zoomIncrement);
    // calculateZoomInTimelineTicks();
    calculateZoomTimelineTicks("zoomin", 4);
  };

  const resetZoomHandler = () => {
    setZoom(1);
  };
  //

  // selected segment border
  const [currentlySelectedSegment, setCurrentlySelectedSegment] =
    useState(null);

  const escFunction = () => {
    console.log("esc func 🤑");
    setCurrentlySelectedSegment(null);
    dispatch(annotationActions.setCurrentlySelectedSegment(null));
  };

  const escFunctionWithKey = useCallback((e) => {
    if (e.key === "Escape") {
      escFunction();
    }
  });

  useEffect(() => {
    document.addEventListener("keydown", escFunctionWithKey, false);

    return () => {
      document.removeEventListener("keydown", escFunctionWithKey, false);
    };
  }, [escFunctionWithKey]);

  const handleProgress = (state) => {
    const { loaded, loadedSeconds, played, playedSeconds } = state;

    // setVideoState((prevState) => ({
    //   ...prevState,
    //   playedFrac: played,
    //   playedSec: playedSeconds,
    // }));

    if (!videoState.seeking) {
      setVideoState((prevState) => ({
        ...prevState,
        playedFrac: played,
        playedSec: playedSeconds,
      }));
    }
  };

  const setVideoDuration = () => {
    setVideoState((prevState) => ({
      ...prevState,
      duration: playerRef.current.getDuration(),
    }));
    console.log("set video duration 😐😐😐😐😐😐😐");
  };
  //

  // Controls
  const playPauseHandler = () => {
    setVideoState((prevState) => ({
      ...prevState,
      playing: !prevState.playing,
    }));
  };

  const handleSeek = (newTime) => {
    playerRef.current.seekTo(newTime);
  };

  const playHandler = () => {
    setVideoState((prevState) => ({
      ...prevState,
      playing: true,
    }));
  };

  const pauseHandler = () => {
    setVideoState((prevState) => ({
      ...prevState,
      playing: false,
    }));
  };

  // const handleSeekingTrue = () => {
  //   setVideoState((prevState) => ({
  //     ...prevState,
  //     seeking: true,
  //   }));
  // };
  // const handleSeekingFalse = () => {
  //   setVideoState((prevState) => ({
  //     ...prevState,
  //     seeking: false,
  //   }));
  // };

  // slider 2
  const updatePlayedFrac = (frac) => {
    setVideoState((prevState) => ({
      ...prevState,
      playedFrac: frac,
    }));

    playerRef.current.seekTo(frac);
  };

  const handleMouseDown = () => {
    setVideoState((prevState) => ({
      ...prevState,
      seeking: true,
    }));
  };

  const handleMouseUp = (value) => {
    setVideoState((prevState) => ({
      ...prevState,
      seeking: false,
    }));

    playerRef.current.seekTo(value);
  };
  //

  /////////////////////////
  // minitimeline 3

  // move state stuff to this app parent component to prevent rerender cycle?
  // const [isHoveringHandle, setIsHoveringHandle] = useState(false);
  // const [miniTimelineXPos, setMiniTimelineXPos] = useState(0);
  // const [mousePosX, setMousePosX] = useState(0);

  /////////////////////////

  return (
    <div className={classes["app-container"]}>
      <div className={classes["upper-container"]}>
        <div className={classes["video-container"]}>
          <ReactPlayer
            ref={playerRef}
            url={clip}
            width={playerWidth}
            height={(playerWidth * 720) / 1280}
            playing={videoState.playing}
            onProgress={handleProgress}
            onReady={setVideoDuration}
            // controls={true}
            progressInterval={500}
          />
          {/* <MiniTimeline
            playedFrac={videoState.playedFrac}
            width={playerWidth}
            seeking={videoState.seeking}
            setSeekingTrue={handleSeekingTrue}
            setSeekingFalse={handleSeekingFalse}
            handleSeek={handleSeek}
            updatePlayedFrac={updatePlayedFrac}
          /> */}
          <MiniTimeline2
            playedFrac={videoState.playedFrac}
            onSliderChange={updatePlayedFrac}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            duration={videoState.duration}
            miniTimelineTicks={miniTimelineTicks}
            timelineValueRange={timelineValueRange}
            zoomLevel={zoom}
          />
          {/* <MiniTimeline3
            width={playerWidth}
            playedFrac={videoState.playedFrac}
            updatePlayedFrac={updatePlayedFrac}
            isHoveringHandle={isHoveringHandle}
            setIsHoveringHandle={setIsHoveringHandle}
            miniTimelineXPos={miniTimelineXPos}
            setMiniTimelineXPos={setMiniTimelineXPos}
            mousePosX={mousePosX}
            setMousePosX={setMousePosX}
            handleSeekingTrue={handleSeekingTrue}
            handleSeekingFalse={handleSeekingFalse}
            seeking={videoState.seeking}
          /> */}
          {/* <MiniTimeline4
            playedFrac={videoState.playedFrac}
            onSliderChange={updatePlayedFrac}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            duration={videoState.duration}
            miniTimelineTicks={miniTimelineTicks}
            timelineValueRange={timelineValueRange}
            zoomLevel={zoom}
          /> */}
          <PlayerControls
            onPlayPauseClick={playPauseHandler}
            playing={videoState.playing}
            duration={videoState.duration}
            playedSec={videoState.playedSec}
            playedFrac={videoState.playedFrac}
          />
        </div>
        <SelectedAnnotation
          deselect={escFunction}
          currentlySelectedSegment={currentlySelectedSegment}
          duration={videoState.duration}
          seekTo={handleSeek}
          play={playHandler}
          pause={pauseHandler}
        />
      </div>
      <div className={classes["bottom-container"]}>
        <Annotations
          timelineTicks={timelineTicks}
          numberOfTicks={numberOfTicks}
          windowNumber={windowNumber}
          windowTime={windowTime}
          zoomLevel={zoom}
          zoomIn={zoomInHandler}
          zoomOut={zoomOutHandler}
          resetZoom={resetZoomHandler}
          duration={videoState.duration}
          playedFrac={videoState.playedFrac}
          timelineValueRange={timelineValueRange}
          onSliderChange={updatePlayedFrac}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          seekTo={handleSeek}
          currentlySelectedSegment={currentlySelectedSegment}
          setCurrentlySelectedSegment={setCurrentlySelectedSegment}
        />
      </div>
    </div>
  );
}

export default App;
