import React, { useEffect, useRef, useState } from "react";
import api from "../../../../shared/api";
import PropertyDetailForm from "../../../../components/forms/property/PropertyDetailForm/PropertyAddForm";
import { useNavigate, useParams } from "react-router-dom";
import PropertyLayout from "../../../../components/layouts/PropertyLayout";
import GeneralModal from "../../../../components/modals/GeneralModal";
import PropertyEditForm from "../../../../components/forms/property/PropertyDetailForm/PropertyEditForm";
import LoadingCard from "../../../../components/cards/LoadingCard";

function PropertyEdit() {
  const { propertyId } = useParams();
  const propertyDetailRef = useRef();
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categoryAreas, setCategoryAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    propertyType: null,
    location: null,
    categoryArea: null,
    images: [],
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await fetchData("/property-type/all", "propertyTypes");
      await fetchData("/location/all", "locations");
      await fetchData("/category-area/all", "categoryAreas");
      await fetchData(`/property/one/${propertyId}`, "propertyDetail");
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async (url, key) => {
    try {
      const res = await api.get(url);
      if (key === "propertyTypes") {
        setPropertyTypes(res.data.data);
      } else if (key === "locations") {
        setLocations(res.data.data);
      } else if (key === "categoryAreas") {
        setCategoryAreas(res.data.data);
      } else if (key === "propertyDetail") {
        const property = res.data.data;
        const data = {
          name: property.name,
          description: property.description,
          propertyType: property.Property_type,
          categoryArea: property.Category_area,
          location: property.Location,
          images: property.Pictures,
        };
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

  const updateProperty = async (values) => {
    return api
      .post("/property/edit-property/" + propertyId, {
        name: values.name,
        locationId: values.location.id,
        propTypeId: values.propertyType.id,
        catAreaId: values.categoryArea.id,
        description: values.description,
      })
      .then(({ data }) => data.data.id)
      .catch((err) => {
        console.error("property err", err);
        return err;
      });
  };

  const uploadImages = async (propId, images) => {
    const formData = new FormData();

    formData.append("propId", propId);

    // Append the images to the FormData object
    images.forEach((image, index) => {
      // Extract the base64 data
      const base64Data = image.split(",")[1];

      // Convert the base64 data to a Buffer
      const buffer = Buffer.from(base64Data, "base64");

      // Convert the buffer to a Blob and append it to the FormData
      const blob = new Blob([buffer], { type: "image/png" });
      formData.append(`files`, blob);
    });

    try {
      const response = await api.post("/property/edit-photos" + 1, formData);

      if (response.status !== 200) {
        throw new Error("Failed to upload images");
      }

      // Handle the response as needed
      const result = await response.data;
      console.log("Images uploaded successfully", result);
    } catch (error) {
      console.error("Error uploading images:", error);
      return error;
    }
  };

  return isLoading ? (
    <div className="bg-gray-900/10 h-[89vh] flex items-center justify-center">
      <div className="w-full max-w-md transform overflow-hidden shadow-md rounded-3xl bg-white p-6 text-left align-middle transition-all">
        <LoadingCard />
      </div>
    </div>
  ) : (
    <div className="mt-5">
      <PropertyEditForm
        ref={propertyDetailRef}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        propertyTypes={propertyTypes}
        locations={locations}
        categoryAreas={categoryAreas}
        submitLabel={"Update Property"}
      />
    </div>
  );
}

export default PropertyEdit;
