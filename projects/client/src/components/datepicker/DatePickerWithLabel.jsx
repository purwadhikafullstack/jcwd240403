import { useFormikContext } from "formik";
import React from "react";

function DatePickerWithLabel({ field, label, ...props }) {
  const { errors } = props.form;
  const { setFieldValue } = useFormikContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };

  return (
    <div className="space-y-1 flex flex-col gap-y-1">
      <label className="text-sm">{label}</label>
      <input
        type="date"
        name={field.name}
        value={field.value}
        onChange={handleChange}
        {...props}
        className="rounded border border-gray-300 focus:border-primary focus:ring-0 p-1 px-1.5"
      />
      {/* error message from formik */}
      {errors[field.name] && (
        <p className="text-red-500 text-xs">{errors[field.name]}</p>
      )}
    </div>
  );
}

export default DatePickerWithLabel;
