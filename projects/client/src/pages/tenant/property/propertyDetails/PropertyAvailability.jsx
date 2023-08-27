import React, { useState } from "react";
import LoadingCard from "../../../../components/cards/LoadingCard";
import TableWithSortHeader from "../../../../components/tables/TableWithSortHeader";
import api from "../../../../shared/api";
import RoomAvailabilityFormModal from "../../../../components/modals/RoomAvailabilityFormModal";

/**
 * const dataType = {
 * roomId: number;
 * startDate: string;
 * endDate: string;
 * reason: string;
 * isActive: boolean;
 * }
 */

function PropertyAvailability() {
  const [modalType, setModalType] = useState("add");
  const [selectedRoomAvailability, setSelectedRoomAvailability] =
    useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState([]);

  // Handlers for add, edit, and delete
  const onAddHandler = () => setModal("add");
  const onEditHandler = (value) => setModal("edit", value);

  const setModal = (type, value = null) => {
    setModalType(type);
    setSelectedRoomAvailability(value);
    setIsOpen(true);
  };

  const fetchRoomAvailability = async () => {
    // try {
    //   const { data } = await api.get("/category-area/mine");
    //   const response =
    //     data && data.data && data.data.length
    //       ? data.data.map((item) => ({ id: item.id, name: item.name }))
    //       : [];
    //   setTableData(response);
    // } catch (error) {
    //   console.error("Error fetching categories:", error);
    // }
  };

  const addAvailability = (name) =>
    modifyAvailability("post", "/category-area/create", { categoryArea: name });
  const editAvailability = (name) =>
    modifyAvailability(
      "patch",
      `/category-area/edit/${selectedRoomAvailability.id}`,
      {
        newName: name,
      }
    );
  const deleteAvailability = () =>
    modifyAvailability(
      "delete",
      `/category-area/delete/${selectedRoomAvailability.id}`
    );

  // Generic function to modify categories
  const modifyAvailability = async (method, url, data = {}) => {
    try {
      await api[method](url, data);
      fetchRoomAvailability();
      setIsOpen(false);
      setSelectedRoomAvailability(null);
    } catch (error) {
      console.error("Error modifying category:", error);
    }
  };

  // Close modal
  const closeModal = () => setIsOpen(false);

  // Submit form based on modal type
  const modalSubmit = (values, formikBag) => {
    if (modalType === "add") addAvailability(values.name);
    if (modalType === "edit") editAvailability(values.name);
    if (formikBag) {
      const { setSubmitting, resetForm } = formikBag;
      setSubmitting(false);
      resetForm();
    }
  };

  return (
    <>
      <RoomAvailabilityFormModal
        closeModal={closeModal}
        isOpen={isOpen}
        modalSubmit={modalSubmit}
        deleteRoomAvailability={deleteAvailability}
        modalType={modalType}
        selectedRoomAvailability={selectedRoomAvailability}
      />
      <TableWithSortHeader
        title={"Room Availability"}
        description={"Here's the list of custom availability for each room"}
        addHandler={onAddHandler}
        data={tableData}
        onEdit={onEditHandler}
        // onDelete={onDeleteHandler}
      />
    </>
  );
}

export default PropertyAvailability;
