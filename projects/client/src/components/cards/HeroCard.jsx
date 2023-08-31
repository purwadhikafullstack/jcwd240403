import React from "react";
import ButtonDateRange from "../buttons/ButtonDateRange";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { differenceInDays } from "date-fns";

function HeroCard({ selectedDays, handleDayClick, today }) {
  const countNights = () => {
    const daysDifference = differenceInDays(selectedDays.to, selectedDays.from);
    return daysDifference;
  };
  return (
    <div className="bg-gradient-to-br from-primary to-accent md:px-20 py-10 rounded-lg p-3 w-full flex flex-col relative pb-16 md:h-[360px] md:rounded-3xl md:shadow-[0_35px_60px_-15px_rgba(46,144,230,0.1)]">
      <p className="font-brand text-3xl md:text-6xl md:w-[500px] text-white z-10">
        No more booking fright, Innsight makes it all right.
      </p>
      <img
        alt="arrow"
        src="/assets/arrow.png"
        className="w-32 h-32 absolute left-[550px] rotate-45 bottom-14 hidden md:block"
      />
      <img
        src="/assets/tour.png"
        alt="Users avatars"
        className="w-[512px] object-contain absolute right-0 -bottom-5 transform -scale-x-100 hidden md:block z-0"
      />
      <div className="absolute mx-auto -bottom-12 w-full max-w-xs bg-white sm:max-w-md md:max-w-[50%] left-0 right-0 rounded-lg border border-[#ccc] drop-shadow-lg flex flex-col">
        <div className="flex flex-row items-center w-full">
          <div className="w-5 h-5 mt-[3px] mx-4">
            <MagnifyingGlassIcon color={"#999"} />
          </div>
          <input
            className="pr-4 w-full py-3 rounded-lg outline-none"
            placeholder="Where do you want to go?"
          />
        </div>
        <div className="h-px border-t border-[#ccc] mx-4" />
        <ButtonDateRange
          selectedDays={selectedDays}
          handleDayClick={handleDayClick}
          today={today}
          totalNight={countNights()}
        />
      </div>
      <div className="flex justify-center my-3 absolute -bottom-28 md:-bottom-32 mx-auto left-0 right-0">
        <button className="bg-primary text-white w-[300px] h-[40px] rounded-xl font-bold">
          Let's Go
        </button>
      </div>
    </div>
  );
}

export default HeroCard;
