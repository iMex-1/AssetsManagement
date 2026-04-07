import styles from './Badge.module.css'

export function Badge({ variant = 'neutral', children }) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
}
