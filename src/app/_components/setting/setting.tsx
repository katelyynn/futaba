"use client";

import React from 'react';
import styles from "./setting.module.css";

type settingValue = string | number | boolean;

interface SakuraSettingProps {
  name: string,
  body?: string,
  value: settingValue,
  onChange: (v: settingValue) => void
}

export function SakuraSetting({
  name,
  body,
  value,
  onChange
}: SakuraSettingProps) {
  const settingInfo = (
    <div className={styles.settingInfo}>
      <strong className={styles.name}>{name}</strong>
      {body && <p className={styles.body}>{body}</p>}
    </div>
  );

  if (typeof value == "boolean") {
    return (
      <div className={`${styles.setting} ${styles.settingToggle}`} onClick={() => onChange(!value)}>
        {settingInfo}
        <div className={`${styles.toggle} ${value && styles.primary}`}>
          <div className={styles.toggleDot} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.setting}>
      <p>{typeof value} not implemented</p>
    </div>
  )
}

export function SakuraSettingGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.group}>
      {children}
    </div>
  )
}