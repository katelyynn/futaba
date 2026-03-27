import React from 'react';
import styles from "./meta.module.css";
import { SakuraTooltip } from '../tooltip/tooltip';

export const META_ICON_SIZE = 12;

interface SakuraMetaProps {
  name: string,
  children: React.ReactNode
}

export function SakuraMeta({
  name,
  children
}: SakuraMetaProps) {
  return (
    <SakuraTooltip content={name}>
      <div className={styles.meta}>
        {children}
      </div>
    </SakuraTooltip>
  )
}

export function SakuraMetaList({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.list}>
      {children}
    </div>
  )
}