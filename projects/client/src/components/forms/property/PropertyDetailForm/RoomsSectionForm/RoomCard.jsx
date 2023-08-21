import React from "react";
import FormSection from "../FormSection";
import { Field } from "formik";
import InputWithLabel from "../../../../textInputs/InputWithLabel";
import TextAreaWithLabel from "../../../../textInputs/TextAreaWithLabel";

const RoomCard = ({ room, index, errors, touched, values, setFieldValue }) => {
  return (
    <div
      key={index}
      className="space-y-2 border rounded-lg border-gray-500 p-5"
    >
      <div className="w-full justify-end items-start grow-0 flex">
        <button
          type="button"
          onClick={() => {
            const newRooms = [...values.rooms];
            newRooms.splice(index, 1);
            setFieldValue("rooms", newRooms);
          }}
          disabled={values.rooms.length <= 1}
          className="bg-accent text-white text-sm rounded-md px-2 py-1.5 w-[150px] hover:opacity-95 disabled:bg-gray-500"
        >
          Remove Room
        </button>
      </div>

      <FormSection>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col">
            <Field
              name={`rooms[${index}].name`}
              label="Name"
              placeholder="Room Name"
              component={InputWithLabel}
            />
            {errors.rooms?.[index]?.name && touched.rooms?.[index]?.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.rooms[index].name}
              </p>
            )}
          </div>
          <div>
            <Field
              name={`rooms[${index}].basePrice`}
              label="Base Price"
              placeholder="Base Price"
              component={InputWithLabel}
            />
            {errors.rooms?.[index]?.basePrice &&
              touched.rooms?.[index]?.basePrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.rooms[index].basePrice}
                </p>
              )}
          </div>
          <div>
            <Field
              name={`rooms[${index}].description`}
              label="Description"
              placeholder="Room Description"
              component={TextAreaWithLabel}
            />
            {errors.rooms?.[index]?.description &&
              touched.rooms?.[index]?.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.rooms[index].description}
                </p>
              )}
          </div>
        </div>

        <div className="flex flex-col border p-2 rounded-md mt-7">
          <div className="h-full flex flex-col items-center justify-center">
            {room.roomImage && (
              <img
                src={room.roomImage}
                alt={`Room ${index} preview`}
                className="w-[330px] h-[180px] object-cover border rounded-md border-gray-300 mb-3"
              />
            )}
            <div className="w-full flex justify-center items-center h-full">
              <input
                id={`rooms[${index}].roomImage`}
                name={`rooms[${index}].roomImage`}
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setFieldValue(
                      `rooms[${index}].roomImage`,
                      event.target?.result
                    );
                  };
                  if (file) reader.readAsDataURL(file);
                }}
                className="hidden"
              />
              <label
                htmlFor={`rooms[${index}].roomImage`}
                className="px-2 py-1 text-xs rounded-md text-primary bg-white border-primary border cursor-pointer shadow hover:opacity-90 m-2"
              >
                Select Room Image
              </label>
            </div>
          </div>
          {errors.rooms?.[index]?.roomImage &&
            touched.rooms?.[index]?.roomImage && (
              <p className="text-red-500 text-xs mt-1">
                {errors.rooms[index].roomImage}
              </p>
            )}
        </div>
      </FormSection>
    </div>
  );
};

export default RoomCard;
