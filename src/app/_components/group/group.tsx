import React from 'react';
import styles from "./group.module.css";
import { releaseType } from '@/app/tools/type';
import { SakuraSerif } from '../serif/serif';

interface SakuraGroupProps {
  name: string,
  children: React.ReactNode
}

export function SakuraGroup({
  name,
  children
}: SakuraGroupProps) {
  return (
    <div className={styles.group}>
      <label className={styles.label}>{releaseType(name)}</label>
      {children}
    </div>
  )
}

export function SakuraGroupList({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.list}>
      {children}
    </div>
  )
}
