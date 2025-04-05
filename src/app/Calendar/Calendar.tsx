import React, { useState, useEffect, forwardRef } from "react";
import SettingIcon from "../Icons/SettingIcon";
import LeftIcon from "../Icons/LeftIcon";
import RightIcon from "../Icons/RightIcon";

import NepaliDateTime from "../NepaliDateTime/NepaliDateTime";

import "./calendar.css";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Septermber",
  "October",
  "November",
  "December",
];

import { NEPALI_CALENDAR_DATA } from "../converter/constants";

interface DateProps {
  pickedDate: (date: string) => void;
  closeCalendar: () => void;
}

const yearIndex = Array.from({ length: NEPALI_CALENDAR_DATA.length }, (_, i) => 2000 + i);

const TODAY = new NepaliDateTime();
const initialStartYearSliceIndex = () => {
  let index = 0;
  while (index + 10 <= yearIndex.length) {
    if (yearIndex.slice(index, index + 10).includes(TODAY.getYear())) {
      return index;
    }
    index += 10;
  }
  return 0;
};

// const Calendar: React.FC<DateProps> = ({ pickedDate, closeCalendar }) => {
const Calendar = forwardRef<HTMLInputElement, DateProps>(({ pickedDate, closeCalendar }, ref) => {
  const [showYearSelector, setShowYearSelector] = useState<boolean>(false);
  const toggleYearSelectorView = () => {
    setShowYearSelector((prevView) => !prevView);
  };

  const [startYearIndex, setStartYearIndex] = useState<number>(initialStartYearSliceIndex());
  const handleNextYearsSlice = () => {
    const nextSliceStartIndex = startYearIndex === 90 ? 0 : startYearIndex + 10;
    setStartYearIndex(nextSliceStartIndex);
  };

  const handlePrevYearsSlice = () => {
    const prevSliceStartIndex = startYearIndex === 0 ? 90 : startYearIndex - 10;
    setStartYearIndex(prevSliceStartIndex);
  };
  const [selectedYear, setSelectedYear] = useState<number>(TODAY.getYear());
  const handleYearSelection = (year: number) => {
    setSelectedYear(year);
    toggleYearSelectorView();
  };

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(TODAY.getMonth());
  const handleNextMonth = () => {
    setSelectedYear(selectedMonthIndex === 12 ? selectedYear + 1 : selectedYear);
    const nextMonthIndex = selectedMonthIndex === 12 ? 1 : selectedMonthIndex + 1;

    setSelectedMonthIndex(nextMonthIndex);
  };

  const handlePrevMonth = () => {
    setSelectedYear(selectedMonthIndex === 1 ? selectedYear - 1 : selectedYear);
    const prevMonthIndex = selectedMonthIndex === 1 ? 12 : selectedMonthIndex - 1;
    setSelectedMonthIndex(prevMonthIndex);
  };

  const [daysOfMonth, setDaysOfMonth] = useState(NEPALI_CALENDAR_DATA[selectedYear - 2000][0][selectedMonthIndex - 1]);
  useEffect(() => {
    setDaysOfMonth(NEPALI_CALENDAR_DATA[selectedYear - 2000][0][selectedMonthIndex - 1]);
  }, [selectedYear, selectedMonthIndex]);
  const daysArray = Array.from({ length: daysOfMonth }, (_, index) => index + 1);

  const [selectedDay, setSelectedDay] = useState<number>(TODAY.getDayDate());
  const handleDaySelection = (day: number) => {
    setSelectedDay(day);
    selectedDate(day);
    closeCalendar();
  };

  const selectedDate = (day: number) => {
    pickedDate(`${selectedMonthIndex.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}-${selectedYear}`);
  };

  const isToday = (day: number) => {
    if (selectedYear === TODAY.getYear() && selectedMonthIndex === TODAY.getMonth() && day === TODAY.getDayDate())
      return true;
    else return false;
  };

  const monthStartDay = new NepaliDateTime(selectedYear, selectedMonthIndex).getDayIndex() - 1;

  return (
    <div className="calendar-envelope">
      <div className="year-and-setting">
        <h5 onClick={toggleYearSelectorView}>{`${selectedYear} B.S`}</h5>
        {showYearSelector && (
          <div className="year-nav">
            <LeftIcon className="left-icon" onClick={handlePrevYearsSlice} />
            <div className="year-selector">
              {yearIndex.slice(startYearIndex, startYearIndex + 10).map((year, index) => (
                <div key={index} onClick={() => handleYearSelection(year)}>
                  {year}
                </div>
              ))}
            </div>
            <RightIcon className="right-icon" onClick={handleNextYearsSlice} />
          </div>
        )}
        <SettingIcon className="setting-icon" />
      </div>

      <div className="month-and-monthNav">
        <LeftIcon className="left-icon" onClick={() => handlePrevMonth()} />
        <h5>{monthNames[selectedMonthIndex - 1]}</h5>
        <RightIcon className="right-icon" onClick={() => handleNextMonth()} />
      </div>
      <div className="day-names">
        {dayNames.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>
      <hr className="days-date-separator" />
      <div className="monthly-days-distribution">
        {Array.from({ length: monthStartDay }).map((_, index) => (
          <div key={`empty-${index}`} className="empty"></div>
        ))}
        {daysArray &&
          daysArray.length > 0 &&
          daysArray.map((day, index) => (
            <div
              className={`${isToday(day) ? "today" : ""} ${selectedDay === day ? "selected" : ""}`}
              key={index}
              onClick={() => handleDaySelection(day)}
            >
              {day}
            </div>
          ))}
      </div>
    </div>
  );
});

export default Calendar;
