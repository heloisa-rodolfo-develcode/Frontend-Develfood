import * as React from "react";
import { cn } from "../utils/utils";



export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    return (
      <input
        type={type}
        value={value ?? ""} 
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-gray-700 focus:outline-none focus:border-secondary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);


Input.displayName = "Input";

export { Input };
