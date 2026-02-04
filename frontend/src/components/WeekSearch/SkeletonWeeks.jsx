const SkeletonWeeks = () => {
  return (
    <div className="weeks-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="week-card"
          style={{ height: "140px", cursor: "default" }}
        >
          <div className="skeleton-title" style={{ width: "40%" }}></div>
          <div className="skeleton-line" style={{ marginTop: "20px" }}></div>
          <div className="skeleton-line short"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonWeeks;
