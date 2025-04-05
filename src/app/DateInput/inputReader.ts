export const handleMonthInput = (prevMonth: string, typedValue: string, isBackspace: boolean): string => {
  if (isBackspace) return "mm";

  const cleanPrevMonth = prevMonth === "mm" || /^[0]+$/.test(prevMonth) ? "" : prevMonth.replace(/^0+/, "");
  const rightDigits = cleanPrevMonth + typedValue;
  const paddedMonth = rightDigits.padStart(2, "0").slice(-2);

  const numericMonth = Number(paddedMonth);
  if (numericMonth < 1) return "01";
  if (numericMonth > 12) return "12";

  return paddedMonth;
};

export const handleDayDateInput = (prevDayDate: string, typedValue: string, isBackspace: boolean): string => {
  if (isBackspace) return "dd";

  const cleanPrevDay = prevDayDate === "dd" || /^[0]+$/.test(prevDayDate) ? "" : prevDayDate.replace(/^0+/, "");
  const rightDigits = cleanPrevDay + typedValue;
  const paddedDay = rightDigits.padStart(2, "0").slice(-2);

  const numericDay = Number(paddedDay);
  if (numericDay < 1) return "01";
  if (numericDay > 32) return "32";
  if (prevDayDate === "dd" && Number(typedValue) >= 4) {
    return "32";
  }

  return paddedDay;
};

export const handleYearInput = (prevYear: string, typedValue: string, isBackspace: boolean): string => {
  if (isBackspace) return "yyyy";

  const cleanPrevYear = prevYear === "yyyy" || /^[0]+$/.test(prevYear) ? "" : prevYear.replace(/^0+/, "");
  const rightDigits = cleanPrevYear + typedValue;
  return rightDigits.length === 4
    ? Number(rightDigits) < 2000
      ? "2000"
      : Number(rightDigits) > 2099
      ? "2099"
      : rightDigits
    : rightDigits.padStart(4, "0".slice(-4));
};
