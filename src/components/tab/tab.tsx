import styles from "./tab.module.css";

interface TabsProps {
  center?: boolean,
  children: React.ReactNode
}

export function Tabs({
  center = true,
  children
}: TabsProps) {
  return (
    <nav className={`${styles.nav} ${center ? styles.center : ''}`}>
      <ul className={styles.list}>
        {children}
      </ul>
    </nav>
  );
}

interface SakuraTopProps {
  children: React.ReactNode
}

export function SakuraTop({
  children
}: SakuraTopProps) {
  return (
    <div className={styles.top}>
      {children}
    </div>
  )
}

interface SakuraTopItemProps {
  label: string,
  children: React.ReactNode
}

export function SakuraTopItem({
  label,
  children
}: SakuraTopItemProps) {
  return (
    <div className={styles.item}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inner}>
        {children}
      </div>
    </div>
  )
}
