import React, { useEffect, useState } from "react";
import TableWithSortHeader from "../../components/tables/TableWithSortHeader";
import api from "../../shared/api";
import CategoryAreaModal from "../../components/modals/CategoryAreaModal";

const addModalConfig = {
  title: "Add Category Area",
  buttonLabel: "Submit",
};

const editModalConfig = {
  title: "Edit Category Area",
  buttonLabel: "Update",
};

const deleteModalConfig = {
  title: "Delete Category Area",
  buttonLabel: "Delete",
};

function CategoryArea() {
  const [modalType, setModalType] = useState("add");
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [modalConfig, setModalConfig] = useState(addModalConfig);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/category-area/mine");

      const response = data.data.length
        ? data.data.map((item) => ({
            id: item.id,
            name: item.name,
          }))
        : [];

      setTableData(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const onAddHandler = () => {
    setModalType("add");
    setModalConfig(addModalConfig);
    setIsOpen(true);
  };

  const onEditHandler = (value) => {
    setModalType("edit");
    setModalConfig(editModalConfig);
    setSelectedCategory(value);
    setName(value.name);
    setIsOpen(true);
  };

  const onDeleteHandler = (value) => {
    setModalType("delete");
    setModalConfig(deleteModalConfig);
    setSelectedCategory(value);
    setIsOpen(true);
  };

  const addCategory = () => {
    api
      .post("/category-area/create", {
        categoryArea: name,
      })
      .then(() => {
        fetchCategories();
        setIsOpen(false);
        setName("");
      })
      .catch((err) => console.log("err", err));
  };

  const editCategory = () => {
    api
      .patch(`/category-area/edit/${selectedCategory.id}`, {
        newName: name,
      })
      .then(() => {
        fetchCategories();
        setIsOpen(false);
        setName("");
        setSelectedCategory(null);
      })
      .catch((err) => console.log("err", err));
  };

  const deleteCategory = () => {
    api
      .delete(`/category-area/delete/${selectedCategory.id}`)
      .then(() => {
        setModalType("add");
        setIsOpen(false);
        setName("");
        setSelectedCategory(null);
        fetchCategories();
      })
      .catch((err) => console.log("err", err));
  };

  const closeModal = () => {
    setIsOpen(false);
    setName("");
    setSelectedCategory(null);
  };

  const modalSubmit = () => {
    switch (modalType) {
      case "add":
        addCategory();
        break;
      case "edit":
        editCategory();
        break;
      default:
        deleteCategory();
        break;
    }
  };

  return (
    <div>
      <CategoryAreaModal
        isOpen={isOpen}
        closeModal={closeModal}
        onClickButton={modalSubmit}
        {...modalConfig}
      >
        <div className="flex flex-col space-y-2 mt-4">
          {modalType === "delete" ? (
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold text-primary capitalize">
                {selectedCategory.name}
              </span>{" "}
              category? This action cannot be undone.
            </p>
          ) : (
            <>
              <label className="text-sm">Name</label>
              <input
                className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                placeholder="Category Area Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
            </>
          )}
        </div>
      </CategoryAreaModal>
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
