import React, { useEffect } from "react";
import TableWithSortHeader from "../../../components/tables/TableWithSortHeader";
import { useNavigate } from "react-router-dom";
import api from "../../../shared/api";

function PropertyList() {
  const navigate = useNavigate();
  const [tableData, setTableData] = React.useState([]);

  useEffect(() => {
    getProperties();
  }, []);

  const getProperties = async () => {
    return api
      .get("/property/mine")
      .then(({ data }) => {
        const response = data.data.map((property) => {
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
    navigate("/property/add");
  };

  const onEditHandler = (id) => {
    console.log("Edit", id);
  };

  const onSelectHandler = (id) => {
    console.log("Select", id);
    navigate(`/property/${id}/`);
  };

  return (
    <div className="max-w-none w-full mx-0">
      <TableWithSortHeader
        title={"Property List"}
        description={"List of your own properties"}
        addHandler={onAddHandler}
        data={tableData}
        onEdit={onEditHandler}
        onSelect={onSelectHandler}
      />
    </div>
  );
}

export default PropertyList;
