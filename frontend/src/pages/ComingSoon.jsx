import { useNavigate } from 'react-router-dom'
import { MdConstruction } from 'react-icons/md'
import styles from './ComingSoon.module.css'

export function ComingSoon({ title = 'Page en cours de développement' }) {
  const navigate = useNavigate()
  return (
    <div className={styles.wrap}>
      <MdConstruction className={styles.icon} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.sub}>Cette fonctionnalité sera disponible prochainement.</p>
      <button className={styles.btn} onClick={() => navigate('/dashboard')}>
        Retour au tableau de bord
      </button>
    </div>
  )
}
