import React, { useEffect } from "react";
import TableWithSortHeader from "../../../components/tables/TableWithSortHeader";
import { useNavigate } from "react-router-dom";
import api from "../../../shared/api";
import GeneralModal from "../../../components/modals/GeneralModal";

function PropertyList() {
  const navigate = useNavigate();
  const [tableData, setTableData] = React.useState([]);
  const [isDelete, setIsDelete] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  useEffect(() => {
    getProperties();
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
            description: property.description,
          };
        });
        setTableData(response);
      })
      .catch((err) => {
        console.error(err);
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
      />
    </div>
  );
}

export default PropertyList;
