"use client";

import React from 'react';
import styles from "./setting.module.css";
import { Slider } from 'radix-ui';
import { SakuraSlider } from '../slider/slider';

type settingValue = string | number | boolean;

interface SakuraSettingProps {
  name: string,
  body?: string,
  value: settingValue,
  onChange: (v: settingValue) => void,
  min?: number,
  max?: number,
  step?: number
}

export function SakuraSetting({
  name,
  body,
  value,
  onChange,
  min = 0,
  max = 1,
  step
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

  if (typeof value == "number") {
    return (
      <div className={`${styles.setting} ${styles.settingSlider}`}>
        {settingInfo}
        <SakuraSlider value={value} min={min} max={max} step={step} onChange={value => onChange(value)} />
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