import { useSelector } from "react-redux";

import playIcon from "../media/icons/play-solid.svg";
import pauseIcon from "../media/icons/pause-solid.svg";
import backIcon from "../media/icons/backward-step-solid.svg";
import backFastIcon from "../media/icons/backward-fast-solid.svg";
import forwardIcon from "../media/icons/forward-step-solid.svg";
import forwardFastIcon from "../media/icons/forward-fast-solid.svg";

import {
  secondsToMinAndSec,
  secondsToMinAndSecDecimal,
} from "../helpers/SecondsTimeFormat";

import classes from "../styles/PlayerControls.module.css";

const PlayerControls = (props) => {
  const fps = useSelector((state) => state.annotation.inputData?.fps);

  const videoTimeInfo = `${secondsToMinAndSecDecimal(
    props.playedSec
  )} / ${secondsToMinAndSecDecimal(props.duration)}`;

  return (
    <div className={classes["controls"]}>
      <div className={classes["icon-div"]}>
        <img src={backFastIcon} alt="" />
      </div>
      <div className={classes["icon-div"]}>
        <img src={backIcon} alt="" />
      </div>
      {props.playing ? (
        <div className={classes["icon-div"]}>
          <img onClick={props.onPlayPauseClick} src={pauseIcon} alt="" />
        </div>
      ) : (
        <div className={classes["icon-div"]}>
          <img onClick={props.onPlayPauseClick} src={playIcon} alt="" />
        </div>
      )}
      <div className={classes["icon-div"]}>
        <img src={forwardIcon} alt="" />
      </div>
      <div className={classes["icon-div"]}>
        <img src={forwardFastIcon} alt="" />
      </div>
      <div className={classes["video-info"]}>
        <p style={{ fontSize: "12px", marginBottom: "2px" }}>{fps} FPS</p>
        <p>{videoTimeInfo}</p>
      </div>
    </div>
  );
};

export default PlayerControls;
