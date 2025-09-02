"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import clsx from "clsx";

type SelectProps = {
  value?: string;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: { label: string; value: string }[];
  error?: string;
};

export default function Select({
  options,
  placeholder,
  onChange,
  className,
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "w-full px-4 py-3 bg-neutral/60 border border-neutral-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 font-inter flex items-center justify-between",
            error && "border-accent focus:ring-accent/50 focus:border-accent",
            className
          )}
        >
          <span className={selectedOption ? "text-white" : "text-light/40"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon
            className={clsx(
              "w-5 h-5 text-light/40 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-neutral border border-neutral-400/30 rounded-lg shadow-xl max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className="w-full px-4 py-3 text-left text-white hover:bg-primary/20 transition-colors duration-200 font-inter"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-accent text-sm font-inter">{error}</p>
      )}
    </div>
  );
}
