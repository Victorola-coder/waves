import clsx from "clsx";

export default function Button(props: ButtonProps) {
  const {
    loading,
    noDefault,
    className,
    onClick,
    children,
    disabled,
    size = "default",
    variant = "default",
    ...prop
  } = props;

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={clsx(
        !noDefault &&
          "transition-all duration-300 active:scale-[0.99] px-[21px] py-[10px] font-medium text-[18px] leading-normal font-inter disabled:cursor-not-allowed disabled:bg-opacity-60 rounded-[12px]",
        {
          "px-[21px] py-[12.5px] text-[18px]": size === "default",
          "px-3 py-2 text-sm": size === "sm",
          "px-6 py-3 text-lg": size === "lg",
          "bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-primary/25":
            variant === "default",
          "bg-light text-neutral hover:bg-light-100 border border-light-200":
            variant === "secondary",
          "bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20":
            variant === "danger",
          "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-primary/25":
            variant === "primary",
          "bg-neutral text-light hover:bg-neutral-600 border border-neutral-400":
            variant === "google",
        },
        className
      )}
      arial-busy={loading?.toString()}
      {...prop}
    >
      <div className="flex items-center justify-center">
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx={12}
              cy={12}
              r={10}
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          children
        )}
      </div>
    </button>
  );
}
