const Home = () => {
  return (
    <main className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>TrackBites</h1>
          <p className="hero-subtitle">
            Your journey to a healthier lifestyle starts with a single bite.
          </p>

          <div className="hero-image-wrapper">
            <img src="/jayCutler.gif" alt="Jay Cutler Training" />
            {/* Opcional: Un overlay o borde aquí si quisieras */}
          </div>

          <div className="hero-description">
            <p>
              Welcome to <strong>TrackBites</strong>! With this app, you can
              easily monitor and manage your{" "}
              <strong>daily calorie intake</strong>.
            </p>
            <p>
              Log meals, track nutritional goals, and get insights into your
              eating habits to stay on top of your health and fitness journey.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
