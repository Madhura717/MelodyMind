import React from "react";

export default function MascotLogo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="200" cy="200" r="120" fill="#38BDF8" />
      <path
        d="M100 200C100 144.772 144.772 100 200 100C255.228 100 300 144.772 300 200"
        stroke="#FB7185"
        strokeWidth="40"
        strokeLinecap="round"
      />
      <rect x="60" y="180" width="60" height="80" rx="30" fill="#FB7185" />
      <rect x="280" y="180" width="60" height="80" rx="30" fill="#FB7185" />
      <circle cx="160" cy="180" r="15" fill="white" />
      <circle cx="240" cy="180" r="15" fill="white" />
      <circle cx="165" cy="180" r="7" fill="black" />
      <circle cx="245" cy="180" r="7" fill="black" />
      <path d="M190 210L210 210L200 230L190 210Z" fill="#FBBF24" />
    </svg>
  );
}

