import { useState } from 'react'
import styles from './Alert.module.css'

export function Alert({ type = 'success', message, onDismiss }) {
  const [visible, setVisible] = useState(true)
  if (!visible || !message) return null

  const dismiss = () => { setVisible(false); onDismiss?.() }

  return (
    <div className={`${styles.alert} ${styles[type]}`} role="alert">
      <span>{message}</span>
      <button className={styles.close} onClick={dismiss} aria-label="Fermer">×</button>
    </div>
  )
}
