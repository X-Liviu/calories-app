import { useImperativeHandle, forwardRef, useState } from "react";

const Toggable = forwardRef(({ children, buttonLabel }, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div className="toggable-wrapper">
      {!visible && (
        <button
          type="button"
          onClick={toggleVisibility}
          className="btn btn-primary"
        >
          {buttonLabel}
        </button>
      )}

      {visible && (
        <div className="toggable-content fade-in">
          {children}

          <div className="toggable-actions">
            <button
              type="button"
              onClick={toggleVisibility}
              className="btn btn-secondary"
              style={{ width: "100%" }} // Opcional: Para que tenga el ancho del input
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Toggable;
