import { forwardRef } from "react";
import { cx } from "../../utils/classNames";
import styles from "./Button.module.scss";
import type { ButtonProps } from "./types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "md",
    leadingIcon,
    className,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.btn, styles[variant], styles[size], className)}
      {...rest}
    >
      {leadingIcon ? <span className={styles.icon}>{leadingIcon}</span> : null}
      {children}
    </button>
  );
});
