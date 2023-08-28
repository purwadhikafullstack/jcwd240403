import React, { useEffect, useState } from "react";
import TableWithSortHeader from "../../components/tables/TableWithSortHeader";
import api from "../../shared/api";
import CategoryAreaModal from "../../components/modals/CategoryAreaModal";
import InputWithLabel from "../../components/textInputs/InputWithLabel";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";

const MODAL_CONFIG = {
  add: {
    title: "Add Category Area",
    buttonLabel: "Submit",
  },
  edit: {
    title: "Edit Category Area",
    buttonLabel: "Update",
  },
  delete: {
    title: "Delete Category Area",
    buttonLabel: "Delete",
  },
};

// Validation schema
const VALIDATION_SCHEMA = Yup.object({
  name: Yup.string().required("Required"),
});

function CategoryArea() {
  const [modalType, setModalType] = useState("add");
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handlers for add, edit, and delete
  const onAddHandler = () => setModal("add");
  const onEditHandler = (value) => setModal("edit", value);
  const onDeleteHandler = (value) => setModal("delete", value);

  // Set modal type and selected category
  const setModal = (type, value = null) => {
    setModalType(type);
    setSelectedCategory(value);
    setIsOpen(true);
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/category-area/mine");
      const response = data.data.length
        ? data.data.map((item) => ({ id: item.id, name: item.name }))
        : [];
      setTableData(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add, edit, and delete category functions
  const addCategory = (name) =>
    modifyCategory("post", "/category-area/create", { categoryArea: name });
  const editCategory = (name) =>
    modifyCategory("patch", `/category-area/edit/${selectedCategory.id}`, {
      newName: name,
    });
  const deleteCategory = () =>
    modifyCategory("delete", `/category-area/delete/${selectedCategory.id}`);

  // Generic function to modify categories
  const modifyCategory = async (method, url, data = {}) => {
    try {
      await api[method](url, data);
      fetchCategories();
      setIsOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error modifying category:", error);
    }
  };

  // Close modal
  const closeModal = () => setIsOpen(false);

  // Submit form based on modal type
  const modalSubmit = (values, formikBag) => {
    if (modalType === "add") addCategory(values.name);
    if (modalType === "edit") editCategory(values.name);
    if (formikBag) {
      const { setSubmitting, resetForm } = formikBag;
      setSubmitting(false);
      resetForm();
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ name: "" }}
        validationSchema={VALIDATION_SCHEMA}
        onSubmit={modalSubmit}
      >
        {({ submitForm }) => (
          <Form onSubmit={modalSubmit}>
            <CategoryAreaModal
              isOpen={isOpen}
              closeModal={() => {
                if (modalType === "delete") {
                  modalSubmit({}, null);
                  closeModal();
                } else {
                  closeModal();
                }
              }}
              onClickButton={() => {
                if (modalType === "delete") {
                  deleteCategory();
                } else {
                  submitForm();
                }
              }}
              {...MODAL_CONFIG[modalType]}
            >
              <div className="flex flex-col space-y-2 mt-4">
                {modalType === "delete" ? (
                  <p>
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-primary capitalize">
                      {selectedCategory ? selectedCategory.name : ""}
                    </span>{" "}
                    category? This action cannot be undone.
                  </p>
                ) : (
                  <Field
                    id="name"
                    label="Category Name"
                    name="name"
                    placeholder="Category Area Name"
                    component={InputWithLabel}
                  />
                )}
              </div>
            </CategoryAreaModal>
          </Form>
        )}
      </Formik>
      <TableWithSortHeader
        title={"Category Area"}
        description={"List of your own made category area"}
        addHandler={onAddHandler}
        data={tableData}
        onEdit={onEditHandler}
        onDelete={onDeleteHandler}
      />
    </div>
  );
}

export default CategoryArea;
