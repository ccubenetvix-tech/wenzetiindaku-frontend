import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border-2 border-navy-100 dark:border-navy-800 bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-navy-400 dark:placeholder:text-navy-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy-500/30 focus-visible:ring-offset-2 focus-visible:border-navy-500 dark:focus-visible:border-navy-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl",
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
