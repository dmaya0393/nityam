export interface INepaliDateTime {
  readonly dayDate: number;
  readonly dayIndex: number;
  readonly dayName: string;
  readonly month: number;
  readonly year: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly milliseconds: number;
  readonly AD: Date;

  getDayDate(): number;
  setDayDate(dayDate: number): void;
  getDayIndex(): number;
  getDayName(): string;
  getMonth(): number;
  setMonth(month: number): void;
  getYear(): number;
  setYear(year: number): void;
  getHours(): number;
  setHours(hours: number): void;
  getMinutes(): number;
  setMinutes(minutes: number): void;
  getSeconds(): number;
  setSeconds(seconds: number): void;
  getMilliseconds(): number;
  setMilliseconds(milliseconds: number): void;
  toString(): string;
  toDateString(): string;
  toTimeString(): string;
}
