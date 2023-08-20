import { useState } from "react";
import "./TextInput.css";

const TextInput = (props) => {
  // General Styles
  const styles = {
    container: { color: "#4B4B4B" },
    containerInput: {
      display: "flex",
      height: "40px",
      alignItems: "center",
      maxWidth: "297px",
      width: "100%",
      background: "#FFFFFF",
      borderRadius: "8px",
    },
    normalStyle: { border: "1px solid #646B70" },
    disableStyle: { opacity: "0.45" },
    focusStyle: {
      border: "1px solid #00B5AE",
      boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
    },
    iconLeft: {
      marginLeft: 16,
      display: props.iconLeft ? "flex" : "none",
      cursor: "pointer",
      userSelect: "none",
    },
    iconsRight: {
      marginRight: 16,
      display: props.iconRight ? "flex" : "none",
      cursor: "pointer",
      userSelect: "none",
    },
    input: {
      outline: "none",
      border: "none",
      width: "100%",
      height: "100%",
      marginLeft: props.iconLeft ? "8px" : "16px",
      marginRight: props.iconLeft ? "8px" : "16px",
      background: "transparent",
      // placeholder font
      fontSize: 14,
      fontWeight: 400,
      color: "#646B70",
      display: 'flex',
    },
    H7: { color: "inherit" },
  };

  // Including general styles to specific styles
  Object.assign(styles.normalStyle, styles.containerInput);
  Object.assign(styles.focusStyle, styles.containerInput);
  Object.assign(styles.disableStyle, styles.container);

  // Setting the specific styles of the component according to sent props
  Object.assign(styles.container, props.containerStyle);
  Object.assign(styles.normalStyle, props.style);
  Object.assign(styles.focusStyle, props.focusStyle);
  Object.assign(styles.disableStyle, props.disableStyle);

  const isDisabled = props.disable ? styles.disableStyle : styles.container;

  const [style, setStyle] = useState(styles.normalStyle);

  const onFocus = () => setStyle(styles.focusStyle);
  const onBlur = () => setStyle(styles.normalStyle);

  return (
    <div style={isDisabled}>
      <p style={styles.H7}>{props.label}</p>
      <div style={style}>
        <div style={styles.iconLeft}>{props.iconLeft}</div>
        <input
          type={props.type ? props.type : "text"}
          name={props.name}
          defaultValue={props.value}
          style={styles.input}
          placeholder={props.placeholder ? props.placeholder : "Seleccione..."}
          maxLength={props.maxLength ? props.maxLength : 60}
          pattern={props.pattern ? props.pattern : null}
          onChange={props.onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={props.disable}
        />
        <div style={styles.iconsRight}>{props.iconRight}</div>
      </div>
    </div>
  );
};

export default TextInput;
