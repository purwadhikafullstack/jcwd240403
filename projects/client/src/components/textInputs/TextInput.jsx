import React from "react";
import { useState } from "react";

const TextInput = ({
  label,
  required,
  disabled,
  type,
  placeholder,
  error,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium capitalize">{label}</label>
      <div className="flex flex-row">
        <input
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 ${className}`}
          disabled={disabled}
          pattern="[0-9]*"
          required={required}
        />
        {type === "password" && (
          <button
            type="button"
            className="px-4 py-2 text-sm text-gray-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};

TextInput.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  showPassword: false,
};

export default TextInput;
