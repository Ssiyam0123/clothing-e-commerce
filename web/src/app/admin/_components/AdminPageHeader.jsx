"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminBackLink({ href, label = "Back", onClick, className }) {
  const content = (
    <>
      <ChevronLeft className="size-4 shrink-0" aria-hidden />
      {label}
    </>
  );

  const classes = cn(
    "mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}

export function AdminHeaderStat({ label, value, className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/50 px-5 py-3 sm:min-w-[10rem]",
        className,
      )}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  );
}

export function AdminHeaderButton({
  href,
  onClick,
  children,
  icon: Icon,
  variant = "primary",
  className,
  ...props
}) {
  const classes = cn(
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium shadow-sm transition active:scale-[0.98] sm:w-auto",
    variant === "primary" &&
      "bg-foreground text-background hover:opacity-90",
    variant === "outline" &&
      "border border-border bg-background text-foreground hover:bg-muted",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
        {children}
      </Link>
    );
  }

  return (
    <Button type="button" onClick={onClick} className={classes} {...props}>
      {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
      {children}
    </Button>
  );
}

export default function AdminPageHeader({
  title,
  highlight,
  highlightClassName = "text-primary",
  description,
  badge,
  breadcrumbs,
  actions,
  children,
  className,
}) {
  const actionSlot = children ?? actions;

  return (
    <header
      className={cn(
        "mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-2">
        {breadcrumbs?.length > 0 && (
          <nav
            className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? "font-medium text-foreground"
                        : undefined
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {badge && (
          <Badge variant="secondary" className="text-xs font-medium">
            {badge}
          </Badge>
        )}

        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
          {highlight != null && highlight !== "" && (
            <span className={cn(highlightClassName, "font-semibold")}>
              {" "}
              {highlight}
            </span>
          )}
        </h1>

        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {actionSlot && (
        <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
          {actionSlot}
        </div>
      )}
    </header>
  );
}
