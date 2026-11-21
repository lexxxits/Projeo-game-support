import React from 'react';

interface BatEmblemProps {
  className?: string;
}

export const BatEmblem: React.FC<BatEmblemProps> = ({ className = 'w-8 h-9' }) => {
  return (
    <svg
      viewBox="0 0 64 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shield border */}
      <path
        d="M32 3L59 13V34C59 50.5 47.4 63.2 32 69C16.6 63.2 5 50.5 5 34V13L32 3Z"
        className="fill-blue-600 stroke-blue-700 dark:fill-[#0d1422] dark:stroke-[#4b678c]"
        strokeWidth="2.2"
      />
      <path
        d="M32 7.5L54.5 16V34C54.5 48 44.8 59.1 32 64.3C19.2 59.1 9.5 48 9.5 34V16L32 7.5Z"
        className="stroke-blue-400/50 dark:stroke-[#273a54]"
        strokeWidth="1.2"
      />
      {/* Bat silhouette */}
      <path
        d="M32 45C30.4 41.2 28.1 39.2 25 39.2C22.4 39.2 20.5 40.6 19.3 42.3C18.8 39.3 17.1 36.8 13.8 35.8C12 35.2 11 33.4 12.2 30.8C13.7 27.6 17.5 25.4 22.8 25.4C24.7 25.4 26.2 26.7 27 28.4L28.7 24.4L30.3 27.4H33.7L35.3 24.4L37 28.4C37.8 26.7 39.3 25.4 41.2 25.4C46.5 25.4 50.3 27.6 51.8 30.8C53 33.4 52 35.2 50.2 35.8C46.9 36.8 45.2 39.3 44.7 42.3C43.5 40.6 41.6 39.2 39 39.2C35.9 39.2 33.6 41.2 32 45Z"
        className="fill-white dark:fill-[#cbd5e1]"
      />
    </svg>
  );
};
