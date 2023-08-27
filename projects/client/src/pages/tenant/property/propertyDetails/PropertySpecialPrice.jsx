import React, { useState } from "react";
import LoadingCard from "../../../../components/cards/LoadingCard";
import TableWithSortHeader from "../../../../components/tables/TableWithSortHeader";

function PropertySpecialPrice() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const tableData = list;

  const onAddHandler = () => {
    console.log("Add");
  };

  const onSelectHandler = (room) => {
    console.log("Edit");
  };

  const onDeleteHandler = async (room) => {
    console.log("Delete");
  };

  return isLoading ? (
    <div className="bg-gray-900/10 h-[89vh] flex items-center justify-center">
      <div className="w-full max-w-md transform overflow-hidden shadow-md rounded-3xl bg-white p-6 text-left align-middle transition-all">
        <LoadingCard />
      </div>
    </div>
  ) : (
    <TableWithSortHeader
      title={"Special Price"}
      description={"Here's the list of special price for each room"}
      addHandler={onAddHandler}
      data={tableData}
      onEdit={onSelectHandler}
      onDelete={onDeleteHandler}
    />
  );
}

export default PropertySpecialPrice;
