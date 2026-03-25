import React from 'react';
import styles from "./menu.module.css";
import { SakuraPopover } from '../popover/popover';

interface SakuraMenuProps {
  content: React.ReactNode,
  children: React.ReactNode
}

export function SakuraMenu({
  content,
  children
}: SakuraMenuProps) {
  return (
    <SakuraPopover className={styles.menu} content={content}>
      {children}
    </SakuraPopover>
  )
}