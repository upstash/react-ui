import type { PropsWithChildren } from "react"

export interface SpinnerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoadingText: string
  isLoading: boolean
}

export const Spinner = ({
  isLoading,
  className,
  isLoadingText,
  children,
}: PropsWithChildren<SpinnerProps>) => {
  return (
    <div className={className ?? "flex items-center"}>
      {isLoading ? (
        <>
          {isLoadingText}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 h-4 w-4 animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </>
      ) : (
        children
      )}
    </div>
  )
}
