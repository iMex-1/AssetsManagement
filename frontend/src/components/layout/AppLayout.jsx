import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import styles from './AppLayout.module.css'

const TITLES = {
  '/dashboard':   'Tableau de bord',
  '/articles':    'Articles',
  '/fournisseurs':'Fournisseurs',
  '/receptions':  'Réceptions',
  '/demandes':    'Demandes',
  '/affectations':'Affectations',
  '/rapports':    'Rapports',
  '/users':       'Utilisateurs',
  '/roles':       'Rôles',
  '/permissions': 'Permissions',
}

export function AppLayout() {
  const { pathname } = useLocation()
  const base = '/' + pathname.split('/')[1]
  const title = TITLES[base] ?? 'PublicAsset OS'

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Header title={title} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
