import Slider, { Handle } from "rc-slider";
import "rc-slider/assets/index.css";
import Timetick from "../media/Timetick";
import classes from "./MiniTimeline4.module.css";

const MiniTimeline4 = (props) => {
  const sliderChangeHandler = (e) => {
    props.onSliderChange(parseFloat(e));
  };

  const mouseDownHandler = () => {
    props.onMouseDown();
  };

  const mouseUpHandler = (e) => {
    props.onMouseUp(parseFloat(e));
  };

  return (
    <div>
      <Slider
        className={classes["slider"]}
        min={0}
        max={0.999}
        step={0.001}
        value={props.playedFrac}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onChange={sliderChangeHandler}
        trackStyle={{ display: "none" }}
        railStyle={{ display: "none" }}
        handleStyle={{ border: "2px solid white", boxShadow: "none" }}
        handle={(handleProps) => {
          return (
            <Handle {...handleProps}>
              <Timetick />
            </Handle>
          );
        }}
      />
    </div>
  );
};

export default MiniTimeline4;
