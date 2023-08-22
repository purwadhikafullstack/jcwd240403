import React, { forwardRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../../buttons/Button";
import BuildingImageUpload from "../BuildingImageUpload";
import RoomsSectionForm from "./RoomsSectionForm";
import BuildingDetailForm from "./BuildingDetailForm";

const PropertyAddForm = forwardRef(
  (
    { initialValues, onSubmit, propertyTypes, locations, categoryAreas },
    ref
  ) => {
    const validationSchema = Yup.object().shape({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      propertyType: Yup.object().nullable().required("Required"),
      location: Yup.object().nullable().required("Required"),
      categoryArea: Yup.object().nullable().required("Required"),
      images: Yup.array()
        .min(1, "At least one image is required")
        .max(6, "Maximum of 6 images only")
        .required("Required"),
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

    return (
      <Formik
        innerRef={ref}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="space-y-12">
            <BuildingDetailForm
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              propertyTypes={propertyTypes}
              locations={locations}
              categoryAreas={categoryAreas}
            />

            <RoomsSectionForm
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
            />
            <div>
              <label className="block text-base font-bold text-gray-700">
                Building Images
              </label>
              <BuildingImageUpload
                images={values.images}
                onImagesChange={(newImages) =>
                  setFieldValue("images", newImages)
                }
              />
              {errors.images && touched.images && (
                <p className="text-red-500 text-xs mt-1">{errors.images}</p>
              )}
            </div>
            <div className="w-full flex justify-end">
              <Button
                type="submit"
                label={"Add Property"}
                className={"max-w-[150px] mt-10"}
              />
            </div>
          </Form>
        )}
      </Formik>
    );
  }
);

export default PropertyAddForm;
