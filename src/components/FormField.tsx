import type { ReactNode } from "react";
import { cx } from "@/lib/classes";

type FormLabelTone = "default" | "muted";

type FormLabelProps = {
  children: ReactNode;
  className?: string;
  htmlFor?: string;
  tone?: FormLabelTone;
};

type FormFieldProps = {
  children: ReactNode;
  className?: string;
  htmlFor?: string;
  label: ReactNode;
  labelClassName?: string;
  labelTone?: FormLabelTone;
};

const LABEL_TONE_CLASSES: Record<FormLabelTone, string> = {
  default: "block text-sm font-semibold text-stone-700 dark:text-stone-300",
  muted:
    "text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400",
};

export function FormLabel({
  children,
  className,
  htmlFor,
  tone = "default",
}: FormLabelProps) {
  const sharedClassName = cx(LABEL_TONE_CLASSES[tone], className);

  if (!htmlFor) {
    return <span className={sharedClassName}>{children}</span>;
  }

  return (
    <label htmlFor={htmlFor} className={sharedClassName}>
      {children}
    </label>
  );
}

export function FormField({
  children,
  className,
  htmlFor,
  label,
  labelClassName,
  labelTone = "default",
}: FormFieldProps) {
  return (
    <div className={cx("space-y-2", className)}>
      <FormLabel
        htmlFor={htmlFor}
        tone={labelTone}
        className={labelClassName}
      >
        {label}
      </FormLabel>
      {children}
    </div>
  );
}
