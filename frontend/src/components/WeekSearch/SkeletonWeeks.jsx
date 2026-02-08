const SkeletonWeeks = () => {
  return (
    <div className="weeks-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="week-card skeleton-week-card">
          <div className="skeleton-title skeleton-pulse"></div>
          <div className="skeleton-line spacer skeleton-pulse"></div>
          <div className="skeleton-line short skeleton-pulse"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonWeeks;
