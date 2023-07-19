import classes from "../styles/ErrorModal.module.css";

const ErrorModal = (props) => {
  const containerStyles = {
    top: props.hasError ? "-36px" : "-132px",
  };

  const modalCloseHandler = () => {
    props.setHasError(false);
  };

  return (
    // <div className={classes["overlay"]}>
    <div className={classes["modal-container"]} style={containerStyles}>
      <div className={classes["error-message"]}>
        <h4>ERROR</h4>
        <p>{props.errorMessage}</p>
      </div>
      <button onClick={modalCloseHandler}>x</button>
    </div>
    // </div>
  );
};
// const ErrorModal = (props) => {
//   return (
//     <div className={classes["overlay"]}>
//       <div className={classes["modal-container"]}>
//         <p>error message!</p>
//         <button>x</button>
//       </div>
//     </div>
//   );
// };

export default ErrorModal;
