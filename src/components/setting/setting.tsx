import React from 'react';
import styles from "./setting.module.css";
import { SakuraSlider } from '@/components/slider/slider.tsx';
import { SakuraSelect } from '@/components/select/select.tsx';

type settingValue = string | number | boolean;

interface SakuraSettingProps<T extends settingValue> {
  type?: string,
  name: string,
  body?: string,
  value: settingValue,
  values?: Record<string, string>,
  onChange: (v: T) => void,
  min?: number,
  max?: number,
  step?: number,
  showSliderTooltipAs?: "raw" | "time" | "percent",
}

export function SakuraSetting<T extends settingValue>({
  type,
  name,
  body,
  value,
  values,
  onChange,
  min = 0,
  max = 1,
  step,
  showSliderTooltipAs = "raw"
}: SakuraSettingProps<T>) {
  const settingInfo = (
    <div className={styles.settingInfo}>
      <strong className={styles.name}>{name}</strong>
      {body && <p className={styles.body}>{body}</p>}
    </div>
  );

  if (type == "select" && values) {
    return (
      <div className={`${styles.setting} ${styles.settingSelect}`}>
        {settingInfo}
        <SakuraSelect value={value as string} values={values} onChange={onChange as (v: string) => void} />
      </div>
    )
  }

  if (typeof value == "boolean") {
    return (
      <div className={`${styles.setting} ${styles.settingToggle}`} onClick={() => (onChange as (v: boolean) => void)(!value)}>
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
        <SakuraSlider className={styles.slider} value={value} min={min} max={max} step={step} onChange={value => (onChange as (v: number) => void)(value)} showTooltipAs={showSliderTooltipAs} />
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
