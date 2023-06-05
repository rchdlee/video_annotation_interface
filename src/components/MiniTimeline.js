import { useState, useEffect, useRef } from "react";
import classes from "./MiniTimeline.module.css";

const MiniTimeline = (props) => {
  // REMAKE WITH INPUT slider COMPONENT

  const miniTimelineRef = useRef();
  // const seeking = props.seeking;
  const timelineWidth = props.width;
  const [seeking, setSeeking] = useState(false);

  const [miniTimelineX, setMiniTimelineX] = useState(0);
  const [mousePosX, setMousePosX] = useState(0);

  const playedFrac = props.playedFrac;
  const timelineFrac = (mousePosX - miniTimelineX) / timelineWidth;

  const leftFromMiniTimeline = mousePosX - miniTimelineX;

  const leftPxTest = seeking
    ? leftFromMiniTimeline
    : playedFrac * timelineWidth;

  // position of mini-timeline (x)
  const calculatePosition = () => {
    const x = miniTimelineRef.current.offsetLeft;
    console.log(x, "🤗🙂");
    setMiniTimelineX(x);
  };
  useEffect(() => {
    calculatePosition();
  }, []);
  useEffect(() => {
    window.addEventListener("resize", calculatePosition);
  }, []);
  //

  const mouseDownHandler = () => {
    // props.setSeekingTrue();
    setSeeking(true);
    console.log("clicked down!");
  };

  // const mouseUpHandler = () => {
  //   console.log("let go of click");
  //   props.handleSeek(timelineFrac);
  //   // props.setSeekingFalse();
  //   setSeeking(false);
  // };

  // const handleMouseMove = (e) => {
  //   setMousePosX(e.clientX);
  //   if (seeking) {
  //     props.handleSeek(timelineFrac);
  //   }
  // };

  const handleTimelineClick = () => {
    props.handleSeek(timelineFrac);
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosX(event.clientX);
      if (seeking) {
        // props.handleSeek(timelineFrac);
        props.updatePlayedFrac(timelineFrac);
        console.log("updating played frac 🐱");
      }
      // props.updatePlayedFrac(timelineFrac);
      // console.log("updating played frac 🐱");
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      console.log("let go of click");
      console.log(timelineFrac, "😡");
      props.handleSeek(timelineFrac);
      // props.setSeekingFalse();
      setSeeking(false);
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className={classes["container"]}
      // onMouseUp={mouseUpHandler}
      // onMouseMove={handleMouseMove}
    >
      <div
        className={classes["mini-timeline"]}
        ref={miniTimelineRef}
        // onMouseMove={handleMouseMove}
        onClick={handleTimelineClick}
        // onMouseOut={handleMouseOut}
      >
        <div
          className={classes["time-dot"]}
          style={{ left: `${leftPxTest}px` }}
          onMouseDown={mouseDownHandler}
        ></div>
      </div>
      <div>mouse pos x: {mousePosX}</div>
      <div>left from minitimeline: {leftFromMiniTimeline}</div>
    </div>
  );
};

export default MiniTimeline;
