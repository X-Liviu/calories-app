const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <span className="text-error">{message}</span>;
};

export default ErrorMessage;
