import type { CSSProperties } from "react";
import { cx } from "../../utils/classNames";
import styles from "./Skeleton.module.scss";

interface Props {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ width = "100%", height = 14, radius = 4, className, style }: Props) {
  return (
    <span
      className={cx(styles.skeleton, className)}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}
