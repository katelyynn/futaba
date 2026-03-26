"use client";

import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from "./input.module.css";

type SakuraInputProps = {
  className?: string,
  onEnter?: (val: string) => void
} & ComponentPropsWithoutRef<"input">

export const SakuraInput = forwardRef<
  HTMLInputElement,
  SakuraInputProps
>(function SakuraInput({
  className,
  onEnter,
  ...props
}, ref) {
  return (
    <input className={`${styles.input} ${className && className}`} ref={ref as React.Ref<HTMLInputElement>} onKeyDown={(e) => {
      if (e.key == "Enter") {
        if (onEnter) onEnter(e.currentTarget.value);
      }
    }} {...props} />
  )
})