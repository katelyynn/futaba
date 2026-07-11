import React from 'react';
import styles from "./menu.module.css";
import { SakuraPopover } from '@/components/popover/popover.tsx';
import { ContextMenu } from 'radix-ui';

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

interface SakuraContextMenuProps {
  content: React.ReactNode,
  children: React.ReactNode
}

export function SakuraContextMenu({
  content,
  children
}: SakuraContextMenuProps) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className={styles.menu}>
          {content}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}
