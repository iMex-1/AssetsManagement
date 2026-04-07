import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import styles from './Header.module.css'

export function Header({ title }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <button className={styles.logoutBtn} onClick={handleLogout}>
        Déconnexion
      </button>
    </header>
  )
}
