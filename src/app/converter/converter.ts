import { LEAP_YEAR_MONTHLY_DAYS_COUNT, NEPALI_CALENDAR_DATA, NON_LEAP_YEAR_MONTHLY_DAYS_COUNT } from "./constants";
import { validate_AD_Date_Input, validate_BS_Date_Input } from "./validators";

interface DateProps {
  dayDate: number;
  month: number;
  year: number;
}

const EXCLUSIVE_DAYS_OF_1943 = 104;

/* CONVERTER FOR BS DATE TO AD DATE */
export const BS_To_AD_Converter = (year: number, month: number, day: number): DateProps | string => {
  if (month === undefined || day === undefined || year === undefined) return "Invalid";
  validate_BS_Date_Input(month, day, year);
  const totalDaysTillDate = getDaysCount(month, day, year, "BS");
  return BS_DaysCount_To_AD_Date(totalDaysTillDate);
};

/*============================================================================================================================= ================================================================================================================================ ============================================================================================================================ */

/* CONVERTER FOR AD DATE TO BS DATE */
export const AD_To_BS_Converter = (month: number, day: number, year: number): DateProps | string => {
  if (month === undefined || day === undefined || year === undefined) return "Invalid";
  validate_AD_Date_Input(month, day, year);
  const totalDaysTillDate = getDaysCount(month, day, year, "AD");
  return AD_DaysCount_To_BD_Date(totalDaysTillDate);
};

/*============================================================================================================================= ================================================================================================================================ ============================================================================================================================ */

/* HELPER TO CHECK IF A YEAR IN AD IN LEAP YEAR OR NOT */
/* BS LEAP YEAR IS NOT DEALT BY THIS FUNCTION, ITS INCORPORATED IN 'AD_DaysCount_To_BD_Date' FUNCTION ITSELF  */
export const leapYearCheck = (year: number) => {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
};

/*============================================================================================================================= ================================================================================================================================ ============================================================================================================================ */

/* HELPER TO GET THE DAYS COUNT OF THE INPUT YEAR ONLY. RETURNS DAYS COUNT FROM FIRST MONTH FIRST DAY TILL THE INPUT MONTH AND DAY OF A PARTICULAR YEAR */
/* DOING SO, BECAUSE THEN WE CAN SIMPLY CALCULATE COMPLETE YEARS DATA WHEN NEEDED */
const getMonthlyOffsetDaysCountForReceivedDate = (
  month: number,
  day: number,
  year: number,
  dateType: string
): number => {
  let daysToBeExcluded = 0;
  if (dateType === "AD") {
    const monthlyDaysCountArray = leapYearCheck(year) ? LEAP_YEAR_MONTHLY_DAYS_COUNT : NON_LEAP_YEAR_MONTHLY_DAYS_COUNT;
    daysToBeExcluded = monthlyDaysCountArray[month - 1] - day;
  } else if (dateType === "BS") {
    const monthlyDaysCountArray = NEPALI_CALENDAR_DATA[year - 2000][0];
    daysToBeExcluded = monthlyDaysCountArray[month - 1] - day;
  }
  return daysToBeExcluded;
};

/*============================================================================================================================= ================================================================================================================================ ============================================================================================================================ */

/* COUNTS THE NUMBER OF DATE TILL THE STARTING OF RESPECTIVE DATE TYPE */
/* AD START: 1943 APRIL 14 | BS START: 2000 BAISAKH 01 */
const getDaysCount = (month: number, day: number, year: number, dateType: string) => {
  let daysCount = 0;

  /* DAYS COUNTER FOR INPUT OF AD DATE START */
  if (dateType === "AD") {
    const monthlyOffsetDaysCountForReceivedDate = getMonthlyOffsetDaysCountForReceivedDate(month, day, year, "AD");

    while (year >= 1943) {
      const monthlyDaysCountArray = leapYearCheck(year)
        ? LEAP_YEAR_MONTHLY_DAYS_COUNT
        : NON_LEAP_YEAR_MONTHLY_DAYS_COUNT;
      while (year >= 1943 && month > 0) {
        daysCount = daysCount + monthlyDaysCountArray[month - 1];
        month--;
      }
      month = 12;
      year--;
    }
    daysCount = daysCount - monthlyOffsetDaysCountForReceivedDate - EXCLUSIVE_DAYS_OF_1943;
  }
  /* DAYS COUNTER FOR INPUT OF AD DATE END */

  /* DAYS COUNTER FOR INPUT OF BS DATE START */
  if (dateType === "BS") {
    const monthlyOffsetDaysCountForReceivedDate = getMonthlyOffsetDaysCountForReceivedDate(month, day, year, "BS");
    while (year >= 2000) {
      const monthlyDaysCountArray = NEPALI_CALENDAR_DATA[year - 2000][0];
      while (year >= 2000 && month > 0) {
        daysCount = daysCount + monthlyDaysCountArray[month - 1];
        month--;
      }
      month = 12;
      year--;
    }
    daysCount = daysCount - monthlyOffsetDaysCountForReceivedDate;
  }
  /* DAYS COUNTER FOR INPUT OF BS DATE END */

  /* RETURNS COUNT FOR BOTH CASES AS 'daysCount' IS IN GLOBAL SCOPE HERE */
  return daysCount;
};

/*============================================================================================================================= ================================================================================================================================ ============================================================================================================================ */

/* CHANGES AD DATE'S DAYS COUNT TO BS DATE */
const AD_DaysCount_To_BD_Date = (daysCount: number): DateProps => {
  let yearIndex = 0;
  let monthIndex = 1;
  let day = 1;

  while (daysCount >= 0) {
    const monthlyDaysCountArray = NEPALI_CALENDAR_DATA[yearIndex][0];
    while (monthIndex <= 12) {
      if (daysCount >= monthlyDaysCountArray[monthIndex - 1]) {
        daysCount = daysCount - monthlyDaysCountArray[monthIndex - 1];
      } else {
        day = day + daysCount;
        daysCount = -1;
        break;
      }
      monthIndex++;
    }
    monthIndex = monthIndex % 13 || 1;
    yearIndex++;
  }

  // we add 1999 instead of 2000, because the lop will run once always and it will trigger the +1 making it 2000.
  // return `${monthIndex}-${day}-${yearIndex + 1999}`;

  return { month: monthIndex, dayDate: day, year: yearIndex + 1999 };
};

/* CHANGES BS DATE'S DAYS COUNT TO AD DATE */
const BS_DaysCount_To_AD_Date = (daysCount: number): DateProps => {
  // 13 is added to the count because we set our day as 0, which in case should be 13. its added here so the logic of while logic remains workable. removing it from here and placing as day = 13 breaks things in a way i dont understand nor can fix.
  daysCount = daysCount + 13;

  let year = 1943;
  let month = 4;
  let day = 0;
  while (daysCount >= 0) {
    const monthlyDaysCountArray = leapYearCheck(year) ? LEAP_YEAR_MONTHLY_DAYS_COUNT : NON_LEAP_YEAR_MONTHLY_DAYS_COUNT;
    while (month <= 12) {
      if (daysCount > monthlyDaysCountArray[month - 1]) {
        daysCount = daysCount - monthlyDaysCountArray[month - 1];
      } else {
        day = day + daysCount;
        daysCount = -1;
        break;
      }
      month++;
    }
    month = month % 13 || 1;
    year++;
  }
  // return `${day}-${month}-${year - 1}`;
  return { dayDate: day, month: month, year: year - 1 };
};

/*============================================================================================================================= ================================================================================================================================ ============================================================================================================================ */
