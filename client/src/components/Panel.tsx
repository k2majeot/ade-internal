"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PropsWithChildren, ReactNode, HTMLAttributes } from "react";

export interface PanelProps
  extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  /** Heading text shown in the header row. */
  title?: string;
  /** Optional Lucide icon rendered left of the title. */
  icon?: LucideIcon;
  /** Slot rendered right‑aligned in the header (e.g. a button). */
  headerAction?: ReactNode;
}

/**
 * `<Panel>` — opinionated wrapper around shadcn/ui `Card`.
 * Gives every section uniform border‑radius, padding, shadow, and an
 * optional header row. Relies on the design tokens defined in
 * `index.css` (e.g. `--radius-lg`, `--color-card`).
 *
 * ```tsx
 * <Panel title="Select Client" icon={User} headerAction={<AddBtn />}>
 *   …
 * </Panel>
 * ```
 */
export default function Panel({
  title,
  icon: Icon,
  headerAction,
  className,
  children,
  ...divProps
}: PanelProps) {
  return (
    <Card
      className={cn(
        "rounded-none border-none bg-transparent shadow-none m-6 w-1/2 max-2xl:w-full p-0",
        className
      )}
      {...divProps}
    >
      {title && (
        <CardHeader className="flex flex-row items-center justify-between gap-2 p-0">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className="size-5 shrink-0 text-primary" aria-hidden />
            )}
            <CardTitle className="text-base font-semibold tracking-tight">
              {title}
            </CardTitle>
          </div>
          {headerAction}
        </CardHeader>
      )}

      <CardContent className="px-0">{children}</CardContent>
    </Card>
  );
}
