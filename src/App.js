import { useState, useEffect, useRef } from "react";
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
  const numberOfTicks = 9;
  const windowTime = videoState.duration / zoom;
  const windowNumber = Math.trunc(videoState.playedSec / windowTime) + 1;
  const tickInterval = windowTime / numberOfTicks;

  const miniTimelineTicks = [];
  const timelineTicks = [];

  if (videoState.duration !== 0) {
    for (let i = 0; i <= numberOfTicks; i++) {
      miniTimelineTicks.push(0 + (videoState.duration / numberOfTicks) * i);
    }
  }

  for (let i = 0; i <= numberOfTicks; i++) {
    timelineTicks.push(windowTime * (windowNumber - 1) + i * tickInterval);
  }

  const timelineValueRange = [timelineTicks[0], timelineTicks[numberOfTicks]];

  // console.log(miniTimelineTicks, timelineTicks, timelineValueRange, "🅱");

  const zoomOutHandler = () => {
    if (zoom > 1) {
      setZoom((prevState) => prevState - 0.5);
    }
  };

  const zoomInHandler = () => {
    setZoom((prevState) => prevState + 0.5);
  };

  const resetZoomHandler = () => {
    setZoom(1);
  };
  //

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

  const handleSeekingTrue = () => {
    setVideoState((prevState) => ({
      ...prevState,
      seeking: true,
    }));
  };
  const handleSeekingFalse = () => {
    setVideoState((prevState) => ({
      ...prevState,
      seeking: false,
    }));
  };

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
        <SelectedAnnotation />
      </div>
      <div className={classes["bottom-container"]}>
        <Annotations
          timelineTicks={timelineTicks}
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
        />
      </div>
    </div>
  );
}

export default App;
