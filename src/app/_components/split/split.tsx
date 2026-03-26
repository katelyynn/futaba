import React from 'react';
import styles from "./split.module.css";

interface SakuraPageProps {
  split?: boolean,
  children: React.ReactNode
}

export function SakuraPage({
  split = false,
  children
}: SakuraPageProps) {
  return (
    <div className={`${styles.page} ${split && styles.pageSplit}`}>
      {children}
    </div>
  )
}

interface SakuraSplitProps {
  side: "left" | "right",
  children: React.ReactNode
}

export function SakuraSplit({
  side = "left",
  children
}: SakuraSplitProps) {
  return (
    <div className={`${styles.split} ${styles[side]}`}>
      {children}
    </div>
  )
}

interface SakuraSeparatorProps {
  orientation: "horizontal" | "vertical"
}

export function SakuraSeparator({
  orientation = "horizontal"
}: SakuraSeparatorProps) {
  return (
    <div className={`${styles.separator} ${styles[orientation]}`} />
  )
}