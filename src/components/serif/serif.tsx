import styles from './serif.module.css';

interface SakuraSerifProps {
  children: React.ReactNode
}

export function SakuraSerif({
  children
}: SakuraSerifProps) {
  return (
    <h1 className={styles.serif}>
      {children}
    </h1>
  )
}
