import React, { useEffect } from "react";
import TableWithSortHeader from "../../../components/tables/TableWithSortHeader";
import { useNavigate } from "react-router-dom";
import api from "../../../shared/api";
import GeneralModal from "../../../components/modals/GeneralModal";
import Dropdown from "../../../components/dropdown/Dropdown";

function PropertyList() {
  const navigate = useNavigate();
  const [tableData, setTableData] = React.useState([]);
  const [isDelete, setIsDelete] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [locationList, setLocationList] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState(null);

  useEffect(() => {
    getProperties();
    getAllLocation();
  }, []);

  const getProperties = async () => {
    return api
      .get("/property/mine")
      .then(({ data }) => {
        const response = data.data?.map((property) => {
          return {
            id: property.id,
            name: property.name,
            location: property.Location.city,
            type: property.Property_type.name,
          };
        });
        setTableData(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getAllLocation = () => {
    api
      .get("/location/all")
      .then((res) => {
        setLocationList([{ id: 0, city: "All" }, ...res.data.data]);
        setSelectedLocation({ id: 0, city: "All" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onAddHandler = () => {
    console.log("Add");
    navigate("/my-property/add");
  };

  const onSelectHandler = (property) => {
    navigate(`/my-property/${property.id}/`);
  };

  const onDeleteHandler = async (property) => {
    setIsDelete(true);
    setSelected(property);
  };

  const deleteProperty = async () => {
    try {
      await api.delete(`/property/delete/${selected.id}`);
      getProperties();
      setIsDelete(false);
      setSelected(null);
    } catch (error) {
      console.log("error", error);
    }
  };

  const renderFilter = () => {
    return (
      <div className="w-[200px]">
        <Dropdown
          selected={selectedLocation}
          labelField="city"
          className="w-full"
          label={`Location`}
          items={locationList}
          onItemChange={handleCityFilter}
        />
      </div>
    );
  };

  const handleCityFilter = async (property) => {
    console.log("property", property);
    setSelectedLocation(property);
    if (property.id === 0) {
      return getProperties();
    }
    return await api
      .get(`/property/mine?filter=${property.id}`)
      .then(({ data }) => {
        const response = data.data?.map((property) => {
          console.log("prop", property);
          return {
            id: property.id,
            name: property.name,
            location: property.Location.city,
            type: property.Property_type.name,
          };
        });
        setTableData(response);
      });
  };

  return (
    <div className="max-w-none w-full mx-0">
      <GeneralModal
        isOpen={isDelete}
        closeModal={setIsDelete}
        title="Delete Property"
      >
        <div className="py-3">
          <p>
            Are you sure you want to delete this property{" "}
            <span className="font-bold">{selected?.name}</span>? This action
            cannot be undone.
          </p>
          <div className="flex flex-row space-x-3 justify-end mt-5">
            <button
              onClick={() => setIsDelete(false)}
              className="border rounded-md h-10 w-[80px] cursor-pointer hover:opacity-95"
            >
              Cancel
            </button>
            <button
              onClick={deleteProperty}
              className="bg-red-400 text-white border rounded-md h-10 w-[80px] cursor-pointer hover:opacity-95"
            >
              Delete
            </button>
          </div>
        </div>
      </GeneralModal>

      <TableWithSortHeader
        title={"Property List"}
        description={"List of your own properties"}
        addHandler={onAddHandler}
        data={tableData}
        onEdit={onSelectHandler}
        onDelete={onDeleteHandler}
        subheaderwidget={renderFilter()}
      />
    </div>
  );
}

export default PropertyList;
