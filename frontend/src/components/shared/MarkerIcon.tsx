import { memo } from 'react';
type Props = {
  number: number; // The dynamic number to display
};

const MarkerIcon = memo(({ number }: Props) => {
  return (
    <div className="relative w-8 h-8">
      <svg
        className="w-full h-full"
        viewBox="0 0 24 36"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {/* Pin Shape */}
        <path
          d="M12 0C5.373 0 0 5.373 0 12c0 7.728 12 24 12 24s12-16.272 12-24c0-6.627-5.373-12-12-12z"
          fill="#63D8DE"
        />
        {/* Outer Shadow */}
        <path
          d="M12 2C6.486 2 2 6.486 2 12c0 6.39 10 21 10 21s10-14.61 10-21C22 6.486 17.514 2 12 2z"
          fill="rgba(0,0,0,0.1)"
        />
      </svg>
      {/* Number Overlay */}
      <span className="absolute top-[2px] left-1/2 transform -translate-x-1/2 -translate-y-[2px] text-white font-bold text">
        {number}
      </span>
    </div>
  );
});

export default MarkerIcon;
