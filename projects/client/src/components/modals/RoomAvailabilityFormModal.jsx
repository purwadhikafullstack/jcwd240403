import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import FormModal from "./FormModal";
import SwitchWithLabel from "../switch/SwitchWithLabel";
import DatePickerWithLabel from "../datepicker/DatePickerWithLabel";
import TextAreaWithLabel from "../textInputs/TextAreaWithLabel";
import Dropdown from "../dropdown/Dropdown";

const VALIDATION_SCHEMA = Yup.object({
  room: Yup.object().nullable().required("Required"),
  isActive: Yup.boolean(),
  startDate: Yup.date().required("Start date is required").nullable(),
  endDate: Yup.date()
    .required("End date is required")
    .nullable()
    .min(Yup.ref("startDate"), "End date can't be before start date"),
  reason: Yup.string().required("Reason is required"),
});

const MODAL_CONFIG = {
  add: {
    title: "Set Room Availability",
    buttonLabel: "Submit",
  },
  edit: {
    title: "Edit Availability Config",
    buttonLabel: "Update",
  },
};

const RoomAvailabilityFormModal = ({
  isOpen,
  closeModal,
  modalSubmit,
  modalType,
  selectedRoomAvailability,
  deleteRoomAvailability,
  rooms,
}) => {
  return (
    <Formik
      initialValues={{
        name: selectedRoomAvailability ? selectedRoomAvailability.name : "",
        selectedDays: { from: null, to: null }, // added this line
      }}
      enableReinitialize
      validationSchema={VALIDATION_SCHEMA}
      onSubmit={modalSubmit}
    >
      {({ handleSubmit, values, setFieldValue, touched, errors }) => {
        console.log("values", errors);
        return (
          <Form onSubmit={handleSubmit}>
            <FormModal
              isOpen={isOpen}
              closeModal={closeModal}
              onClickButton={() => {
                handleSubmit();
              }}
              {...MODAL_CONFIG[modalType]}
            >
              <div className="flex flex-col space-y-2 mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Dropdown
                      items={rooms || []}
                      onItemChange={(e) => setFieldValue("room", e)}
                      selected={values.room}
                      labelField={"room"}
                      label={"Room"}
                      error={errors.room}
                    />
                    <Field
                      label="Enable Rule"
                      name="isActive"
                      component={SwitchWithLabel}
                    />
                    <Field
                      label="Start Date"
                      name="startDate"
                      component={DatePickerWithLabel}
                    />
                    <Field
                      label="End Date"
                      name="endDate"
                      component={DatePickerWithLabel}
                    />
                  </div>
                  <Field
                    label="Reason"
                    name="reason"
                    component={TextAreaWithLabel}
                  />
                </div>
              </div>
            </FormModal>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RoomAvailabilityFormModal;
