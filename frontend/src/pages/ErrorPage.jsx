import { useRouteError, useNavigate } from 'react-router-dom'
import { MdErrorOutline, MdSearchOff } from 'react-icons/md'
import styles from './ErrorPage.module.css'

export function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()
  const is404 = error?.status === 404

  return (
    <div className={styles.wrap}>
      {is404
        ? <MdSearchOff className={styles.icon} />
        : <MdErrorOutline className={styles.icon} />}
      <div className={styles.code}>{is404 ? '404' : 'Erreur'}</div>
      <h2 className={styles.title}>
        {is404 ? 'Page introuvable' : 'Une erreur est survenue'}
      </h2>
      <p className={styles.sub}>
        {is404
          ? "La page que vous cherchez n'existe pas."
          : (error?.statusText || error?.message || 'Erreur inattendue.')}
      </p>
      <button className={styles.btn} onClick={() => navigate('/dashboard')}>
        Retour au tableau de bord
      </button>
    </div>
  )
}
