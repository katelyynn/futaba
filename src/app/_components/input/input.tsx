"use client";

import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from "./input.module.css";

type SakuraInputProps = {

} & ComponentPropsWithoutRef<"input">

export const SakuraInput = forwardRef<
  HTMLInputElement,
  SakuraInputProps
>(function SakuraInput({
  ...props
}, ref) {
  return (
    <input className={styles.input} ref={ref as React.Ref<HTMLInputElement>} {...props} />
  )
})