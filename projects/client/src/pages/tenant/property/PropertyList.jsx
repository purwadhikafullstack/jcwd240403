import React from "react";
import TableWithSortHeader from "../../../components/tables/TableWithSortHeader";
import { useNavigate } from "react-router-dom";

function PropertyList() {
  const navigate = useNavigate();
  const tableData = [
    {
      id: 1,
      name: "Property 1",
      location: "Location 1",
      description: "Description 1",
    },
  ];

  const onAddHandler = () => {
    console.log("Add");
    navigate("/property/add");
  };

  const onEditHandler = (id) => {
    console.log("Edit", id);
  };

  const onDeleteHandler = (id) => {
    console.log("Delete", id);
  };

  const onSelectHandler = (id) => {
    console.log("Select", id);
    navigate(`/property/${id}`)
  };

  return (
    <div className="max-w-none w-full mx-0">
      <TableWithSortHeader
        title={"Property List"}
        description={"List of your own properties"}
        addHandler={onAddHandler}
        data={tableData}
        onEdit={onEditHandler}
        onDelete={onDeleteHandler}
        onSelect={onSelectHandler}
      />
    </div>
  );
}

export default PropertyList;
