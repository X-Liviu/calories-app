import { useState } from "react";
import { useSelector } from "react-redux";

const GlobalError = () => {
  let error = useSelector((state) => state.globalError);
  const [localError, setError] = useState(error);

  setTimeout(() => {
    setError(null);
  }, 5000);
  return (
    <header className={`global-error ${localError?.type}`}>
      {localError?.message}
    </header>
  );
};

export default GlobalError;
