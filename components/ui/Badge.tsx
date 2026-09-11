import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline" | "subtle";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-surface-elevated text-primary-muted border border-border",
    accent: "bg-accent-muted text-accent border border-accent/25 font-semibold",
    outline: "bg-transparent text-primary-muted border border-border",
    subtle: "bg-white/[0.04] text-primary-muted border border-white/[0.06]",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 tracking-wider uppercase font-medium",
    md: "text-xs px-2.5 py-1 tracking-wide uppercase font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant === "accent" ? "bg-accent animate-pulse-subtle" : "bg-primary-dim"
          )}
        />
      )}
      {children}
    </span>
  );
}
