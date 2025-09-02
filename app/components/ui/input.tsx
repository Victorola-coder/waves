"use client";

import clsx from "clsx";

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={clsx(
          "w-full px-4 py-3 bg-neutral/60 border border-neutral-400/30 rounded-lg text-white placeholder-light/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 font-inter",
          error && "border-accent focus:ring-accent/50 focus:border-accent",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-accent text-sm font-inter">{error}</p>
      )}
    </div>
  );
}
