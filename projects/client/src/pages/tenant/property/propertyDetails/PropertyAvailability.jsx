import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../shared/api";
import moment from "moment";
import RoomAvailabilityFormModal from "../../../../components/modals/RoomAvailabilityFormModal";
import TableWithGroupedRows from "../../../../components/tables/TableWithGroupedRows";
import { mapRoomAvailabilityData } from "./dataMapper";

const PropertyAvailability = () => {
  const { propertyId } = useParams();
  const [modalType, setModalType] = useState("add");
  const [selectedRoomAvailability, setSelectedRoomAvailability] =
    useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState([]);

  const setModal = useCallback((type, value = null) => {
    setModalType(type);
    setSelectedRoomAvailability(value);
    setIsOpen(true);
  }, []);

  const sortAvailabilityByUpdatedAt = (data) => {
    return data.map((room) => ({
      ...room,
      Room_statuses: room.Room_statuses.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    }));
  };

  const fetchRoomAvailability = useCallback(async () => {
    try {
      const { data } = await api.get(`/room-status/all/${propertyId}`);
      const sortedData = sortAvailabilityByUpdatedAt(data.data);
      const mappedData = sortedData.length
        ? sortedData.map(mapRoomAvailabilityData)
        : [];
      setTableData(mappedData);

      console.log("data", data.data);
    } catch (error) {
      console.error("Error fetching room availability:", error);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchRoomAvailability();
  }, [fetchRoomAvailability]);

  const modifyAvailability = async (method, url, payload = {}) => {
    try {
      await api[method](url, payload);
      fetchRoomAvailability();
      setIsOpen(false);
      setSelectedRoomAvailability(null);
    } catch (error) {
      console.error("Error modifying category:", error);
    }
  };

  const addAvailability = (form) => {
    const payload = {
      roomId: form.room.id,
      customStatus: form.reason,
      startDate: moment(form.startDate).format("YYYY-MM-DD"),
      endDate: moment(form.endDate).format("YYYY-MM-DD"),
    };
    modifyAvailability("post", "/room-status/create", payload);
  };

  const editAvailability = (form) => {
    const payload = {
      customStatus: form.reason,
      startDate: moment(form.startDate).format("YYYY-MM-DD"),
      endDate: moment(form.endDate).format("YYYY-MM-DD"),
      isActive: form.isActive,
    };
    modifyAvailability(
      "patch",
      `/room-status/edit/${selectedRoomAvailability.id}`,
      payload
    );
  };

  const closeModal = () => setIsOpen(false);

  const modalSubmit = (values, formikBag) => {
    modalType === "add" ? addAvailability(values) : editAvailability(values);
    if (formikBag) {
      formikBag.setSubmitting(false);
      formikBag.resetForm();
    }
  };

  return (
    <>
      <RoomAvailabilityFormModal
        closeModal={closeModal}
        isOpen={isOpen}
        modalSubmit={modalSubmit}
        modalType={modalType}
        selectedRoomAvailability={selectedRoomAvailability}
      />
      <TableWithGroupedRows
        title="Room Availability"
        description="Here's the list of custom availability for each room"
        addHandler={() => setModal("add")}
        data={tableData}
        onEdit={(value) => setModal("edit", value)}
        arrayKey="roomStatuses"
      />
    </>
  );
};

export default PropertyAvailability;
