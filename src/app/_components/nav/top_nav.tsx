import Link from 'next/link';
import styles from "./top_nav.module.css";

export function TopNav() {
  return (
    <nav className={styles.nav}>
      <Link href="/">futaba</Link>
    </nav>
  );
}