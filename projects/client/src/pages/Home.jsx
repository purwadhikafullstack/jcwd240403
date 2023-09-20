import React, { useEffect, useState } from "react";
import { isBefore } from "date-fns";
import MainContainer from "../components/layouts/MainContainer";
import HeroCard from "../components/cards/HeroCard";
import TopCityCard from "../components/cards/TopCityCard";
import api from "../shared/api";
import { StarIcon } from "@heroicons/react/24/solid";
import { formatToIDR } from "../shared/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const topCity = [
  {
    cityName: "Jakarta",
    link: "/search?city=jakarta",
    image:
      "https://cdn.britannica.com/88/132688-050-E9739DD9/Skyline-Jakarta-Indonesia.jpg",
  },
  {
    cityName: "Bandung",
    link: "/search?city=bandung",
    image: "https://www.nativeindonesia.com/foto/2018/09/Jalan-Braga-1.jpg",
  },
  {
    cityName: "Bali",
    link: "/search?city=bali",
    image:
      "https://www.affordableluxurytravel.co.uk/blog/wp-content/uploads/2021/11/AdobeStock_103587221-1140x570.jpeg",
  },
];

const topProperties = [
  {
    name: "Tamarin Hotel",
    rate: 3,
    price: 533129,
    location: "Menteng, Jakarta Pusat",
    image:
      "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-dskt/tix-hotel/images-web/2022/11/16/0e02e1cb-c6fa-43e3-ac64-863051e38d13-1668559824742-720b1110990112b2efc4232154eb0f9f.jpg",
  },
  {
    name: "Hotel Mulia Senayan Jakarta",
    rate: 5,
    price: 3600000,
    location: "Gelora, Jakarta Selatan",
    image:
      "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-dskt/tix-hotel/images-web/2020/10/31/9bfdd259-eb8c-49b2-a9be-be2f42bdcc5b-1604127454635-9bed03edac111f624172bfebd3c45546.jpg",
  },
  {
    name: "Holiday Inn & Suites",
    rate: 4,
    price: 888104,
    location: "Gajah Mada, Jakarta Barat",
    image:
      "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-dskt/tix-hotel/images-web/2020/11/01/c005881b-10f9-44b0-9d09-4fee39a1d73d-1604181104026-8a1d650b9ed253c4d97264576e7197ea.jpg",
  },
  {
    name: "Grand G7 Hotel",
    rate: 4,
    price: 477253,
    location: "Sawah Besar, Jakarta Barat",
    image:
      "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-dskt/tix-hotel/images-web/2022/10/11/bacd5423-2c43-434b-9a34-4e63b748585f-1665464122536-5a9d05369388ed2de4371cfc34724216.jpg",
  },
  {
    name: "Namin Dago Hotel",
    rate: 3,
    price: 455748,
    location: "Coblong, Bandung",
    image:
      "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-dskt/tix-hotel/images-web/2020/10/28/33e60f12-bcc1-4936-a775-bbb5f0563fb2-1603899108583-e56f027cfb5d9530cbea1be8941731ce.jpg",
  },
];

function Home() {
  const [location, setLocation] = useState("");

  // Get today's date
  const today = new Date();
  const navigate = useNavigate();

  // Get tomorrow's date
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [selectedDays, setSelectedDays] = useState({
    from: today,
    to: tomorrow,
  });

  const handleDayClick = (day, modifiers = {}) => {
    if (modifiers.disabled) {
      return;
    }

    if (modifiers.selected) {
      setSelectedDays({ from: null, to: null });
      return;
    }

    if (!selectedDays.from) {
      setSelectedDays({ from: day, to: null });
      return;
    }

    if (isBefore(day, selectedDays.from)) {
      setSelectedDays({ from: day, to: null });
      return;
    }

    setSelectedDays({ from: selectedDays.from, to: day });
  };

  const navigateToSearch = () => {
    console.log("location", location);
    navigate(
      `/property?start_date=${moment(selectedDays.from).format(
        "YYYY-MM-DD"
      )}&end_date=${moment(selectedDays.to).format(
        "YYYY-MM-DD"
      )}&location=${location}`
    );
  };

  return (
    <MainContainer>
      <div className="bg-white px-5 relative pt-5 pb-20">
        <HeroCard
          selectedDays={selectedDays}
          handleDayClick={handleDayClick}
          today={today}
          location={location}
          setLocation={(e) => setLocation(e)}
          onSearch={navigateToSearch}
        />
        <div className="relative z-0">
          <div className="mt-36 md:mt-48">
            <p className="font-brand text-xl md:text-3xl mb-5 md:mb-10">
              Top City To Explore
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {topCity.map(({ cityName, image, link }) => {
                return (
                  <TopCityCard
                    key={cityName}
                    cityName={cityName}
                    link={link}
                    image={image}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-14 md:mt-20">
            <p className="font-brand text-xl md:text-3xl mb-2">Our Picks</p>
            <p className="text-lg mb-5 md:mb-10 font-semibold text-gray-700">
              The Coolest Spots We Think You'll Love!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              {topProperties.map(({ image, location, name, price, rate }) => {
                return (
                  <div
                    key={name}
                    className="h-[240px] md:h-[300px] max-w-[200px] border rounded-xl flex flex-col"
                  >
                    <img
                      src={image}
                      alt={name}
                      className="object-cover h-[100px] md:h-[180px] w-full rounded-t-xl z-0 flex"
                    />
                    <div className="p-2 flex flex-col justify-between flex-1">
                      <div>
                        <p className="font-semibold text-md line-clamp-2">
                          {name}
                        </p>
                        <div className="my-2 flex flex-row items-start justify-start text-slate-600">
                          {Array.from({ length: rate }, (_, i) => (
                            <StarIcon className="w-3 h-3" key={i} />
                          ))}
                          <span className="text-sm ml-2 -mt-1 line-clamp-1">
                            {location}
                          </span>
                        </div>
                      </div>

                      <p className="font-semibold">{formatToIDR(price)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}

export default Home;
