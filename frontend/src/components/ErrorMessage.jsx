const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <p className="error">{message}</p>;
};

export default ErrorMessage;
