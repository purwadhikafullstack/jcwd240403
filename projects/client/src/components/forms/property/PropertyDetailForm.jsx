import React, { forwardRef } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import InputWithLabel from "../../../components/textInputs/InputWithLabel";
import Dropdown from "../../../components/dropdown/Dropdown";
import TextAreaWithLabel from "../../../components/textInputs/TextAreaWithLabel";

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
    });

    return (
      <Formik
        innerRef={ref}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values, handleSubmit, errors, touched }) => (
          <Form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid md:grid-cols-2 gap-4">
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
            </div>
            <div className="grid md:grid-cols-2 gap-4">
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
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                name="description"
                label="Description"
                placeholder="Property Description"
                component={TextAreaWithLabel}
              />
            </div>
          </Form>
        )}
      </Formik>
    );
  }
);

export default PropertyDetailForm;
