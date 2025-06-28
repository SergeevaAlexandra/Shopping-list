import { Link } from '@tanstack/react-router'

export function Logo() {
  return (
    <Link to="/shopping-lists" className="flex items-center">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-800 dark:text-gray-200"
      >
        <path
          d="M16 2L4 10V22L16 30L28 22V10L16 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M16 16L22 10M16 16L10 10M16 16V22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  )
}
