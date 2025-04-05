import React, { useState, useRef } from "react";
import Calendar from "../Calendar/Calendar";
import CalendarIcon from "../Icons/CalendarIcon";

import { adjustInputDate } from "./inputValidators";
import "./dateInput.css";

interface DateInputProps {
  value?: string;
  onChange?: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarIconRef = useRef<SVGSVGElement>(null);

  // Ref to hold the current date object (no re-render on update)
  const dateObjectRef = useRef({
    month: "mm",
    dayDate: "dd",
    year: "yyyy",
  });

  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendarShow = () => {
    setShowCalendar((prev) => !prev);
  };

  const handleDatePick = (selectedDate: string) => {
    if (onChange) onChange(selectedDate);
  };

  // State to trigger re-render when input value changes
  const [inputValue, setInputValue] = useState<string>(
    `${dateObjectRef.current.month}-${dateObjectRef.current.dayDate}-${dateObjectRef.current.year}`
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let initialIndex = 0;
    let finalIndex = 0;
    const input = e.target as HTMLInputElement;
    let cursorPos = input.selectionStart ?? 0;
    console.log("Current Value:", input.value);

    const recentChar = input.value.charAt(input.value.length - 1);
    console.log("Most Recently Typed Character:", recentChar);
    console.log("Current cursor Position:", cursorPos);

    const parts = input.value.split("-");
    let [month, dayDate, year] = parts;

    const monthChar = month.length;

    if (monthChar === 1 && Number(month) > 1) {
      initialIndex = 3;
      finalIndex = 5;
    } else {
      console.log("Inside Current cursor Position:", cursorPos);
      console.log("Inside Most Recently Typed Character:", recentChar);
      month = month.padStart(2, "0");
      initialIndex = 0;
      finalIndex = 2;
      const firstDigit = month.charAt(0);
      const secondDigit = month.charAt(1);
      console.log("First digit", firstDigit);
      console.log("Second digit", secondDigit);

      console.log("From else month", month);
    }

    // if (monthChar > 1) {
    //   console.log("Month is 2 digits");
    // }
    month = month.padStart(2, "0");

    // if (Number(month) > 1) {
    //   month = month.padStart(2, "0");
    //   initialIndex = 3;
    //   finalIndex = 5;
    // }

    console.log("Month", month);

    // Update the ref directly (no re-render will occur)
    dateObjectRef.current = { month, dayDate, year };

    // Manually update the state to trigger a re-render with the updated value
    setInputValue(`${month}-${dayDate}-${year}`);
    setInputValue(dateObjectRef);

    console.log("Updated Date Object (using ref):", dateObjectRef.current);

    setTimeout(() => {
      input.setSelectionRange(initialIndex, finalIndex); // Apply the cursor selection
    }, 0);
  };

  // const handleInputFocus = (e: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
  //   const input = e.currentTarget as HTMLInputElement;
  //   setTimeout(() => {
  //     const pos = input.selectionStart ?? 0;
  //     if (!inputRef.current) return;
  //     if (pos >= 0 && pos <= 2) inputRef.current.setSelectionRange(...selectionRange("MM"));
  //     else if (pos >= 3 && pos <= 5) inputRef.current.setSelectionRange(...selectionRange("DD"));
  //     else if (pos >= 6 && pos <= 10) inputRef.current.setSelectionRange(...selectionRange("YYYY"));
  //   }, 0);
  // };

  // const selectionRange = (datePart: string): [number, number] => {
  //   if (datePart === "MM") return [0, 2];
  //   if (datePart === "DD") return [3, 5];
  //   if (datePart === "YYYY") return [6, 10];
  //   return [0, 0];
  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   const input = e.currentTarget as HTMLInputElement;
  //   const pos = input.selectionStart ?? 0;

  //   if (e.key === "Tab") {
  //     if (e.shiftKey) {
  //       if (pos >= 6 && pos <= 10) {
  //         input.setSelectionRange(...selectionRange("DD"));
  //       } else if (pos >= 3 && pos <= 5) {
  //         input.setSelectionRange(...selectionRange("MM"));
  //       }
  //     } else {
  //       // Handling Tab (move focus forward)
  //       if (pos <= 2) {
  //         input.setSelectionRange(...selectionRange("DD"));
  //       } else if (pos >= 3 && pos <= 5) {
  //         input.setSelectionRange(...selectionRange("YYYY"));
  //       } else if (pos >= 6 && pos <= 10) {
  //         if (calendarIconRef.current) {
  //           calendarIconRef.current.focus();
  //         }
  //       }
  //     }
  //     e.preventDefault();
  //   }
  // };

  return (
    <div className="date-picker-envelope">
      <div className="date-input-envelope">
        <input
          ref={inputRef}
          type="text"
          value={inputValue} // Use state value here
          onChange={handleInputChange}
          // onFocus={handleInputFocus}
          // onClick={handleInputFocus}
          // onKeyDown={handleKeyDown}
        />
        <CalendarIcon ref={calendarIconRef} className="calendar-icon" toggleCalendarShow={toggleCalendarShow} />
      </div>

      {showCalendar && <Calendar pickedDate={handleDatePick} closeCalendar={() => setShowCalendar(false)} />}
    </div>
  );
};

export default DateInput;
