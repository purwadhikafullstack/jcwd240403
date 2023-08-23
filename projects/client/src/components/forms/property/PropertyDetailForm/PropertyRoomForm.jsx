import React, { forwardRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../../buttons/Button";
import RoomsSectionForm from "./RoomsSectionForm";

const PropertyRoomForm = forwardRef(
  ({ initialValues, onSubmit, submitLabel }, ref) => {
    console.log("init", initialValues);
    const validationSchema = Yup.object().shape({
      rooms: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required("Room name is required"),
            roomImage: Yup.mixed()
              .nullable()
              .required("Room image is required"),
            description: Yup.string().required("Room description is required"),
            basePrice: Yup.string().required("Base price is required"),
          })
        )
        .min(1, "At least one room is required")
        .required("Required")
        .test(
          "at-least-one-room-filled",
          "At least one room must be fully filled",
          function (value) {
            // Check if at least one room is fully filled
            const fullyFilledRoom = value.some((room) => {
              return (
                room.name &&
                room.roomImage &&
                room.description &&
                room.basePrice
              );
            });

            return fullyFilledRoom;
          }
        ),
    });

    console.log("init", initialValues);

    return (
      <Formik
        innerRef={ref}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="space-y-12">
            <RoomsSectionForm
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
            />

            <div className="w-full flex justify-end">
              <Button
                type="submit"
                label={submitLabel}
                className={"max-w-[150px] mt-10"}
              />
            </div>
          </Form>
        )}
      </Formik>
    );
  }
);

export default PropertyRoomForm;
