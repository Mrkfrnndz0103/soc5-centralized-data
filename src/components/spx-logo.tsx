export function SpxLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="20" fill="#FF6B00" />
      <path
        d="M25 35C25 32 27 30 30 30H45C48 30 50 32 50 35C50 38 48 40 45 40H35V45H43C48 45 52 49 52 54C52 59 48 63 43 63H30C27 63 25 61 25 58V35Z"
        fill="white"
      />
      <path
        d="M55 30H65L75 45L65 60H55L65 45L55 30Z"
        fill="white"
      />
      <circle cx="82" cy="52" r="8" fill="white" />
    </svg>
  )
}
