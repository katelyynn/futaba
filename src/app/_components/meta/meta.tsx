import React from 'react';
import styles from "./meta.module.css";
import { SakuraTooltip } from '../tooltip/tooltip';

export const META_ICON_SIZE = 12;
export const META_ICON_SIZE_BIG = 16;

interface SakuraMetaProps {
  name: string,
  small?: boolean,
  children: React.ReactNode
}

export function SakuraMeta({
  name,
  small = true,
  children
}: SakuraMetaProps) {
  if (!small) {
    return (
      <div className={`${styles.meta}`}>
        {children}
      </div>
    )
  }

  return (
    <SakuraTooltip content={name}>
      <div className={`${styles.meta} ${styles.small}`}>
        {children}
      </div>
    </SakuraTooltip>
  )
}

interface SakuraMetaLabelProps {
  children: React.ReactNode
}

export function SakuraMetaLabel({
  children
}: SakuraMetaLabelProps) {
  return (
    <label className={styles.label}>
      {children}
    </label>
  )
}

interface SakuraMetaListProps {
  space?: boolean,
  children: React.ReactNode
}

export function SakuraMetaList({
  space = false,
  children
}: SakuraMetaListProps) {
  return (
    <div className={`${styles.list} ${space ? styles.space : ''}`}>
      {children}
    </div>
  )
}
