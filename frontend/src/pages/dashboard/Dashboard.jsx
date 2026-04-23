import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdWarning, MdAdd } from 'react-icons/md'
import { getArticles } from '../../api/articles'
import { getDemandes } from '../../api/demandes'
import { getReceptions } from '../../api/receptions'
import { getAffectations } from '../../api/affectations'
import { getStats } from '../../api/stats'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Dashboard.module.css'

const STATUT_VARIANT = { En_attente: 'warning', Valide: 'info', Livre: 'success' }
const STATUT_LABEL   = { En_attente: 'En attente', Valide: 'Validé', Livre: 'Livré' }

const ETAT_VARIANT = { en_service: 'success', en_panne: 'danger', en_reparation: 'warning', hors_service: 'neutral' }
const ETAT_LABEL   = { en_service: 'En service', en_panne: 'En panne', en_reparation: 'En réparation', hors_service: 'Hors service' }

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

// ─── Admin dashboard ────────────────────────────────────────────────────────
function DashboardAdmin({ navigate }) {
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

  if (loading) return <Spinner />

  const lowStock = articles.filter((a) => a.categorie === 'Fourniture' && a.stock_actuel <= a.seuil_alerte)
  const demandesEnAttente = demandes.filter((d) => d.statut === 'En_attente')
  const now = new Date()
  const receptionsThisMonth = receptions.filter((r) => {
    const d = new Date(r.date_reception)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  return (
    <>
      <div className={styles.statsRow}>
        <StatCard label="Total articles" value={articles.length} onClick={() => navigate('/articles')} />
        <StatCard label="Stock bas" value={lowStock.length} variant={lowStock.length > 0 ? 'danger' : 'default'} onClick={() => navigate('/articles')} />
        <StatCard label="Demandes en attente" value={demandesEnAttente.length} variant={demandesEnAttente.length > 0 ? 'warning' : 'default'} onClick={() => navigate('/demandes')} />
        <StatCard label="Réceptions ce mois" value={receptionsThisMonth.length} variant="info" onClick={() => navigate('/receptions')} />
      </div>

      {lowStock.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}><MdWarning className={styles.warnIcon} /> Articles en stock bas</h3>
          <div className={styles.card}>
            <table className={styles.table}>
              <thead><tr><th>Désignation</th><th>Catégorie</th><th>Stock actuel</th><th>Seuil</th></tr></thead>
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

      {demandes.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Demandes récentes</h3>
          <div className={styles.card}>
            <table className={styles.table}>
              <thead><tr><th>#</th><th>Demandeur</th><th>Date</th><th>Articles</th><th>Statut</th></tr></thead>
              <tbody>
                {demandes.slice(0, 5).map((d) => (
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
  )
}

// ─── Directeur dashboard ─────────────────────────────────────────────────────
function DashboardDirecteur({ navigate }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getStats()
      .then(({ data }) => { setStats(data); setLoading(false) })
      .catch((err) => { setError(err.friendlyMessage ?? 'Erreur de chargement.'); setLoading(false) })
  }, [])

  if (loading) return <Spinner />
  if (error) return <p style={{ color: 'var(--danger)', padding: 24 }}>{error}</p>

  const enPanne = stats.affectations.par_etat?.en_panne ?? 0
  const horsService = stats.affectations.par_etat?.hors_service ?? 0

  return (
    <>
      <div className={styles.statsRow}>
        <StatCard label="Total articles" value={stats.articles.total} onClick={() => navigate('/rapports')} />
        <StatCard label="Stock total (unités)" value={stats.articles.total_stock_units} variant="info" />
        <StatCard label="Total dépenses (DH)" value={stats.finances.total_depenses.toLocaleString('fr-FR')} variant="success" onClick={() => navigate('/rapports')} />
        <StatCard label="Taux d'approbation" value={`${stats.demandes.approval_rate}%`} variant="info" />
        <StatCard label="Matériels en panne" value={enPanne} variant={enPanne > 0 ? 'danger' : 'default'} onClick={() => navigate('/rapports')} />
        <StatCard label="Hors service" value={horsService} variant={horsService > 0 ? 'warning' : 'default'} onClick={() => navigate('/rapports')} />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Rapport complet</h3>
        <p className={styles.muted} style={{ padding: '8px 0' }}>
          Consultez les statistiques détaillées, la répartition par service et l'historique des dépenses.
        </p>
        <Button onClick={() => navigate('/rapports')}>Voir les rapports</Button>
      </div>
    </>
  )
}

// ─── Chef_Service dashboard ───────────────────────────────────────────────────
function DashboardChefService({ navigate }) {
  const [demandes, setDemandes] = useState([])
  const [affectations, setAffectations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDemandes({ per_page: 50 }),
      getAffectations({ per_page: 50 }),
    ]).then(([d, a]) => {
      setDemandes(d.data.data ?? [])
      setAffectations(a.data.data ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const enAttente = demandes.filter((d) => d.statut === 'En_attente')
  const enPanne   = affectations.filter((a) => a.etat === 'en_panne' || a.etat === 'en_reparation')

  return (
    <>
      <div className={styles.statsRow}>
        <StatCard label="Mes demandes en attente" value={enAttente.length} variant={enAttente.length > 0 ? 'warning' : 'default'} onClick={() => navigate('/demandes')} />
        <StatCard label="Total mes demandes" value={demandes.length} onClick={() => navigate('/demandes')} />
        <StatCard label="Matériels affectés" value={affectations.length} onClick={() => navigate('/affectations')} />
        <StatCard label="Matériels en panne" value={enPanne.length} variant={enPanne.length > 0 ? 'danger' : 'default'} onClick={() => navigate('/affectations')} />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Mes demandes récentes</h3>
          <Button onClick={() => navigate('/demandes/create')}><MdAdd /> Nouvelle demande</Button>
        </div>
        <div className={styles.card}>
          {demandes.length === 0 ? (
            <p className={styles.empty}>Aucune demande pour le moment.</p>
          ) : (
            <table className={styles.table}>
              <thead><tr><th>#</th><th>Date</th><th>Articles</th><th>Statut</th></tr></thead>
              <tbody>
                {demandes.slice(0, 6).map((d) => (
                  <tr key={d.id} className={styles.clickableRow} onClick={() => navigate(`/demandes/${d.id}`)}>
                    <td className={styles.muted}>#{d.id}</td>
                    <td className={styles.muted}>{new Date(d.date_creation).toLocaleDateString('fr-FR')}</td>
                    <td className={styles.muted}>{d.lignes?.length ?? 0}</td>
                    <td><Badge variant={STATUT_VARIANT[d.statut] ?? 'neutral'}>{STATUT_LABEL[d.statut] ?? d.statut}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {enPanne.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}><MdWarning className={styles.warnIcon} /> Matériels en panne / réparation</h3>
          <div className={styles.card}>
            <table className={styles.table}>
              <thead><tr><th>Article</th><th>Cible</th><th>État</th></tr></thead>
              <tbody>
                {enPanne.map((a) => (
                  <tr key={a.id} className={styles.clickableRow} onClick={() => navigate(`/affectations/${a.id}`)}>
                    <td className={styles.name}>{a.article?.designation}</td>
                    <td className={styles.muted}>{a.cible ?? '—'}</td>
                    <td><Badge variant={ETAT_VARIANT[a.etat]}>{ETAT_LABEL[a.etat]}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Catalogue des articles</h3>
        <p className={styles.muted} style={{ padding: '8px 0' }}>
          Consultez les articles disponibles pour préparer vos demandes.
        </p>
        <Button variant="secondary" onClick={() => navigate('/articles')}>Consulter le catalogue</Button>
      </div>
    </>
  )
}

// ─── Root component ───────────────────────────────────────────────────────────
export function Dashboard() {
  const { user, hasRole } = useAuth()
  const navigate = useNavigate()

  return (
    <div>
      <p className={styles.welcome}>Bonjour, <strong>{user?.nom_complet}</strong></p>
      {hasRole('Chef_Service')  && <DashboardChefService navigate={navigate} />}
      {hasRole('Directeur')     && !hasRole('Admin') && <DashboardDirecteur navigate={navigate} />}
      {hasRole('Admin')         && <DashboardAdmin navigate={navigate} />}
    </div>
  )
}
