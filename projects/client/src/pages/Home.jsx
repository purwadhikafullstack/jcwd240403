import React, { useState } from "react";
import ButtonWithLogo from "../components/buttons/ButtonWithLogo";
import { UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { isBefore, differenceInDays } from "date-fns";
import ButtonDateRange from "../components/buttons/ButtonDateRange";
import useToken from "../shared/hooks/useToken";
import { Link } from "react-router-dom";
import MainContainer from "../components/layouts/MainContainer";

function Home() {
  const { token, removeToken } = useToken();
  // Get today's date
  const today = new Date();

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

  const countNights = () => {
    const daysDifference = differenceInDays(selectedDays.to, selectedDays.from);

    return daysDifference;
  };

  return (
    <MainContainer>
      <div className="bg-white relative min-h-screen mx-auto">
        {/* header */}
        <div className="sticky top-0 max-w-[1366px] mx-auto flex items-center justify-between flex-row px-5 py-3 shadow md:shadow-none">
          <ButtonWithLogo
            align="row"
            imageSize="h-12 w-12"
            textSize="text-xl"
            type="dark"
          />
          {token ? (
            <div className="flex flex-row items-center gap-3">
              <div className="shrink-0 grow-0 h-10 w-10 rounded-full p-2 border border-primary">
                <UserIcon color="#2E90E6" />
              </div>
              <button onClick={removeToken} className="text-primary underline">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-row space-x-4">
              <Link to="/login" className="text-primary underline">
                Login
              </Link>
              <Link to="/register" className="text-primary underline">
                Register
              </Link>
            </div>
          )}
        </div>
        {/* banner */}
        <div className="bg-gradient-to-br from-primary to-accent m-3 md:px-20 py-10 rounded-lg p-3 h-full flex flex-col relative pb-16 md:max-w-[1366px] md:mx-auto md:h-[360px] md:rounded-3xl md:shadow-[0_35px_60px_-15px_rgba(46,144,230,0.7)]">
          <p className="font-brand text-3xl md:text-6xl md:w-[500px] text-white">
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
            className="w-[512px] object-contain absolute right-0 -bottom-5 transform -scale-x-100 hidden md:block"
          />
          <div className="absolute -bottom-12 left-3 right-3 md:left-[440px] md:right-[440px] bg-white rounded-lg border border-[#ccc] drop-shadow-lg flex flex-col">
            <div className="flex flex-row items-center w-full">
              <div className="w-5 h-5 mt-[3px] mx-4">
                <MagnifyingGlassIcon color={"#999"} />
              </div>
              <input
                className="pr-4 w-full py-3 rounded-lg outline-none"
                placeholder="Where do you want to go?"
              />
            </div>
            <div className=" h-px border-t border-[#ccc] mx-4" />
            <ButtonDateRange
              selectedDays={selectedDays}
              handleDayClick={handleDayClick}
              today={today}
              totalNight={countNights()}
            />
          </div>
        </div>
        {/* <div className="bg-primary h-[100px] absolute bottom-0 left-0 right-0 text-center">
          <p className="pt-8">
            Lorem ipsum dolor sit amet ipsum dolor sit amet ipsum dolor sit amet
            ipsum dolor sit amet.
          </p>
        </div> */}
      </div>
    </MainContainer>
  );
}

export default Home;
