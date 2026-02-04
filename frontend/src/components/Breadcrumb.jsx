import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
  const itemLinks = useSelector((state) => state.itemLinks);

  if (!itemLinks || itemLinks.length === 0) return null;

  return (
    <nav className="breadcrumb-nav" aria-label="breadcrumb">
      <ol className="breadcrumb-list">
        {itemLinks.map((item, index) => {
          const isLast = index === itemLinks.length - 1;

          return (
            <li key={`${item.name}-${index}`} className="breadcrumb-item">
              {isLast ? (
                <span className="breadcrumb-link active" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link to={item.URL} className="breadcrumb-link">
                    {item.name}
                  </Link>
                  <span className="breadcrumb-separator">{">"}</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
