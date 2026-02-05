import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.user);
  const isLoggedIn = user && user.token;

  return (
    <div className="landing-container">
      {/* Elementos decorativos de fondo (Blobs) */}
      <div className="decorative-blob blob-1"></div>
      <div className="decorative-blob blob-2"></div>

      {/* --- HERO SECTION --- */}
      <section className="landing-hero">
        {/* Columna Izquierda: Texto */}
        <div className="hero-text-content">
          <h1 className="hero-title">
            Master your health, <br />
            <span className="text-gradient">one bite at a time.</span>
          </h1>

          <p className="hero-subtitle-modern">
            TrackBites helps you monitor daily calories, log meals, and achieve
            your fitness goals with a simple and intuitive interface. No complex
            spreadsheets, just results.
          </p>

          <div className="hero-cta-group">
            {isLoggedIn ? (
              <Link to="/weeks" className="btn btn-primary btn-lg">
                Go to your Weeks
              </Link>
            ) : (
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start for Free
              </Link>
            )}

            {!isLoggedIn && (
              <Link to="/login" className="btn btn-secondary btn-lg">
                Log In
              </Link>
            )}
          </div>
        </div>

        {/* Columna Derecha: Imagen/GIF */}
        <div className="hero-visuals">
          <div className="hero-image-frame">
            <img src="/jayCutler.gif" alt="Training Motivation" />
          </div>

          {/* Tarjeta flotante superpuesta */}
          <div className="floating-card">
            <div className="floating-icon">🔥</div>
            <div className="floating-text">
              <span>Calories Eaten</span>
              <strong>2347.5 kcal</strong>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="features-section">
        <h2 className="features-title">Why TrackBites?</h2>

        <p className="text-muted">Everything you need to stay on track.</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🥑</div>
            <h3>Smart Logging</h3>
            <p>
              Easily add meals from our catalog or create your own custom
              aliments in seconds.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Weekly Insights</h3>
            <p>
              Visualize your calorie intake across weeks and adjust your diet
              for maximum performance.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Simple & Intuitive</h3>
            <p>No clutter, no ads, just the tools you need to succeed.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
