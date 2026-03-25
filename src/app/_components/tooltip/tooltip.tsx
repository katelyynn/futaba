import { Tooltip } from 'radix-ui';
import styles from "./tooltip.module.css";
import React from 'react';

interface SakuraTooltipProps {
  content: React.ReactNode,
  showOnPointerOutside?: boolean,
  children: React.ReactNode
}

export function SakuraTooltip({
  content,
  showOnPointerOutside,
  children
}: SakuraTooltipProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.tooltip} onPointerDownOutside={(event) => {
            if (showOnPointerOutside) event.preventDefault();
          }}>
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}