import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Pagination from "../pagination/Pagination";
import Button from "../buttons/Button";

const mockData = [
  {
    id: "1",
    name: "Hotel Mulia",
    type: "hotel",
    location: "Jakarta Selatan",
  },
  {
    id: "2",
    name: "Bandung Hotel",
    type: "hotel",
    location: "Bandung",
  },
  {
    id: "3",
    name: "Cozy Guest House",
    type: "guest house",
    location: "Jakarta Selatan",
  },
  {
    id: "4",
    name: "Jakarta Apartment",
    type: "apartment",
    location: "Jakarta Barat",
  },
  {
    id: "5",
    name: "Bandung Guest House",
    type: "guest house",
    location: "Bandung",
  },
  {
    id: "6",
    name: "Luxury Hotel",
    type: "hotel",
    location: "Jakarta Pusat",
  },
  {
    id: "7",
    name: "Apartment City View",
    type: "apartment",
    location: "Jakarta Utara",
  },
  {
    id: "8",
    name: "Bandung Apartment",
    type: "apartment",
    location: "Bandung",
  },
  {
    id: "9",
    name: "Jakarta Guest House",
    type: "guest house",
    location: "Jakarta Timur",
  },
  {
    id: "10",
    name: "Comfort Hotel",
    type: "hotel",
    location: "Jakarta Selatan",
  },
];

export default function TableWithSortHeader({ title, description }) {
  const handleClickRow = (id) => {
    // navigate href #
    console.log(id);
  };

  return (
    <div className="flex flex-col bg-white p-4 rounded">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button label="Add Properties" className={'h-11'}/>
        </div>
      </div>
      <div className="mt-8 mb-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    <a href="#" className="group inline-flex">
                      ID
                      <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                        <ChevronDownIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Name
                      <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                        <ChevronDownIcon
                          className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Property Type
                      <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                        <ChevronDownIcon
                          className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <a href="#" className="group inline-flex">
                      Location
                      <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                        <ChevronDownIcon
                          className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockData.map(({ id, location, name, type }) => (
                  <tr
                    onClick={() => handleClickRow(id)}
                    key={id}
                    className="cursor-pointer"
                  >
                    <td className="whitespace-nowrap capitalize py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                      {name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                      {type}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                      {location}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                      <a
                        href="#"
                        className="text-sky-600 hover:text-sky-900"
                      >
                        Edit<span className="sr-only">, {id}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination />
    </div>
  );
}

TableWithSortHeader.defaultProps = {
  title: "Title",
  description: "Description",
};
