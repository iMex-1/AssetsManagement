import { NavLink } from 'react-router-dom'
import {
  MdDashboard, MdInventory, MdPeople, MdAssignment,
  MdLocalShipping, MdSwapHoriz, MdSecurity, MdPerson,
  MdShield, MdKey, MdStorefront, MdBarChart,
} from 'react-icons/md'
import { useAuth } from '../../hooks/useAuth'
import styles from './Sidebar.module.css'

const NAV = [
  { label: 'Tableau de bord', to: '/dashboard',    roles: null,                       icon: MdDashboard },
  { type: 'section', label: 'Catalogue',            roles: ['Admin'] },
  { label: 'Articles',        to: '/articles',      roles: ['Admin'],                  icon: MdInventory },
  { label: 'Fournisseurs',    to: '/fournisseurs',  roles: ['Admin'],                  icon: MdStorefront },
  { label: 'Réceptions',      to: '/receptions',    roles: ['Admin'],                  icon: MdLocalShipping },
  { type: 'section', label: 'Opérations',           roles: null },
  { label: 'Demandes',        to: '/demandes',      roles: null,                       icon: MdAssignment },
  { label: 'Affectations',    to: '/affectations',  roles: ['Admin'],                  icon: MdSwapHoriz },
  { type: 'section', label: 'Rapports',             roles: ['Admin', 'Directeur'] },
  { label: 'Rapports',        to: '/rapports',      roles: ['Admin', 'Directeur'],      icon: MdBarChart },
  { type: 'section', label: 'Administration',       roles: ['Admin'] },
  { label: 'Utilisateurs',    to: '/users',         roles: ['Admin'],                  icon: MdPeople },
  { label: 'Rôles',           to: '/roles',         roles: ['Admin'],                  icon: MdShield },
  { label: 'Permissions',     to: '/permissions',   roles: ['Admin'],                  icon: MdKey },
]

export function Sidebar() {
  const { user, hasRole } = useAuth()

  const canSee = (item) => {
    if (!item.roles) return true
    return item.roles.some((r) => hasRole(r))
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <MdSecurity className={styles.logoIcon} />
        <span className={styles.logoText}>PublicAsset OS</span>
      </div>

      <nav className={styles.nav}>
        {NAV.map((item, i) => {
          if (!canSee(item)) return null
          if (item.type === 'section') {
            return <p key={i} className={styles.section}>{item.label}</p>
          }
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              {Icon && <Icon className={styles.linkIcon} />}
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <MdPerson size={18} />
        </div>
        <div className={styles.userMeta}>
          <span className={styles.userName}>{user?.nom_complet}</span>
          <span className={styles.userRole}>{user?.roles?.[0] ?? '—'}</span>
        </div>
      </div>
    </aside>
  )
}
