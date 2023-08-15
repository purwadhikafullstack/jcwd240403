import React from "react";
import { classNames } from "../../../shared/utils";
import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";

function NavigationItem({ item }) {
  const { pathname } = useLocation();
  return (
    <li key={item.name}>
      {!item.children ? (
        <Link
          to={item.href}
          className={classNames(
            item.current ? "bg-gray-50" : "hover:bg-gray-50",
            item.href === pathname ? "bg-gray-50 text-primary" : "",
            "group flex gap-x-3 rounded-md p-2 text-sm w-full leading-6 font-semibold text-white hover:text-primary"
          )}
        >
          <item.icon
            className="h-6 w-6 shrink-0 text-white group-hover:text-primary"
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ) : (
        <Disclosure defaultOpen as="div">
          {({ open }) => (
            <>
              <Disclosure.Button
                as="a"
                className={classNames(
                  item.current ? "bg-gray-50" : "hover:bg-gray-50",
                  "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-primary"
                )}
              >
                <item.icon
                  className="h-6 w-6 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {item.name}
                <ChevronRightIcon
                  className={classNames(
                    open ? "rotate-90 text-gray-500" : "text-gray-400",
                    "ml-auto h-5 w-5 shrink-0"
                  )}
                  aria-hidden="true"
                />
              </Disclosure.Button>
              <Disclosure.Panel as="ul" className="mt-3 space-y-2 px-2">
                {item.children.map((subItem) => (
                  <li key={subItem.name}>
                    {/* 44px */}
                    <Link
                      to={subItem.href}
                      className={classNames(
                        subItem.current ? "bg-gray-50" : "hover:bg-gray-50",
                        subItem.href === pathname
                          ? "bg-gray-50 text-primary"
                          : "text-white",
                        "block rounded-md py-2 pr-2 pl-9 text-sm leading-6  hover:text-primary"
                      )}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      )}
    </li>
  );
}

export default NavigationItem;
