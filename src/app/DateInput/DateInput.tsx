import React, { useState, useEffect, useRef } from "react";
import Calendar from "../Calendar/Calendar";
import CalendarIcon from "../Icons/CalendarIcon";

import { handleMonthInput, handleDayDateInput, handleYearInput } from "./inputReader";

import "./dateInput.css";

interface DateInputProps {
  value?: string;
  onChange?: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarIconRef = useRef<SVGSVGElement>(null);
  console.log("Calendar Icon Ref", calendarIconRef.current);

  const dateObjectRef = useRef({
    month: "mm",
    dayDate: "dd",
    year: "yyyy",
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    `${dateObjectRef.current.month}-${dateObjectRef.current.dayDate}-${dateObjectRef.current.year}`
  );

  const toggleCalendarShow = () => {
    setShowCalendar((prev) => !prev);
  };

  const handleDatePick = (selectedDate: string) => {
    if (onChange) onChange(selectedDate);
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

  const getSelectionRange = (cursorPosition: number): [number, number] => {
    let range: [number, number] = [0, 0];
    if (cursorPosition >= 0 && cursorPosition <= 2) range = [0, 2];
    else if (cursorPosition >= 3 && cursorPosition <= 5) range = [3, 5];
    else if (cursorPosition >= 6 && cursorPosition <= 10) range = [6, 10];

    return range;
  };

  const monthRange = [0, 1, 2];
  const dayDateRange = [3, 4, 5];
  const yearRange = [6, 7, 8, 9, 10];

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
    setInputValue(`${month}-${dayDate}-${year}`);
    if (onChange) onChange(`${month}-${dayDate}-${year}`);

    setTimeout(() => {
      if (inputRef.current) inputRef.current.setSelectionRange(...selectionRange);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget as HTMLInputElement;
    const pos = input.selectionStart ?? 0;
    let shiftCursor = 0;

    if (e.key === "Tab") {
      e.preventDefault();

      if (e.shiftKey) {
        if (pos >= 6 && pos <= 10) shiftCursor = 4;
        else if (pos >= 3 && pos <= 5) shiftCursor = 1;
        else if (pos >= 0 && pos <= 2) {
          // do something here
          input.blur(); // Remove focus from current input
          return;
        }
      } else {
        // Normal tab behavior (move focus forward)
        if (pos <= 2) shiftCursor = 4;
        else if (pos >= 3 && pos <= 5) shiftCursor = 7;
        else if (pos >= 6 && pos <= 10) {
          if (calendarIconRef.current) {
            calendarIconRef.current.focus();
            return;
          }
        }
      }

      // Update the selection range based on the shifted cursor position
      setTimeout(() => {
        const selectionRange = getSelectionRange(shiftCursor);
        if (inputRef.current) {
          inputRef.current.setSelectionRange(...selectionRange);
        }
      }, 0);
    }
  };

  useEffect(() => {
    console.log("Global Thing");
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === calendarIconRef.current && e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.setSelectionRange(6, 10);
          inputRef.current.focus();
        }
      }
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className="date-picker-envelope">
      <div className="date-input-envelope">
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
      </div>

      {showCalendar && <Calendar pickedDate={handleDatePick} closeCalendar={() => setShowCalendar(false)} />}
    </div>
  );
};

export default DateInput;
