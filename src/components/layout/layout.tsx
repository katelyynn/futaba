import React from 'react';
import styles from "./layout.module.css";

export function Span({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.span}>
      {children}
    </div>
  )
}

export function Column({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.column}>
      {children}
    </div>
  )
}