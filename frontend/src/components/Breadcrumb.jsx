import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
  const itemLinks = useSelector((state) => state.itemLinks);

  if (itemLinks.length === 1) {
    return (
      <div>
        <Link style={{ paddingRight: 5, color: "white" }} to={itemLinks[0].URL}>
          {itemLinks[0].name}
        </Link>
      </div>
    );
  } else if (itemLinks.length > 1)
    return (
      <div>
        {itemLinks.map((item, index) => {
          return (
            <Link
              style={{ paddingRight: 5, color: "white" }}
              key={item.name}
              to={item.URL}
            >
              {item.name}
              {index < itemLinks.length - 1 && " >"}
            </Link>
          );
        })}
      </div>
    );
};

export default Breadcrumb;
