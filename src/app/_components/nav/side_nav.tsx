import Link from 'next/link';
import styles from "./side_nav.module.css";

export function SideNav() {
  return (
    <nav className={styles.nav}>
      <Link href="/artists">artists</Link>
    </nav>
  );
}