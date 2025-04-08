import { AD_To_BS_Converter, BS_To_AD_Converter } from "../converter/converter";
import { INepaliDateTime } from "../declarations";

interface DateProps {
  dayDate: number;
  month: number;
  year: number;
}

const dayNameMap: Record<number, string> = { 1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed", 5: "Thr", 6: "Fri", 7: "Sat" };

export default class NepaliDateTime implements INepaliDateTime {
  // date-related fields
  dayDate: number; // done
  dayIndex: number; //
  dayName: string;
  month: number;
  year: number;

  // time-related fields
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;

  // full date-time related
  AD: Date;

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

  /* getters and setters start */
  getDayDate(): number {
    return this.dayDate;
  }

  setDayDate(dayDate: number): void {
    this.dayDate = dayDate;
  }

  getDayIndex(): number {
    return this.dayIndex;
  }

  getDayName(): string {
    return this.dayName;
  }

  getMonth(): number {
    return this.month;
  }

  setMonth(month: number): void {
    this.month = month;
  }

  getYear(): number {
    return this.year;
  }

  setYear(year: number): void {
    this.year = year;
  }

  getHours(): number {
    return this.hours;
  }

  setHours(hours: number): void {
    this.hours = hours;
  }

  getMinutes(): number {
    return this.minutes;
  }

  setMinutes(minutes: number): void {
    this.minutes = minutes;
  }

  getSeconds(): number {
    return this.seconds;
  }

  setSeconds(seconds: number): void {
    this.seconds = seconds;
  }

  getMilliseconds(): number {
    return this.milliseconds;
  }

  setMilliseconds(milliseconds: number): void {
    this.milliseconds = milliseconds;
  }
  /* getters and setters end */

  toString(): string {
    return `${this.dayName} ${this.month} ${this.dayDate} ${this.year} ${this.hours}:${this.minutes}:${this.seconds}`;
  }

  toDateString(): string {
    return `${this.dayName} ${this.month} ${this.dayDate} ${this.year}`;
  }

  toTimeString(): string {
    return `${this.hours}:${this.minutes}:${this.seconds}`;
  }
}
