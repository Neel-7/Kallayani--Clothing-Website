import type { SVGProps } from "react";

type MotifProps = SVGProps<SVGSVGElement> & { cutout?: string };

export function LotusMark({ className = "", cutout = "#fff", ...props }: MotifProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="80" cy="8" r="3.5" fill="currentColor" />
      <circle cx="70" cy="17" r="3.25" fill="currentColor" />
      <circle cx="90" cy="17" r="3.25" fill="currentColor" />
      <path d="M80 27C66 43 63 65 80 84C97 65 94 43 80 27Z" fill="currentColor" />
      <path d="M80 45C70 58 69 71 80 84C91 71 90 58 80 45Z" fill={cutout} />
      <path d="M80 53C74 64 74 73 80 83C86 73 86 64 80 53Z" fill="currentColor" />
      <path d="M62 33C50 50 52 72 77 85C67 67 69 48 62 33Z" fill="currentColor" />
      <path d="M98 33C110 50 108 72 83 85C93 67 91 48 98 33Z" fill="currentColor" />
      <path d="M45 43C44 63 54 79 77 86C62 75 61 56 45 43Z" fill="currentColor" />
      <path d="M115 43C116 63 106 79 83 86C98 75 99 56 115 43Z" fill="currentColor" />
      <path
        d="M79 86C59 92 45 85 31 73C22 66 14 65 8 70C18 62 28 66 37 74C50 86 64 89 79 86Z"
        fill="currentColor"
      />
      <path
        d="M81 86C101 92 115 85 129 73C138 66 146 65 152 70C142 62 132 66 123 74C110 86 96 89 81 86Z"
        fill="currentColor"
      />
      <path
        d="M79 89C57 100 37 83 20 83C11 83 5 87 2 93C11 86 19 89 30 94C49 103 65 99 79 89Z"
        fill="currentColor"
      />
      <path
        d="M81 89C103 100 123 83 140 83C149 83 155 87 158 93C149 86 141 89 130 94C111 103 95 99 81 89Z"
        fill="currentColor"
      />
      <path d="M80 87L89 99L80 113L71 99L80 87Z" fill="currentColor" />
    </svg>
  );
}
