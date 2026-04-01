import { Dialog } from 'radix-ui';
import styles from "./dialog.module.css";
import React from 'react';

interface SakuraDialogProps {
  title?: string,
  content: React.ReactNode,
  children: React.ReactNode
}

export function SakuraDialog({
  title,
  content,
  children
}: SakuraDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay}>
          <Dialog.Content className={styles.dialog}>
            {title && <Dialog.Title className={styles.title}>{title}</Dialog.Title>}
            <Dialog.Description>
              {content}
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}