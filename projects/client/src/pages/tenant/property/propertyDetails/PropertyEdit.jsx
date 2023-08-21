import React, { useEffect, useRef, useState } from "react";
import api from "../../../../shared/api";
import PropertyDetailForm from "../../../../components/forms/property/PropertyDetailForm";
import { useNavigate } from "react-router-dom";
import PropertyLayout from "../../../../components/layouts/PropertyLayout";

function PropertyEdit() {
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
    <div className="mt-8 mb-4 flow-root space-y-4">
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
  );
}

export default PropertyEdit;
