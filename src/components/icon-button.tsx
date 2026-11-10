"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  tone?: "default" | "danger";
  children: ReactNode;
};

const tones = {
  default:
    "text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900",
  danger: "text-[#9b1c1c] hover:bg-[#fdeceb]",
};

export function IconButton({
  label,
  tone = "default",
  className,
  children,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-transparent transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${tones[tone]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true" fill="none">
      <path
        d="M10 4.5v11M4.5 10h11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true" fill="none">
      <path
        d="M11.5 4.5 15.5 8.5M3.5 16.5l.8-3.2L13.2 4.4a1.4 1.4 0 0 1 2 0l.4.4a1.4 1.4 0 0 1 0 2L6.7 15.7l-3.2.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true" fill="none">
      <path
        d="M4.5 6.5h11M8 6.5V4.8c0-.4.3-.8.8-.8h2.4c.4 0 .8.4.8.8v1.7M6.2 6.5l.6 9c0 .5.4.9.9.9h4.6c.5 0 .9-.4.9-.9l.6-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
