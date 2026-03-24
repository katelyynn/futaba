"use client";

import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from "./button.module.css";
import Link from 'next/link';

type SakuraButtonProps = {
  elem: 'button' | 'link' | 'a',
  href?: string,
  primary?: boolean,
  identify?: string,
  children: React.ReactNode
} & ComponentPropsWithoutRef<"button"> & ComponentPropsWithoutRef<"a">

export const SakuraButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  SakuraButtonProps
>(function SakuraButton({
  elem = 'button',
  href,
  primary,
  identify,
  children,
  ...props
}, ref) {
  const classes = `${styles.button} ${primary && styles.primary} ${identify && styles[identify]}`;

  if (elem == 'button') {
    return (
      <button className={classes} ref={ref as React.Ref<HTMLButtonElement>} {...props}>
        {children}
      </button>
    )
  }

  if (elem == 'link') {
    return (
      <Link className={classes} href={href as string} ref={ref as React.Ref<HTMLAnchorElement>} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a className={classes} href={href as string} ref={ref as React.Ref<HTMLAnchorElement>} {...props}>
      {children}
    </a>
  )
})