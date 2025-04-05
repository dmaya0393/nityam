import { NEPALI_CALENDAR_DATA } from "../converter/constants";

export const adjustInputDate = (dateObject: { month: string; dayDate: string; year: string }) => {
  console.log("Here to validate the date.");

  let month: number = Number(dateObject.month);
  let dayDate: number = Number(dateObject.dayDate);
  let year: number = Number(dateObject.year);

  if (year < 2000) year = 2000;
  if (year > 2099) year = 2099;
  if (month < 1) month = 1;
  if (month > 12) month = 12;
  if (dayDate < 1) dayDate = 1;
  const monthLastDayDate = adjustLastDayOfMonth(month, year);
  if (dayDate > monthLastDayDate) dayDate = monthLastDayDate;

  console.log("Refined Date:", month, dayDate, year);
};



const adjustLastDayOfMonth = (month: number, year: number): number => {
  const yearIndex = year - 2000;
  const monthIndex = month - 1; // Adjust for 0-based index
  const daysInMonth = NEPALI_CALENDAR_DATA[yearIndex][0][monthIndex];
  return daysInMonth;
};
