import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { classNames } from "../../shared/utils";

function ButtonSubMenu({ tab }) {
  const { propertyId } = useParams();
  const { pathname } = useLocation();
  const isActive = (href) => {
    const match = pathname.match(/(\/[a-z]+\/\d+)(\/.*)/)[2];
    return match === href;
  };

  return (
    <Link
      to={`/property/${propertyId}${tab.href}`}
      key={tab.name}
      className={classNames(
        isActive(tab.href)
          ? "border-primary text-primary"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
        "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium shrink-0"
      )}
      aria-current={tab.current ? "page" : undefined}
    >
      <tab.icon
        className={classNames(
          isActive(tab.href)
            ? "text-primary"
            : "text-gray-400 group-hover:text-gray-500",
          "-ml-0.5 mr-2 h-5 w-5"
        )}
        aria-hidden="true"
      />
      <span>{tab.name}</span>
    </Link>
  );
}

export default ButtonSubMenu;
