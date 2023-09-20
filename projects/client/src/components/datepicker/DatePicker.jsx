import React from "react";
import { DayPicker } from "react-day-picker";
import useCheckMobileScreen from "../../shared/hooks/useCheckIsMobile";

function DatePicker({ selectedDays, handleDayClick, today, asreport = false }) {
  const isMobile = useCheckMobileScreen();
  return (
    <DayPicker
      numberOfMonths={isMobile ? 1 : 2}
      mode="range"
      selected={selectedDays}
      onDayClick={handleDayClick}
      disabled={asreport ? null : { before: today }}
      classNames={{
        vhidden: "sr-only",
        caption: "flex justify-center items-center h-10",
        root: "text-gray-800",
        months: "flex gap-4 relative px-4",
        caption_label: "text-lg px-1",
        nav_button:
          "inline-flex justify-center items-center absolute top-0 w-10 h-10 rounded-full text-gray-600 hover:bg-gray-100",
        nav_button_next: "right-0",
        nav_button_previous: "left-0",
        table: "border-collapse border-spacing-0",
        head_cell: "w-10 h-10 uppercase align-middle text-center text-xs",
        cell: "w-10 h-10 align-middle text-center border-0 px-0",
        day: "rounded-full w-10 h-10 transition-colors hover:bg-primary/80 focus:outline-none focus-visible:ring focus-visible:ring-sky-300 focus-visible:ring-opacity-50 active:bg-sky-600 active:text-white",
        day_selected: "text-white bg-primary hover:bg-primary/80 text-white",
        day_today: "font-bold",
        day_disabled:
          "opacity-25 hover:bg-white active:bg-white active:text-gray-800",
        day_outside: "enabled:opacity-50",
        day_range_middle: "rounded-none",
        day_range_end: "rounded-l-none rounded-r-full",
        day_range_start: "rounded-r-none rounded-l-full",
        day_hidden: "hidden",
      }}
    />
  );
}

export default DatePicker;
