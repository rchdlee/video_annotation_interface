const Timebar = (props) => {
  // regular height (big screen): 305
  let height = 255;

  if (props.screenWidth >= 992 && props.screenWidth < 1200) {
    height = 255;
  }
  if (props.screenWidth >= 1200) {
    height = 280;
    // height = 255;
  }

  const viewBox = `0 0 12 ${height}`;

  return (
    <svg
      width="12"
      height={height}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 10V310" stroke="#DF4545" strokeWidth="2" />
      <path
        d="M11 1H1V7L6 11L11 7.5V1Z"
        fill="#DF4545"
        stroke="#DF4545"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Timebar;
