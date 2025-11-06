import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
  const itemLinks = useSelector((state) => state.itemLinks);

  if (itemLinks.length === 1) {
    return (
      <nav>
        <Link to={itemLinks[0].URL}>{itemLinks[0].name}</Link>
      </nav>
    );
  } else if (itemLinks.length > 1)
    return (
      <nav>
        {itemLinks.map((item, index) => {
          return (
            <Link key={item.name} to={item.URL}>
              {item.name}
              {index < itemLinks.length - 1 && " > "}
            </Link>
          );
        })}
      </nav>
    );
};

export default Breadcrumb;
