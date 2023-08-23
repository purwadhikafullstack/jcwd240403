import React from "react";
import RoomCard from "./RoomCard";
import FormSection from "../FormSection";

const RoomsSectionForm = ({ values, errors, touched, setFieldValue }) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-row justify-between items-center">
        <label className="text-base font-bold text-gray-700">Rooms</label>
        <button
          type="button"
          onClick={() => {
            setFieldValue("rooms", [
              ...values.rooms,
              {
                name: "",
                roomImage: null,
                description: "",
                basePrice: "",
              },
            ]);
          }}
          className="bg-teal-400 text-white rounded-md px-2 py-1.5 w-[150px] grow-0"
        >
          Add Room
        </button>
      </div>
      <FormSection>
        {values.rooms.map((room, index) => {
          console.log("roasdom", values);
          return (
            <RoomCard
              key={index}
              room={room}
              index={index}
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
            />
          );
        })}
      </FormSection>
    </div>
  );
};

export default RoomsSectionForm;
