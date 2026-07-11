import styles from "./tab.module.css";

interface TabsProps {
  children: React.ReactNode
}

export function Tabs({
  children
}: TabsProps) {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {children}
      </ul>
    </nav>
  );
}
