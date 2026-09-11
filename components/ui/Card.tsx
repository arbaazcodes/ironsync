import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "flat";
  padding?: "none" | "sm" | "md" | "lg";
  hoverEffect?: boolean;
}

export function Card({
  className,
  variant = "default",
  padding = "md",
  hoverEffect = false,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-surface border border-border shadow-card",
    elevated: "bg-surface-elevated border border-border shadow-card",
    interactive:
      "bg-surface border border-border hover:border-accent/40 hover:bg-surface-hover hover:shadow-card-hover transition-all duration-300",
    flat: "bg-surface-subtle border border-border-subtle",
  };

  const paddings = {
    none: "",
    sm: "p-4 sm:p-5",
    md: "p-6 sm:p-7",
    lg: "p-8 sm:p-10",
  };

  return (
    <div
      className={cn(
        "rounded-[24px] relative overflow-hidden",
        variants[variant],
        paddings[padding],
        hoverEffect && "hover:border-accent/40 hover:shadow-card-hover transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

}
