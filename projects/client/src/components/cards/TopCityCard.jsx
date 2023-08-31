import React from "react";
import { Link } from "react-router-dom";

function TopCityCard({ image, cityName, link }) {
  return (
    <Link
      to={link}
      className="h-[180px] md:h-[480px] shadow border border-slate-300 w-full rounded-xl relative group cursor-pointer"
    >
      <img
        src={image}
        alt={cityName}
        className="object-cover h-[180px] md:h-[480px] w-full rounded-xl z-0"
      />
      <div className="w-full h-full z-10 group-hover:bg-white/20 bg-transparent rounded-xl absolute inset-0 " />
      <div className="absolute bottom-5 left-5 md:bottom-7 md:left-7">
        <p className="text-white font-brand text-3xl md:text-[40px]">
          {cityName}
        </p>
      </div>
    </Link>
  );
}

export default TopCityCard;
