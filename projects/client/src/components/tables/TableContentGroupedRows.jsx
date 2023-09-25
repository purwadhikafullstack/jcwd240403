import { Disclosure } from "@headlessui/react";
import moment from "moment";
import { Fragment } from "react";
import { classNames } from "../../shared/utils";

// Helper Functions
const isDate = (str) => !isNaN(new Date(str).getTime());

const renderContentBasedOnType = (value, key) => {
  if (key === "price" && typeof value === "number") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  }
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value ? "Active" : "Inactive";
  return isDate(value) ? moment(value).format("D MMMM YYYY") : value;
};

const toReadableString = (str) => {
  const mapping = {
    start_date: "Start Date",
    end_date: "End Date",
    isActive: "Rule Status",
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

  const flattenedAvailability = groupedRows.flatMap(
    (room) => room.roomStatuses
  );

  if (
    flattenedSpecialPrices.length === 0 ||
    flattenedAvailability.length === 0
  ) {
    return (
      <p className="mt-40 text-xl text-center w-full">
        Your data seems to be empty.
        <br />
        <span className="font-bold">Let's fill it in!</span>
      </p>
    );
  }

  return (
    <div className="mt-8 mb-4 overflow-x-auto">
      <table className="min-w-[150px] md:min-w-full divide-y divide-gray-300">
        {/* Table Header */}
        <thead className="bg-primary">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className={classNames(
                  "px-3 py-3.5 text-sm font-semibold text-gray-900 text-left",
                  (header === "price" || header === "reason") &&
                    "shrink-0 min-w-[150px] md:min-w-[230px]",
                  header === "start_date" &&
                    "shrink-0 min-w-[150px] md:min-w-[200px]",
                  header === "end_date" &&
                    "shrink-0 min-w-[150px] md:min-w-[200px]",
                  header === "isActive" &&
                    "shrink-0 min-w-[150px] md:min-w-[200px]"
                )}
              >
                <button className="group inline-flex capitalize text-white">
                  {toReadableString(header)}
                </button>
              </th>
            ))}
            <th className="relative py-3.5 pl-3 pr-0 min-w-[55px]">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="divide-y divide-gray-200 bg-white">
          {groupedRows.map(
            (row, idx) =>
              row[arrayKey].length !== 0 && (
                <Disclosure key={idx} defaultOpen>
                  <Disclosure.Button
                    as="tr"
                    className="border-t border-gray-200"
                  >
                    <th
                      colSpan={headers.length + 1}
                      className="bg-secondary capitalize text-black py-2 pl-4 pr-3 text-left text-sm font-semibold"
                    >
                      <Disclosure.Button>{row.name}</Disclosure.Button>
                    </th>
                  </Disclosure.Button>
                  <Disclosure.Panel
                    as="tr"
                    className="border-t border-gray-200"
                  >
                    {row[arrayKey].length === 0 ? (
                      <td
                        colSpan={headers.length + 1}
                        className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500 bg-gray-50"
                      >
                        No data
                      </td>
                    ) : (
                      row[arrayKey].map((status, statusIdx) => (
                        <Fragment key={statusIdx}>
                          {headers.map((header) => (
                            <td
                              key={header}
                              className={classNames(
                                "whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-left",
                                header === "price" &&
                                  "shrink-0 min-w-[150px] md:min-w-[230px]",
                                header === "start_date" &&
                                  "shrink-0 min-w-[150px] md:min-w-[200px]",
                                header === "end_date" &&
                                  "shrink-0 min-w-[150px] md:min-w-[200px]",
                                header === "isActive" &&
                                  "shrink-0 min-w-[150px] md:min-w-[200px]"
                              )}
                            >
                              {renderContentBasedOnType(status[header], header)}
                            </td>
                          ))}
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 flex items-center text-right text-sm space-x-4 min-w-[55px]">
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
                        </Fragment>
                      ))
                    )}
                  </Disclosure.Panel>
                </Disclosure>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableContentGroupedRows;
