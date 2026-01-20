const SkeletonWeeks = () => {
  return (
    <div className="skeleton-container">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-title"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonWeeks;
