import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "ghost" | "outline" | "destructive" | "link";
type Size = "sm" | "default" | "lg" | "icon";

const VARIANT_STYLES: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  link: "text-primary underline-offset-4 hover:underline",
};

const SIZE_STYLES: Record<Size, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
