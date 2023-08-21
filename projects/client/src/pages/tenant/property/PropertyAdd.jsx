import React, { useEffect, useRef, useState } from "react";
import api from "../../../shared/api";
import PropertyDetailForm from "../../../components/forms/property/PropertyDetailForm";

function PropertyAdd() {
  const propertyDetailRef = useRef();
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categoryAreas, setCategoryAreas] = useState([]);

  const initialValues = {
    name: "",
    description: "",
    propertyType: null,
    location: null,
    categoryArea: null,
    images: [],
    rooms: [
      {
        name: "",
        roomImage: null,
        description: "",
        basePrice: "",
      },
    ],
  };

  useEffect(() => {
    fetchData("/property-type/all", "propertyTypes");
    fetchData("/location/all", "locations");
    fetchData("/category-area/all", "categoryAreas");
  }, []);

  const fetchData = async (url, key) => {
    try {
      const res = await api.get(url);
      if (key === "propertyTypes") {
        setPropertyTypes(res.data.data);
      } else if (key === "locations") {
        setLocations(res.data.data);
      } else if (key === "categoryAreas") {
        setCategoryAreas(res.data.data);
      }
    } catch (err) {
      console.error(err);
      // Add your error handling logic here
    }
  };

  const handleFormSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col bg-white p-4 rounded">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-sans font-semibold leading-6 text-gray-900">
            Add Property
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Register your new property
          </p>
        </div>
      </div>

      <div className="my-4 flow-root space-y-4">
        {/* Form input */}
        <PropertyDetailForm
          ref={propertyDetailRef}
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          propertyTypes={propertyTypes}
          locations={locations}
          categoryAreas={categoryAreas}
        />
      </div>
    </div>
  );
}

export default PropertyAdd;
