import React from "react";

function Button({ label, className }) {
  return (
    <button
      type="button"
      className={`block capitalize rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${className}`}
    >
      {label}
    </button>
  );
}

Button.defaultProps = {
  label: "label",
};

export default Button;
