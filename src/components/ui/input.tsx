import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, ...props }, ref) => {
    const [isEditing, setIsEditing] = React.useState(false);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'number' && e.target.value === '') {
        e.target.value = '0';
      }
      onChange?.(e);
    }, [type, onChange]);

    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      if (type === 'number' && Number(value) === 0) {
        setIsEditing(true);
      }
      props.onFocus?.(e);
    }, [type, value, props.onFocus]);

    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsEditing(false);
      props.onBlur?.(e);
    }, [props.onBlur]);

    const displayValue = React.useMemo(() => {
      if (type === 'number' && isEditing && Number(value) === 0) {
        return '';
      }
      return value;
    }, [type, isEditing, value]);

    return (
      <input
        type={type}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
