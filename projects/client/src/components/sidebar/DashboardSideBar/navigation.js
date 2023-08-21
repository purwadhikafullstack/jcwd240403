import {
  BuildingLibraryIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";

const navigation = [
  {
    name: "Property",
    href: "/",
    icon: BuildingLibraryIcon,
    current: true,
    children: [
      { name: "Property List", href: "/" },
      { name: "Category Area", href: "/category-area" },
    ],
  },
  {
    name: "Order",
    href: "#",
    icon: DocumentDuplicateIcon,
    current: false,
  },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];

export default navigation;
