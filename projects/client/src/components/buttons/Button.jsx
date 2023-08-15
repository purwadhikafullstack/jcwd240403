import React from "react";
import { classNames } from "../../shared/utils";

function Button({ label, className, ...props }) {
  return (
    <button
      type="submit"
      {...props}
      className={classNames(
        "flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className
      )}
    >
      {label}
    </button>
  );
}

Button.defaultProps = {
  label: "label",
};

export default Button;
