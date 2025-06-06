import React from "react";

interface NavIconProps {
  className?: string;
  onClick?: () => void;
}

const LeftIcon: React.FC<NavIconProps> = ({ className, onClick }) => {
  return (
    <svg
      width="13"
      height="13"
      fill="currentColor"
      viewBox="0 0 16 16"
      className={className}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
    >
      <path d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223" />
    </svg>
  );
};

export default LeftIcon;
