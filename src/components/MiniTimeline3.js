import { useState, useEffect, useRef } from "react";

import classes from "../styles/MiniTimeline3.module.css";

const MiniTimeline3 = (props) => {
  const miniTimelineRef = useRef();

  // const [isHoveringHandle, setIsHoveringHandle] = useState(false);
  // const [isSeeking, setIsSeeking] = useState(false);
  // const [miniTimelineXPos, setMiniTimelineXPos] = useState(0);
  // const [mousePosX, setMousePosX] = useState(0);

  const handleHoverHandler = () => {
    // setIsHoveringHandle(true);
    props.setIsHoveringHandle(true);
  };

  const handleUnhoverHandler = () => {
    // setIsHoveringHandle(false);
    props.setIsHoveringHandle(false);
  };

  const handleClickDownHandler = () => {
    if (props.isHoveringHandle) {
      // setIsSeeking(true);
      props.handleSeekingTrue();
    }
  };

  // useEffect(() => {
  //   const handleMouseDown = () => {
  //     if (props.isHoveringHandle) {
  //       setIsSeeking(true);
  //     }
  //   };

  //   window.addEventListener("mousedown", handleMouseDown);

  //   return () => {
  //     window.removeEventListener("mousedown", handleMouseDown);
  //   };
  // }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      // setIsSeeking(false);
      props.handleSeekingFalse();
      console.log("let go of handle");
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // useEffect(() => {
  //   const handleMouseMove = () => {
  //     console.log("moving mouse 🐭");

  //     if (isSeeking) {
  //       // props.handleSeek(timelineFrac);
  //       console.log("seeking 🐱");
  //     }
  //   };

  //   window.addEventListener("mousemove", handleMouseMove);

  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, []);

  //////////////////////////////////////////////////

  const calculatePosition = () => {
    const x = miniTimelineRef.current.offsetLeft;
    console.log(x, "🤗🙂");
    // setMiniTimelineXPos(x);
    props.setMiniTimelineXPos(x);
  };
  useEffect(() => {
    calculatePosition();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      // setMousePosX(event.clientX);
      props.setMousePosX(event.clientX);
      // if (isSeeking) {
      if (props.seeking) {
        console.log("seeking to", frac);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const xPosDifference = props.mousePosX - props.miniTimelineXPos;
  const frac = xPosDifference / props.width;

  if (props.seeking && xPosDifference > 0 && xPosDifference < props.width) {
    console.log(`seeking to ${frac}`);
    props.updatePlayedFrac(frac);
  }

  // validation for if mouse position is left or right of track: if left, set to 0; if right, set to max value

  const leftPxValue =
    props.seeking && xPosDifference > 0 && xPosDifference < props.width
      ? xPosDifference
      : props.playedFrac * props.width;

  /// test slider
  const [value, setValue] = useState(0);

  return (
    <div className={classes["container"]}>
      <div
        className={classes["track"]}
        style={{ width: `${props.width}px` }}
        ref={miniTimelineRef}
      >
        <div
          className={classes["handle"]}
          style={{ left: `${leftPxValue - 8}px` }}
          onMouseDown={handleClickDownHandler}
          onMouseEnter={handleHoverHandler}
          onMouseLeave={handleUnhoverHandler}
        ></div>
      </div>
      <p>{props.seeking ? "is seeking" : "NOT seeking"}</p>
      <p>
        {xPosDifference > 0 && xPosDifference < props.width && props.seeking
          ? `xPosDiff: ${xPosDifference}`
          : "not in range"}
      </p>
      <p>
        {xPosDifference > 0 && xPosDifference < props.width && props.seeking
          ? `frac: ${frac}`
          : "not in range"}
      </p>
    </div>
  );
};

export default MiniTimeline3;
