const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="error-message" style={{ color: "red", fontSize: "0.9rem" }}>
      {message}
    </p>
  );
};

export default ErrorMessage;
