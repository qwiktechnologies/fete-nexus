"use client";

import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordField({
  label,
  className,
  ...inputProps
}: InputProps & { label: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const buttonId = useId();

  return (
    <label className="label">
      {label}
      <span className="relative mt-1 block">
        <input
          {...inputProps}
          type={show ? "text" : "password"}
          className={className ?? "field pr-11"}
        />
        <button
          id={buttonId}
          type="button"
          className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface-100 hover:text-navy-900"
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          onClick={() => setShow((value) => !value)}
        >
          {show ? <FiEyeOff aria-hidden /> : <FiEye aria-hidden />}
        </button>
      </span>
    </label>
  );
}