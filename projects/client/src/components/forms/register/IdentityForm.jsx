import { PhotoIcon } from "@heroicons/react/24/solid";
import React from "react";

function IdentityForm({ isHidden }) {
  return (
    <div
      className={
        isHidden
          ? "hidden"
          : "flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-5"
      }
    >
      <div className="text-center">
        <PhotoIcon
          className="mx-auto h-10 w-10 text-gray-300"
          aria-hidden="true"
        />
        <div className="flex text-sm leading-6 text-gray-600">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
          >
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs leading-5 text-gray-600">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </div>
  );
}

export default IdentityForm;
