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
  const [pagination, setPagination] = React.useState(null);

  function fetchProperties(filter, sort, page, perpage) {
    const query = [];
    if (filter) query.push(`filter=${filter}`);
    if (page) query.push(`page=${page}`);
    if (perpage) query.push(`perpage=${perpage}`);
    query.push(`sortBy=${sort ? sort : "nameAsc"}`);
    const queryString = query.length ? `?${query.join("&")}` : "";
    return api.get(`/property/mine${queryString}`);
  }

  function handleError(error) {
    console.error("API error:", error);
  }

  function ModalButton({ label, onClick, className }) {
    return (
      <button
        onClick={onClick}
        className={`${className} border rounded-md h-10 w-[80px] cursor-pointer hover:opacity-95`}
      >
        {label}
      </button>
    );
  }

  useEffect(() => {
    handlePaginationChange(1); // Initial call to populate data
    getAllLocation();
  }, []);

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
      fetchProperties()
        .then(({ data }) => {
          const response = data.data?.map((property) => {
            return {
              id: property.id,
              name: property.name,
              location: property.Location.city,
              type: property.Property_type.name,
            };
          });
          setPagination(data.pagination);
          setTableData(response);
        })
        .catch(handleError);
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
    setSelectedLocation(property);
    if (property.id === 0) {
      return fetchProperties()
        .then(({ data }) => {
          const response = data.data?.map((property) => {
            return {
              id: property.id,
              name: property.name,
              location: property.Location.city,
              type: property.Property_type.name,
            };
          });
          setPagination(data.pagination);
          setTableData(response);
        })
        .catch(handleError);
    }
    return fetchProperties(property.id)
      .then(({ data }) => {
        const response = data.data?.map((property) => {
          return {
            id: property.id,
            name: property.name,
            location: property.Location.city,
            type: property.Property_type.name,
          };
        });
        setPagination(data.pagination);
        setTableData(response);
      })
      .catch(handleError);
  };

  const handleSort = async (sortBy) => {
    fetchProperties(undefined, sortBy)
      .then(({ data }) => {
        const response = data.data?.map((property) => {
          return {
            id: property.id,
            name: property.name,
            location: property.Location.city,
            type: property.Property_type.name,
          };
        });
        setPagination(data.pagination);
        setTableData(response);
      })
      .catch(handleError);
  };

  const handlePaginationChange = async (page) => {
    fetchProperties(undefined, undefined, page, 10)
      .then(({ data }) => {
        const response = data.data?.map((property) => {
          return {
            id: property.id,
            name: property.name,
            location: property.Location.city,
            type: property.Property_type.name,
          };
        });
        setPagination(data.pagination);
        setTableData(response);
      })
      .catch(handleError);
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
            <ModalButton
              label="Cancel"
              onClick={() => setIsDelete(false)}
              className=""
            />
            <ModalButton
              label="Delete"
              onClick={deleteProperty}
              className="bg-red-400 text-white"
            />
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
        sortableHeaderNames={["name"]}
        handleSort={handleSort}
        pagination={pagination}
        onChangePagination={handlePaginationChange}
      />
    </div>
  );
}

export default PropertyList;
