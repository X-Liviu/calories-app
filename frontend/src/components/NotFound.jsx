import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container not-found-page">
      <div className="decorative-blob blob-corner-top"></div>
      <div className="decorative-blob blob-corner-bottom"></div>

      <div className="not-found-content">
        <div className="error-code-wrapper">
          <h1 className="error-code">404</h1>
        </div>

        <div className="error-card">
          <div className="error-image-frame">
            <img
              src="/this-is-fine-404.gif"
              alt="Meme This is Fine"
              className="error-image"
            />
          </div>

          <div className="error-text">
            <h2 className="error-title">Did you get lost?</h2>
            <p className="error-message">
              Oops! The page you are searching for does not exist.
            </p>
          </div>

          <div className="error-actions">
            <Link to="/" className="btn btn-primary">
              Go to Home
            </Link>

            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
