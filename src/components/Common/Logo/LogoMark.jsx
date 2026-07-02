export default function LogoMark({ size = 40, className, title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#FDFCFA" />
      <rect x="1" y="1" width="38" height="38" rx="11" stroke="#C9E6DA" strokeWidth="1" />
      <ellipse cx="20" cy="30.5" rx="9.5" ry="1.8" fill="#2A2422" fillOpacity="0.07" />
      <path
        d="M14.2 22.8L11.2 33.2L15.4 33.2L17.2 26.8Z"
        fill="#9E1F42"
      />
      <path
        d="M25.8 22.8L28.8 33.2L24.6 33.2L22.8 26.8Z"
        fill="#9E1F42"
      />
      <path
        d="M20 23.8C14.2 23.8 10.8 19.4 12.2 15.8C13.4 13.2 16.8 13.4 20 16.6C23.2 13.4 26.6 13.2 27.8 15.8C29.2 19.4 25.8 23.8 20 23.8Z"
        fill="#B3244B"
      />
      <path
        d="M20 23.8C14.2 23.8 10.8 19.4 12.2 15.8C13.4 13.2 16.8 13.4 20 16.6V23.8Z"
        fill="#C9355F"
        fillOpacity="0.45"
      />
      <circle cx="20" cy="22.2" r="3.6" fill="#9E1F42" />
      <circle cx="20" cy="21.8" r="2.2" fill="#B3244B" />
      <path
        d="M20 9.8C18.1 11.2 18.1 13.4 20 14.3C21.9 13.4 21.9 11.2 20 9.8Z"
        fill="#7FA896"
      />
    </svg>
  );
}
