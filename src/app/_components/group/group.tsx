import React from 'react';
import styles from "./group.module.css";
import { releaseType } from '@/app/tools/type';

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
      <h3 className={styles.name}>{releaseType(name)}</h3>
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