import { AD_To_BS_Converter, BS_To_AD_Converter } from "../converter/converter";

interface DateProps {
  dayDate: number;
  month: number;
  year: number;
}

const dayNameMap: Record<number, string> = { 1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed", 5: "Thr", 6: "Fri", 7: "Sat" };

export default class NepaliDateTime {
  // date-related fields
  private dayDate: number; // done
  private dayIndex: number; //
  private dayName: string;
  private month: number;
  private year: number;

  // time-related fields
  private hours: number;
  private minutes: number;
  private seconds: number;
  private milliseconds: number;

  // full date-time related
  private AD: Date;

  /* Constructor definitions */
  constructor();
  constructor(
    year: number,
    month: number,
    dayDate?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number
  );

  constructor(
    year?: number,
    month?: number,
    dayDate?: number,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    milliseconds: number = 0
  ) {
    if (year !== undefined && month !== undefined) {
      if (dayDate === undefined) dayDate = 1;

      const equivalentADDate = BS_To_AD_Converter(year, month, dayDate);
      if (typeof equivalentADDate === "string") {
        throw new Error("Invalid date conversion"); // Handle error appropriately
      }
      const { dayDate: convertedDayDate, month: convertedMonth, year: convertedYear } = equivalentADDate;
      const moment = new Date(convertedYear, convertedMonth - 1, convertedDayDate);

      this.year = year; // must be provided if this is case
      this.month = month; // must be provided if this is case
      this.dayDate = dayDate ?? 1; // will be 1 if not provided
      this.dayIndex = moment.getDay() + 1;
      this.hours = hours; // will be 0 if not provided
      this.minutes = minutes; // will be 0 if not provided
      this.seconds = seconds; // will be 0 if not provided
      this.milliseconds = milliseconds; // will be zero if not provided
      this.AD = moment;
    } else {
      // if no arguments, then we use the new Date() object define to get the current moment value.
      // this way, we also initialize with the time aspect as well, and so we get the time values as well as per new Date()
      const now = new Date();
      const equivalentBSDate: DateProps | string = AD_To_BS_Converter(
        now.getMonth() + 1,
        now.getDate(),
        now.getFullYear()
      );

      if (typeof equivalentBSDate === "string") {
        throw new Error("Invalid date conversion"); // Handle error appropriately
      }

      const { month, dayDate, year } = equivalentBSDate;

      this.dayDate = dayDate;
      this.dayIndex = now.getDay() + 1;
      this.month = month;
      this.year = year;

      this.hours = now.getHours();
      this.minutes = now.getMinutes();
      this.seconds = now.getSeconds();
      this.milliseconds = now.getMilliseconds();
      this.AD = now;
    }
    this.dayName = dayNameMap[this.dayIndex];
  }

  getDayDate() {
    return this.dayDate;
  }

  setDayDate(dayDate: number) {
    this.dayDate = dayDate;
  }

  getDayIndex() {
    return this.dayIndex;
  }

  getDayName() {
    return this.dayName;
  }

  getMonth() {
    return this.month;
  }

  setMonth(month: number) {
    this.month = month;
  }

  getYear() {
    return this.year;
  }

  setYear(year: number) {
    this.year = year;
  }

  getHours() {
    return this.hours;
  }

  setHours(hours: number) {
    this.hours = hours;
  }

  getMinutes() {
    return this.minutes;
  }

  setMinutes(minutes: number) {
    this.minutes = minutes;
  }

  getSeconds() {
    return this.seconds;
  }

  setSeconds(seconds: number) {
    this.seconds = seconds;
  }

  getMilliseconds() {
    return this.milliseconds;
  }

  setMilliseconds(milliseconds: number) {
    this.milliseconds = milliseconds;
  }
}
