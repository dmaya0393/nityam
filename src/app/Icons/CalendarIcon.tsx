import React from "react";

// Define the props for the CalendarIcon component
interface CalendarIconProps {
  className?: string;
  toggleCalendarShow: () => void;
}

// Use React.forwardRef to forward the ref to the svg element
const CalendarIcon = React.forwardRef<SVGSVGElement, CalendarIconProps>(({ className, toggleCalendarShow }, ref) => {
  return (
    <svg
      ref={ref} // Attach the forwarded ref here
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={toggleCalendarShow}
      tabIndex={0} // Make the calendar icon focusable
    >
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5" />
    </svg>
  );
});

export default CalendarIcon;
