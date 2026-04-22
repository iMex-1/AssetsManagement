import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdWarning } from 'react-icons/md'
import { getArticles } from '../../api/articles'
import { getDemandes } from '../../api/demandes'
import { getReceptions } from '../../api/receptions'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Dashboard.module.css'

const STATUT_VARIANT = { En_attente: 'warning', Valide: 'info', Livre: 'success' }
const STATUT_LABEL   = { En_attente: 'En attente', Valide: 'Validé', Livre: 'Livré' }

function StatCard({ label, value, variant = 'default', onClick }) {
  return (
    <div
      className={`${styles.statCard} ${styles[variant]} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      <span className={styles.statValue}>{value ?? '—'}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [demandes, setDemandes] = useState([])
  const [receptions, setReceptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getArticles({ per_page: 200 }),
      getDemandes({ per_page: 100 }),
      getReceptions({ per_page: 100 }),
    ]).then(([a, d, r]) => {
      setArticles(a.data.data ?? [])
      setDemandes(d.data.data ?? [])
      setReceptions(r.data.data ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const lowStock = articles.filter((a) => a.categorie === 'Fourniture' && a.stock_actuel <= a.seuil_alerte)
  const demandesEnAttente = demandes.filter((d) => d.statut === 'En_attente')

  const now = new Date()
  const receptionsThisMonth = receptions.filter((r) => {
    const d = new Date(r.date_reception)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const recentDemandes = [...demandes].slice(0, 5)

  return (
    <div>
      <p className={styles.welcome}>Bonjour, <strong>{user?.nom_complet}</strong></p>

      {loading ? <Spinner /> : (
        <>
          <div className={styles.statsRow}>
            <StatCard label="Total articles" value={articles.length} onClick={() => navigate('/articles')} />
            <StatCard label="Stock bas" value={lowStock.length} variant={lowStock.length > 0 ? 'danger' : 'default'} onClick={() => navigate('/articles')} />
            <StatCard label="Demandes en attente" value={demandesEnAttente.length} variant={demandesEnAttente.length > 0 ? 'warning' : 'default'} onClick={() => navigate('/demandes?statut=En_attente')} />
            <StatCard label="Réceptions ce mois" value={receptionsThisMonth.length} variant="info" onClick={() => navigate('/receptions')} />
          </div>

          {lowStock.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}><MdWarning className={styles.warnIcon} /> Articles en stock bas</h3>
              <div className={styles.card}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>Désignation</th><th>Catégorie</th><th>Stock actuel</th><th>Seuil</th></tr>
                  </thead>
                  <tbody>
                    {lowStock.slice(0, 8).map((a) => (
                      <tr key={a.id} className={styles.clickableRow} onClick={() => navigate(`/articles/${a.id}`)}>
                        <td className={styles.name}>{a.designation}</td>
                        <td><Badge variant={a.categorie === 'Materiel' ? 'primary' : 'accent'}>{a.categorie}</Badge></td>
                        <td className={styles.stockLow}>{a.stock_actuel}</td>
                        <td className={styles.muted}>{a.seuil_alerte}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {recentDemandes.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Demandes récentes</h3>
              <div className={styles.card}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>#</th><th>Demandeur</th><th>Date</th><th>Articles</th><th>Statut</th></tr>
                  </thead>
                  <tbody>
                    {recentDemandes.map((d) => (
                      <tr key={d.id} className={styles.clickableRow} onClick={() => navigate(`/demandes/${d.id}`)}>
                        <td className={styles.muted}>#{d.id}</td>
                        <td className={styles.name}>{d.utilisateur?.nom_complet ?? '—'}</td>
                        <td className={styles.muted}>{new Date(d.date_creation).toLocaleDateString('fr-FR')}</td>
                        <td className={styles.muted}>{d.lignes?.length ?? 0}</td>
                        <td><Badge variant={STATUT_VARIANT[d.statut] ?? 'neutral'}>{STATUT_LABEL[d.statut] ?? d.statut}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
