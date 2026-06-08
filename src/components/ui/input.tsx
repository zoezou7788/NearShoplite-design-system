import * as React from "react";
import { cn } from "@/lib/utils";

/* =============================================================
   SEARCH BAR
============================================================= */
const SearchIcon = () => (
  <svg className="w-4 h-4 text-[var(--color-muted-foreground)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
  </svg>
);

const BarcodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="4" height="18" rx="1" />
    <rect x="9" y="3" width="2" height="18" rx="0.5" />
    <rect x="13" y="3" width="4" height="18" rx="1" />
    <rect x="19" y="3" width="2" height="18" rx="0.5" />
  </svg>
);

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  showBarcodeButton?: boolean;
  onBarcodeClick?: () => void;
}

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  ({ className, placeholder = "Search products", showBarcodeButton, onBarcodeClick, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2.5", className)} {...props}>
      <div className="flex-1 flex items-center gap-2 bg-[var(--color-input)] rounded-[var(--radius-full)] px-4 py-2.5 text-[var(--text-base)] text-[var(--color-muted-foreground)]">
        <SearchIcon />
        <span>{placeholder}</span>
      </div>
      {showBarcodeButton && (
        <button
          onClick={onBarcodeClick}
          className="w-11 h-11 bg-[var(--color-input)] rounded-[var(--radius-full)] flex items-center justify-center flex-shrink-0 cursor-pointer border-none text-[var(--color-foreground)]"
        >
          <BarcodeIcon />
        </button>
      )}
    </div>
  )
);
SearchBar.displayName = "SearchBar";

/* =============================================================
   FORM INPUT (standard bordered)
============================================================= */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[var(--text-sm)] font-semibold text-[var(--color-foreground)] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-[var(--color-surface)] border border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-md)]",
            "px-3.5 py-3 text-[var(--text-base)] text-[var(--color-foreground)] font-[var(--font-family)]",
            "transition-colors duration-[120ms]",
            "focus:outline-none focus:border-[var(--color-ring)]",
            "placeholder:text-[var(--color-muted-foreground)]",
            "disabled:bg-[var(--color-muted)] disabled:text-[var(--color-foreground-disabled)] disabled:cursor-not-allowed",
            error && "border-[var(--color-destructive)]",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-[var(--text-sm)] text-[var(--color-muted-foreground)] mt-1">{hint}</p>}
        {error && <p className="text-[var(--text-sm)] text-[var(--color-destructive)] mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

/* =============================================================
   NOTE TEXTAREA
============================================================= */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  optional?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, optional, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <p className="text-[var(--text-base)] font-semibold mb-2">
          {label}
          {optional && <span className="text-[var(--text-sm)] text-[var(--color-muted-foreground)] font-normal ml-1">(optional)</span>}
        </p>
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-[var(--color-surface)] rounded-[var(--radius-lg)]",
          "px-4 py-3.5 text-[var(--text-base)] text-[var(--color-foreground-disabled)] font-[var(--font-family)]",
          "shadow-[var(--shadow-card)] border border-[1.5px] border-transparent resize-none min-h-[72px]",
          "transition-[border-color,color] duration-[120ms]",
          "focus:outline-none focus:border-[var(--color-ring)] focus:text-[var(--color-foreground)]",
          className
        )}
        {...props}
      />
    </div>
  )
);
Textarea.displayName = "Textarea";

export { SearchBar, Input, Textarea };
