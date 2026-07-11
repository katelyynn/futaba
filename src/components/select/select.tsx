"use client";

import { Select } from 'radix-ui';
import styles from "./select.module.css";
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import React from 'react';

interface SakuraSelectProps {
  value: string,
  values: Record<string, string>,
  onChange: (v: string) => void
}

export function SakuraSelect({
  value,
  values,
  onChange
}: SakuraSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className={styles.button}>
        <Select.Value className={styles.value} />
        <Select.Icon className={styles.icon}>
          <IconChevronDown size={14} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.menu}>
          <Select.Viewport>
            {Object.entries(values).map(([val, label]) => (
              <Select.Item key={val} value={val} className={styles.item}>
                <Select.ItemText className={styles.itemValue}>{label}</Select.ItemText>
                <Select.ItemIndicator className={styles.itemIcon}>
                  <IconCheck size={14} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}