import React, { forwardRef } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import InputWithLabel from "../../../textInputs/InputWithLabel";
import Dropdown from "../../../dropdown/Dropdown";
import TextAreaWithLabel from "../../../textInputs/TextAreaWithLabel";
import Button from "../../../buttons/Button";
import { classNames } from "../../../../shared/utils";
import { TrashIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/20/solid";
import BuildingImageUpload from "../BuildingImageUpload";
import FormSection from "./FormSection";

const PropertyDetailForm = forwardRef(
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
        .min(1, "At least one room is required")
        .required("Required"),
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
            <div className="space-y-2">
              <label className="text-base font-bold text-gray-700">
                Building Detail
              </label>
              <FormSection>
                <Field
                  name="name"
                  label="Name"
                  placeholder="Property Name"
                  component={InputWithLabel}
                />

                <Dropdown
                  items={propertyTypes}
                  onItemChange={(e) => setFieldValue("propertyType", e)}
                  selected={values.propertyType}
                  labelField={"name"}
                  label={"Property Type"}
                  error={touched.propertyType && errors.propertyType}
                />
              </FormSection>
              <FormSection>
                <Dropdown
                  items={locations}
                  onItemChange={(e) => setFieldValue("location", e)}
                  selected={values.location}
                  labelField={"city"}
                  label={"Location"}
                  error={touched.location && errors.location}
                />

                <Dropdown
                  items={categoryAreas}
                  onItemChange={(e) => setFieldValue("categoryArea", e)}
                  selected={values.categoryArea}
                  labelField={"name"}
                  label={"Category Area"}
                  error={touched.categoryArea && errors.categoryArea}
                />
              </FormSection>
              <FormSection>
                <Field
                  name="description"
                  label="Description"
                  placeholder="Property Description"
                  component={TextAreaWithLabel}
                />
              </FormSection>
            </div>
            <div className="space-y-5">
              <div className="flex flex-row justify-between items-center">
                <label className="text-base font-bold text-gray-700">
                  Rooms
                </label>
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
              {values.rooms.map((room, index) => (
                <div
                  key={index}
                  className="space-y-2 border rounded-lg border-gray-500 p-5"
                >
                  <FormSection>
                    <Field
                      name={`rooms[${index}].name`}
                      label="Name"
                      placeholder="Room Name"
                      component={InputWithLabel}
                    />
                    <div className="w-full justify-end items-center grow-0 flex pb-2">
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
                  </FormSection>

                  <FormSection>
                    <div className="flex flex-col space-y-2">
                      <Field
                        name={`rooms[${index}].basePrice`}
                        label="Base Price"
                        placeholder="Base Price"
                        component={InputWithLabel}
                      />
                      <Field
                        name={`rooms[${index}].description`}
                        label="Description"
                        placeholder="Room Description"
                        component={TextAreaWithLabel}
                      />
                    </div>

                    <div className="flex flex-col border p-4 rounded-md">
                      <div className="h-fit min-h-[200px] flex flex-col items-center justify-center">
                        {room.roomImage && (
                          <img
                            src={room.roomImage}
                            alt={`Room ${index} preview`}
                            className="w-[200px] h-[150px] object-cover border rounded-md border-gray-300 mb-3"
                          />
                        )}
                        <div className="w-full flex justify-center">
                          <input
                            id={`rooms[${index}].roomImage`}
                            name={`rooms[${index}].roomImage`}
                            type="file"
                            accept=".png, .jpg, .jpeg"
                            onChange={(e) => {
                              const file = e.target.files
                                ? e.target.files[0]
                                : null;
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
                            className="px-2 py-1.5 text-sm rounded-md text-primary bg-white border-primary border cursor-pointer shadow hover:opacity-90 m-2"
                          >
                            Select Room Image
                          </label>
                        </div>
                      </div>
                    </div>
                  </FormSection>
                </div>
              ))}
            </div>
            <div>
              <label
                className="block text-base font-bold text-gray-700"
              >
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

export default PropertyDetailForm;
