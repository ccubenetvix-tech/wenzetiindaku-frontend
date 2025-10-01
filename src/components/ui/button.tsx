import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-navy-500 to-navy-600 text-white hover:from-navy-600 hover:to-navy-700 shadow-lg hover:shadow-xl",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl",
        outline:
          "border-2 border-navy-500 bg-transparent text-navy-500 hover:bg-navy-500 hover:text-white shadow-lg hover:shadow-xl",
        secondary:
          "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl",
        ghost: "hover:bg-navy-50 dark:hover:bg-navy-800/50 text-navy-600 dark:text-navy-300 hover:text-navy-700 dark:hover:text-navy-200",
        link: "text-navy-500 underline-offset-4 hover:underline hover:text-navy-600",
        hero: "bg-gradient-to-r from-navy-500 via-navy-600 to-orange-500 text-white hover:from-navy-600 hover:via-navy-700 hover:to-orange-600 shadow-2xl hover:shadow-3xl font-bold transform hover:-translate-y-1",
        marketplace: "bg-gradient-to-r from-navy-500 to-navy-600 text-white hover:from-navy-600 hover:to-navy-700 border-2 border-navy-500 hover:border-navy-600 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-xl px-10 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
