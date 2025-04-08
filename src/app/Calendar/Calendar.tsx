import React, { useState, useEffect, forwardRef } from "react";
import SettingIcon from "../Icons/SettingIcon";
import LeftIcon from "../Icons/LeftIcon";
import RightIcon from "../Icons/RightIcon";

import NepaliDateTime from "../NepaliDateTime/NepaliDateTime";
import { NEPALI_CALENDAR_DATA } from "../converter/constants";
import { dayNames, monthNames } from "./calendarConstants";
import { CalendarProps } from "../types";

import "./calendar.css";

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

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(({ pickedDate, closeCalendar, initialDate }, ref) => {
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [startYearIndex, setStartYearIndex] = useState(initialStartYearSliceIndex());
  const [selectedYear, setSelectedYear] = useState(TODAY.getYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(TODAY.getMonth());
  const [selectedDayDate, setSelectedDayDate] = useState(TODAY.getDayDate());
  const [daysOfMonth, setDaysOfMonth] = useState(NEPALI_CALENDAR_DATA[selectedYear - 2000][0][selectedMonthIndex - 1]);

  // Adjust initial date if provided
  useEffect(() => {
    if (initialDate) {
      const [month, day, year] = initialDate.split("-").map(Number);
      if (
        !isNaN(month) &&
        !isNaN(day) &&
        !isNaN(year) &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= 31 &&
        year >= 1000 &&
        year <= 9999
      ) {
        setSelectedMonthIndex(month);
        setSelectedDayDate(day);
        setSelectedYear(year);
      }
    }
  }, [initialDate]);

  useEffect(() => {
    setDaysOfMonth(NEPALI_CALENDAR_DATA[selectedYear - 2000][0][selectedMonthIndex - 1]);
  }, [selectedYear, selectedMonthIndex]);

  const handleYearSelection = (year: number) => {
    setSelectedYear(year);
    setShowYearSelector(false);
  };

  const handleMonthChange = (isNext: boolean) => {
    const newMonthIndex = isNext ? (selectedMonthIndex % 12) + 1 : ((selectedMonthIndex - 2 + 12) % 12) + 1;
    const newYear = newMonthIndex === 1 ? selectedYear + 1 : newMonthIndex === 12 ? selectedYear - 1 : selectedYear;
    setSelectedYear(newYear);
    setSelectedMonthIndex(newMonthIndex);
  };

  const handleDayDateSelection = (day: number) => {
    setSelectedDayDate(day);
    pickedDate(`${String(selectedMonthIndex).padStart(2, "0")}-${String(day).padStart(2, "0")}-${selectedYear}`);
    closeCalendar();
  };

  const isToday = (day: number) =>
    selectedYear === TODAY.getYear() && selectedMonthIndex === TODAY.getMonth() && day === TODAY.getDayDate();

  const monthStartDay = new NepaliDateTime(selectedYear, selectedMonthIndex).getDayIndex() - 1;

  return (
    <div ref={ref} className="calendar-envelope">
      <div className="year-and-setting">
        <h5 onClick={() => setShowYearSelector((prev) => !prev)}>{`${selectedYear} B.S`}</h5>
        {showYearSelector && (
          <div className="year-nav">
            <LeftIcon
              className="left-icon"
              onClick={() => setStartYearIndex((prev) => (prev === 0 ? 90 : prev - 10))}
            />
            <div className="year-selector">
              {yearIndex.slice(startYearIndex, startYearIndex + 10).map((year, index) => (
                <div key={index} onClick={() => handleYearSelection(year)}>
                  {year}
                </div>
              ))}
            </div>
            <RightIcon
              className="right-icon"
              onClick={() => setStartYearIndex((prev) => (prev === 90 ? 0 : prev + 10))}
            />
          </div>
        )}
        <SettingIcon className="setting-icon" />
      </div>

      <div className="month-and-monthNav">
        <LeftIcon className="left-icon" onClick={() => handleMonthChange(false)} />
        <h5>{monthNames[selectedMonthIndex - 1]}</h5>
        <RightIcon className="right-icon" onClick={() => handleMonthChange(true)} />
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
        {Array.from({ length: daysOfMonth }, (_, index) => index + 1).map((day) => (
          <div
            className={`${isToday(day) ? "today" : ""} ${selectedDayDate === day ? "selected" : ""}`}
            key={day}
            onClick={() => handleDayDateSelection(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
});

export default Calendar;
