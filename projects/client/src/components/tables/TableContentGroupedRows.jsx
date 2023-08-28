import moment from "moment";
import { Fragment } from "react";

// Helper Functions
const isDate = (str) => !isNaN(new Date(str).getTime());

const renderContentBasedOnType = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value ? "True" : "False";
  return isDate(value) ? moment(value).format("D MMMM YYYY") : value;
};

const toReadableString = (str) => {
  const mapping = {
    start_date: "Start Date",
    end_date: "End Date",
    isActive: "Rule Status",
    id: "No",
    reason: "Reason",
  };
  return mapping[str] || str;
};

// TableContent Component
const TableContentGroupedRows = ({
  groupedRows,
  headers,
  onEdit,
  onDelete,
  arrayKey,
}) => {
  const flattenedSpecialPrices = groupedRows.flatMap(
    (room) => room.specialPrices
  );

  if (flattenedSpecialPrices.length === 0) {
    return (
      <p className="mt-40 text-xl text-center w-full">
        Your data seems to be empty.
        <br />
        <span className="font-bold">Let's fill it in!</span>
      </p>
    );
  }

  return (
    <div className="mt-8 mb-4">
      <table className="min-w-full divide-y divide-gray-300">
        {/* Table Header */}
        <thead className="bg-primary">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-left"
              >
                <button className="group inline-flex capitalize text-white">
                  {toReadableString(header)}
                </button>
              </th>
            ))}
            <th className="relative py-3.5 pl-3 pr-0">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="divide-y divide-gray-200 bg-white">
          {groupedRows.map((row, idx) => (
            <Fragment key={idx}>
              <tr className="border-t border-gray-200">
                <th
                  colSpan={headers.length + 1}
                  className="bg-secondary text-black py-2 pl-4 pr-3 text-left text-sm font-semibold"
                >
                  {row.name}
                </th>
              </tr>
              {row[arrayKey].length === 0 ? (
                <tr className="bg-gray-100">
                  <td
                    colSpan={headers.length + 1}
                    className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500"
                  >
                    No data
                  </td>
                </tr>
              ) : (
                row[arrayKey].map((status, statusIdx) => (
                  <tr key={status.id}>
                    {headers.map((header) => (
                      <td
                        key={header}
                        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-left"
                      >
                        {renderContentBasedOnType(status[header])}
                      </td>
                    ))}
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 flex items-center text-right text-sm space-x-4">
                      <button
                        onClick={() => onEdit(status)}
                        className="text-sky-600 hover:text-sky-900"
                      >
                        Edit
                      </button>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(status)}
                          className="text-white bg-rose-400 px-2 py-1 rounded hover:bg-rose-500"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableContentGroupedRows;
