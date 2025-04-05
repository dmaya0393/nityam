import { LEAP_YEAR_MONTHLY_DAYS_COUNT, NON_LEAP_YEAR_MONTHLY_DAYS_COUNT, NEPALI_CALENDAR_DATA } from "./constants";
import { leapYearCheck } from "./converter";

export const validate_BS_Date_Input = (month: number, day: number, year: number) => {
  if (year < 2000 || year > 2099)
    throw new Error("BS Year Out of bound. Valid Range is inclusively between 2000 and 2099.");
  if (month < 1 || month > 12) throw new Error("BS Month Out of bound. Month range is inclusively between 1 and 12.");
  zeroDayValidation(day);

  const monthlyDaysCountArray = NEPALI_CALENDAR_DATA[year - 2000][0];
  if (day > monthlyDaysCountArray[month - 1]) {
    throw new Error(
      `Invalid day: ${day}. The last valid day for ${month}/${year} is ${monthlyDaysCountArray[month - 1]}.`
    );
  }
};

export const validate_AD_Date_Input = (month: number, day: number, year: number) => {
  if (year < 1943 || year > 2043)
    throw new Error("AD Year Out of bound. Valid Range is inclusively between 1943 and 2043.");
  // if (month < 1 || month > 12) throw new Error("AD Month Out of bound. Month range is inclusively between 1 and 12.");

  zeroDayValidation(day);

  const monthlyDaysCountArray = leapYearCheck(year) ? LEAP_YEAR_MONTHLY_DAYS_COUNT : NON_LEAP_YEAR_MONTHLY_DAYS_COUNT;
  if (day > monthlyDaysCountArray[month - 1]) {
    throw new Error(
      `Invalid day: ${day}. The last valid day for ${month}/${year} is ${monthlyDaysCountArray[month - 1]}.`
    );
  }
};

const zeroDayValidation = (day: number) => {
  if (day < 1) throw new Error("Day date cannot be less than 1.");
};
