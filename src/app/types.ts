

export type DateInputProps = {
  value?: string;
  onChange?: (date: string) => void;
};

export type CalendarProps = {
  pickedDate: (date: string) => void;
  closeCalendar: () => void;
  initialDate?: string;
};
