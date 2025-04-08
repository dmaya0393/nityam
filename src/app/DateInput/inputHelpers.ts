export const monthRange = [0, 1, 2];
export const dayDateRange = [3, 4, 5];
export const yearRange = [6, 7, 8, 9, 10];

export const getSelectionRange = (cursorPosition: number): [number, number] => {
  let range: [number, number] = [0, 0];
  if (cursorPosition >= 0 && cursorPosition <= 2) range = [0, 2];
  else if (cursorPosition >= 3 && cursorPosition <= 5) range = [3, 5];
  else if (cursorPosition >= 6 && cursorPosition <= 10) range = [6, 10];
  return range;
};

export const shiftCursor = (cursorPosition: number, shiftKey: boolean) => {
  if (shiftKey) {
    if (cursorPosition >= 6 && cursorPosition <= 10) return 4;
    else if (cursorPosition >= 3 && cursorPosition <= 5) return 1;
    else return -1;
  } else {
    if (cursorPosition <= 2) return 4;
    else if (cursorPosition >= 3 && cursorPosition <= 5) return 7;
    else return -2;
  }
};
