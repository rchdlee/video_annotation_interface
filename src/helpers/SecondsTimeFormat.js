export const secondsToMinAndSecDecimal = (timeSec) => {
  const minutes = Math.floor(timeSec / 60);
  const seconds = Math.trunc(timeSec - minutes * 60);
  const decimal = (timeSec - minutes * 60 - seconds).toFixed(2);

  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  const finalTime =
    str_pad_left(minutes, "", 2) +
    ":" +
    str_pad_left(seconds, "0", 2) +
    "." +
    str_pad_left(decimal, "0", 2);

  return finalTime;
};

export const secondsToMinAndSec = (timeSec) => {
  const minutes = Math.floor(timeSec / 60);
  const seconds = Math.trunc(timeSec - minutes * 60);

  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  const finalTime =
    str_pad_left(minutes, "", 2) + ":" + str_pad_left(seconds, "0", 2);

  return finalTime;
};
