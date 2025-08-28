import { useImperativeHandle, forwardRef, useState } from "react";

const Toggable = forwardRef(({ children, buttonLabel }, ref) => {
  const [visible, setVisible] = useState(false);
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => toggleVisibility); //Simplemente para repasar lo aprendido en fullstackopen, aunque no lo use.

  return (
    <div>
      <div style={hideWhenVisible}>
        <button type="button" onClick={toggleVisibility}>
          {buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <br />
        <button type="button" onClick={toggleVisibility}>
          Cancel
        </button>
      </div>
    </div>
  );
});

export default Toggable;
