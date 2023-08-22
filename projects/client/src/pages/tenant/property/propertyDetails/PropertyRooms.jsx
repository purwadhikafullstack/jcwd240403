import React, { useEffect, useRef, useState } from "react";
import api from "../../../../shared/api";
import { useParams } from "react-router-dom";
import LoadingCard from "../../../../components/cards/LoadingCard";
import PropertyRoomForm from "../../../../components/forms/property/PropertyDetailForm/PropertyRoomForm";

function PropertyRoom() {
  const { propertyId } = useParams();
  const propertyDetailRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    rooms: [
      {
        name: "",
        roomImage: null,
        description: "",
        basePrice: "",
      },
    ],
  });

  console.log(propertyId);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await fetchData(`/room/all/${propertyId}`);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async (url) => {
    try {
      const res = await api.get(url);
      const room = res.data.data.map((room) => ({
        name: room.name,
        roomImage: room.room_img,
        description: room.description,
        basePrice: room.base_price,
      }));

      console.log("res", res);
      const data = {
        rooms: [...room],
      };
      if (room.length > 0) {
        setInitialValues(data);
      }
    } catch (err) {
      console.error(err);
      // Add your error handling logic here
    }
  };

  console.log(initialValues);

  const handleFormSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
  };

  return isLoading ? (
    <div className="bg-gray-900/10 h-[89vh] flex items-center justify-center">
      <div className="w-full max-w-md transform overflow-hidden shadow-md rounded-3xl bg-white p-6 text-left align-middle transition-all">
        <LoadingCard />
      </div>
    </div>
  ) : (
    <div className="mt-5">
      <PropertyRoomForm
        ref={propertyDetailRef}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        submitLabel={"Update Room"}
      />
    </div>
  );
}

export default PropertyRoom;
