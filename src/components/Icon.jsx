// Ikonsæt som inline SVG. Ét fælles udtryk: 24x24, streg på 1.8, runde ender.
// Ingen ikonpakke som afhængighed — og de arver farve fra teksten omkring dem.

const PATHS = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  grammar: (
    <>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v14H5.5A1.5 1.5 0 0 0 4 18.5z" />
      <path d="M4 18.5A1.5 1.5 0 0 1 5.5 17H19v4H5.5A1.5 1.5 0 0 1 4 19.5z" />
      <path d="M9 7.5h6M9 11h4" />
    </>
  ),
  dictation: (
    <>
      <path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  scenarios: (
    <>
      <path d="M21 12a8 8 0 0 1-8 8H4l2.2-2.9A8 8 0 1 1 21 12z" />
      <path d="M9 11h6M9 14.5h3.5" />
    </>
  ),
  progress: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 17v-4M12.5 17V8M17 17v-6" />
    </>
  ),
  plan: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3 10h18M8.5 14.5l2 2 4.5-4.5" />
    </>
  ),
  heart: <path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.8c0 5.8-8.5 11.3-8.5 11.3z" fill="currentColor" stroke="none" />,
  crown: <path d="M4 18h16l1.5-9-5 3.5L12 5 7.5 12.5 2.5 9z" />,
  flame: <path d="M12 3s5 4.2 5 9a5 5 0 0 1-10 0c0-1.7.8-3 1.6-3.9.3 1.4 1.1 2 1.9 2 .9 0 1.5-.8 1.5-2.3 0-2-1-3.4-1-4.8z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  play: <path d="M7 4.5v15l13-7.5z" />,
  volume: (
    <>
      <path d="M5 9.5h3.5L13 5.5v13L8.5 14.5H5z" />
      <path d="M16.5 9a4.5 4.5 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M8 8h8M8 12h5" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 17h6M10 20.5h4" />
      <path d="M12 2.5a6 6 0 0 1 3.6 10.8c-.6.5-.9 1-.9 1.7H9.3c0-.7-.3-1.2-.9-1.7A6 6 0 0 1 12 2.5z" />
    </>
  ),
  quote: <path d="M9.5 6C6.5 7 5 9.3 5 12.5V18h5.5v-5.5H8c0-2 .6-3.4 2.5-4.2zm9 0c-3 1-4.5 3.3-4.5 6.5V18H19.5v-5.5H17c0-2 .6-3.4 2.5-4.2z" />,
  arrow: <path d="M5 12h13m-5.5-6 6 6-6 6" />,
  back: <path d="M19 12H6m5.5-6-6 6 6 6" />,
  refresh: (
    <>
      <path d="M20 11a8 8 0 1 0-.7 4.5" />
      <path d="M20 5.5V11h-5.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 6.5h15M9.5 6.5V4.5h5v2M6.5 6.5 7.5 20h9l1-13.5" />
      <path d="M10.5 10v6M13.5 10v6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
  shield: (
    <>
      <path d="M12 3 19.5 6v6c0 5-3.2 8.3-7.5 9.5C7.7 20.3 4.5 17 4.5 12V6z" />
      <path d="M9 12.2l2 2 4-4.2" />
    </>
  ),
  keyboard: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <path d="M7 10h.01M11 10h.01M15 10h.01M8 14h8" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 4.5-9 4.5-9-4.5z" />
      <path d="m3.5 12.5 8.5 4.2 8.5-4.2" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </>
  ),
  spark: <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />,
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  bolt: <path d="M13.5 3 5.5 13.5H11l-.5 7.5 8-10.5H13z" />,
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M4.5 12H2.1M21.9 12h-2.4M6.7 6.7 5 5M19 19l-1.7-1.7M6.7 17.3 5 19M19 5l-1.7 1.7" />
    </>
  ),
  skip: <path d="M5 5.5v13l9-6.5zM16.5 5.5v13" />,
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.8, ...rest }) {
  const path = PATHS[name]
  if (!path) return null
  return (
    <svg
      className={'icon ' + className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {path}
    </svg>
  )
}
