import React, { PropsWithChildren } from "react";

export interface SpinnerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoadingText: string;
  isLoading: boolean;
}

export const Spinner = ({ isLoading, className, isLoadingText, children }: PropsWithChildren<SpinnerProps>) => {
  return (
    <div className={className ?? "flex items-center"}>
      {isLoading ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mr-2 h-4 w-4 animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          {isLoadingText}
        </>
      ) : (
        children
      )}
    </div>
  );
};
