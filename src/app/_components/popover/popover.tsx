import { Popover } from 'radix-ui';
import styles from "./popover.module.css";
import React from 'react';

interface SakuraPopoverProps {
  content: React.ReactNode,
  children: React.ReactNode
}

export function SakuraPopover({
  content,
  children
}: SakuraPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.popover}>
          {content}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}