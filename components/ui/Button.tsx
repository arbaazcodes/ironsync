import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      icon,
      iconPosition = "right",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-accent text-background font-semibold hover:bg-accent-hover shadow-accent-glow hover:shadow-accent-glow-lg border border-transparent",
      secondary:
        "bg-surface-elevated text-primary border border-border hover:bg-surface-hover hover:border-border-hover shadow-card",
      outline:
        "bg-transparent text-primary border border-border hover:bg-surface hover:border-border-hover",
      ghost:
        "bg-transparent text-primary-muted hover:text-primary hover:bg-surface border border-transparent",
    };

    const sizes = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-7 py-3.5 gap-2.5 min-h-[48px]", // thumb-friendly min 48px height
    };

    const content = (
      <>
        {icon && iconPosition === "left" && (
          <span className="shrink-0 transition-transform group-hover:-translate-x-0.5">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {icon && iconPosition === "right" && (
          <span className="shrink-0 transition-transform group-hover:translate-x-0.5">
            {icon}
          </span>
        )}
      </>
    );

    const combinedClassName = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      "group",
      className
    );

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={combinedClassName}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
