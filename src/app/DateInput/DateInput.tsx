import React, { useState, useEffect, useRef } from "react";
import Calendar from "../Calendar/Calendar";
import CalendarIcon from "../Icons/CalendarIcon";

import { DateInputProps } from "../types";

import { handleMonthInput, handleDayDateInput, handleYearInput } from "./inputReader";
import { getSelectionRange, shiftCursor, monthRange, dayDateRange, yearRange } from "./inputHelpers";

import "./dateInput.css";

const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarIconRef = useRef<SVGSVGElement>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const dateObjectRef = useRef({
    month: "mm",
    dayDate: "dd",
    year: "yyyy",
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    value || `${dateObjectRef.current.month}-${dateObjectRef.current.dayDate}-${dateObjectRef.current.year}`
  );

  const toggleCalendarShow = () => {
    setShowCalendar((prev) => !prev);
  };

  const handleDatePick = (selectedDate: string) => {
    if (onChange) onChange(selectedDate);
    setInputValue(selectedDate);
    setShowCalendar(false);
  };

  const handleInputFocus = (event: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    const input = event.currentTarget as HTMLInputElement;
    setTimeout(() => {
      const pos = input.selectionStart ?? 0;
      const selectionRange = getSelectionRange(pos);
      if (!inputRef.current) return;
      inputRef.current.setSelectionRange(...selectionRange);
    }, 0);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let prevValue = inputValue.split("-");
    let [prevMonth, prevDayDate, prevYear] = prevValue;
    const cursorPos = (event.target as HTMLInputElement).selectionStart ?? 0;
    const typedValue = event.target.value.charAt(cursorPos - 1);
    const isBackspace = (event.nativeEvent as InputEvent).inputType === "deleteContentBackward";

    let selectionRange = getSelectionRange(cursorPos);
    let [month, dayDate, year] = event.target.value.split("-");

    // month value handling
    if (monthRange.includes(cursorPos)) {
      month = handleMonthInput(prevMonth, typedValue, isBackspace);
      if (!isBackspace && (Number(month) > 1 || prevMonth !== "mm")) {
        selectionRange = getSelectionRange(4);
      } else {
        selectionRange = getSelectionRange(cursorPos);
      }
      // dayDate value handling
    } else if (dayDateRange.includes(cursorPos)) {
      dayDate = handleDayDateInput(prevDayDate, typedValue, isBackspace);
      if (!isBackspace && (Number(dayDate) > 3 || prevDayDate !== "dd")) {
        selectionRange = getSelectionRange(7);
      } else {
        selectionRange = getSelectionRange(cursorPos);
      }
      // year value handling
    } else if (yearRange.includes(cursorPos)) {
      year = handleYearInput(prevYear, typedValue, isBackspace);
    }

    dateObjectRef.current = { month, dayDate, year };
    const formattedDate = `${month}-${dayDate}-${year}`;
    setInputValue(formattedDate);
    if (onChange) onChange(formattedDate);

    setTimeout(() => {
      if (inputRef.current) inputRef.current.setSelectionRange(...selectionRange);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const input = e.currentTarget as HTMLInputElement;
    const currentCursorPosition = input.selectionStart ?? 0;
    let nextCursorPosition = shiftCursor(currentCursorPosition, e.shiftKey) || 0;

    if (nextCursorPosition === -1) {
      input.blur();
      return;
    } else if (nextCursorPosition === -2) {
      if (calendarIconRef.current) {
        calendarIconRef.current.focus();
        return;
      }
    }

    setTimeout(() => {
      const selectionRange = getSelectionRange(nextCursorPosition);
      if (inputRef.current) {
        inputRef.current.setSelectionRange(...selectionRange);
      }
    }, 0);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === calendarIconRef.current && e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.setSelectionRange(6, 10);
          inputRef.current.focus();
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !calendarIconRef.current?.contains(event.target as Node)
      )
        setShowCalendar(false);
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  return (
    <div className="date-picker-envelope">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onMouseDown={handleInputFocus}
        onKeyDown={handleKeyDown}
      />
      <CalendarIcon ref={calendarIconRef} className="calendar-icon" toggleCalendarShow={toggleCalendarShow} />
      {showCalendar && (
        <Calendar
          ref={calendarRef}
          pickedDate={handleDatePick}
          closeCalendar={() => setShowCalendar(false)}
          initialDate={inputValue}
        />
      )}
    </div>
  );
};

export default DateInput;
