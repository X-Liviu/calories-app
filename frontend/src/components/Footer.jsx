import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Columna 1: Marca y Propósito */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            TrackBites
          </Link>
          <p className="footer-tagline">
            Master your health, one bite at a time.
            <br />
            Built for educational purposes with{" "}
            <a
              href="https://fullstackopen.com/en/"
              target="_blank"
              rel="noopener noreferrer"
            >
              fullstackopen.com
            </a>
            .
          </p>
        </div>

        {/* Columna 2: Socials */}
        <div className="footer-socials">
          <h4>Connect</h4>
          <ul>
            <li>
              <a
                href="https://www.youtube.com/@liviuuu_"
                target="_blank"
                rel="noopener noreferrer"
              >
                Youtube
              </a>
            </li>
            <li>
              <a
                href="https://github.com/X-Liviu"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a target="_blank" rel="noopener noreferrer">
                -
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>
            &copy; {currentYear} Designed & Developed by{" "}
            <strong>Liviu Deleanu</strong>.
          </p>
          <div className="tech-stack-badge">
            <span>Built with React & Redux</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
