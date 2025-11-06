import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <img src="/this-is-fine-404.gif" alt="This is fine meme for 404" />
      <Link to="/">Go back home</Link>
    </div>
  );
};

export default NotFound;
