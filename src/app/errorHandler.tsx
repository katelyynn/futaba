import { Column, Span } from './_components/layout/layout';
import styles from './errorHandler.module.css';

export function ErrorHandler({ error }: { error: Error | string }) {
  const text = (error instanceof Error) ? error.message : error;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.face}>(,,{'>'}﹏{'<'},,)</h1>
      <h2 className={styles.text}>{text}</h2>
    </div>
  )
}
