import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdWarning, MdInventory, MdAssignment, MdLocalShipping, MdSwapHoriz, MdBarChart } from 'react-icons/md'
import { getStats } from '../../api/stats'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Rapports.module.css'

function StatCard({ label, value, icon: Icon, variant = 'default', onClick }) {
  return (
    <div className={`${styles.statCard} ${styles[variant] ?? ''} ${onClick ? styles.clickable : ''}`} onClick={onClick}>
      {Icon && <Icon className={styles.statIcon} />}
      <span className={styles.statValue}>{value ?? '—'}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

export function Rapports() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getStats()
      .then(({ data }) => { setStats(data); setLoading(false) })
      .catch((err) => {
        setError(err.friendlyMessage ?? 'Erreur lors du chargement des statistiques.')
        setLoading(false)
      })
  }, [])

  if (loading) return <Spinner />
  if (error) return <p style={{ color: 'var(--danger)', padding: 24 }}>{error}</p>

  const { articles, demandes, receptions, affectations } = stats
  const byStatut = demandes.by_statut ?? {}
  const maxMonthly = Math.max(...(receptions.monthly ?? []).map((m) => m.count), 1)
  const topArticles = Object.entries(affectations.top_articles ?? {})

  return (
    <div className={styles.page}>
      <div className={styles.statsRow}>
        <StatCard label="Total articles" value={articles.total} icon={MdInventory} onClick={() => navigate('/articles')} />
        <StatCard label="Stock total (unités)" value={articles.total_stock_units} icon={MdInventory} variant="info" />
        <StatCard label="Articles stock bas" value={articles.low_stock?.length ?? 0} icon={MdWarning} variant={articles.low_stock?.length > 0 ? 'danger' : 'default'} onClick={() => navigate('/articles')} />
        <StatCard label="Total demandes" value={demandes.total} icon={MdAssignment} onClick={() => navigate('/demandes')} />
        <StatCard label="Taux d'approbation" value={`${demandes.approval_rate}%`} icon={MdBarChart} variant="success" />
        <StatCard label="Total réceptions" value={receptions.total} icon={MdLocalShipping} onClick={() => navigate('/receptions')} />
        <StatCard label="Total affectations" value={affectations.total} icon={MdSwapHoriz} onClick={() => navigate('/affectations')} />
      </div>

      <div className={styles.grid}>
        {/* Demandes breakdown */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Statut des demandes</h3>
          <div className={styles.statusList}>
            {[
              { key: 'En_attente', label: 'En attente', variant: 'warning', color: 'var(--warning)' },
              { key: 'Valide',     label: 'Validé',     variant: 'info',    color: 'var(--info)' },
              { key: 'Livre',      label: 'Livré',      variant: 'success', color: 'var(--success)' },
            ].map(({ key, label, variant, color }) => (
              <div key={key} className={styles.statusRow}>
                <span className={styles.statusLabel}>{label}</span>
                <div className={styles.barWrap}>
                  <div className={styles.bar} style={{
                    width: demandes.total ? `${((byStatut[key] ?? 0) / demandes.total) * 100}%` : '0%',
                    background: color,
                  }} />
                </div>
                <Badge variant={variant}>{byStatut[key] ?? 0}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Réceptions par mois */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Réceptions (6 derniers mois)</h3>
          <div className={styles.barChart}>
            {(receptions.monthly ?? []).map((m) => (
              <div key={m.label} className={styles.barCol}>
                <span className={styles.barValue}>{m.count}</span>
                <div className={styles.barOuter}>
                  <div className={styles.barInner} style={{ height: `${(m.count / maxMonthly) * 100}%` }} />
                </div>
                <span className={styles.barLabel}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top articles affectés */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Articles les plus affectés</h3>
          {topArticles.length === 0 ? (
            <p className={styles.empty}>Aucune affectation enregistrée.</p>
          ) : (
            <table className={styles.table}>
              <thead><tr><th>Article</th><th>Qté affectée</th></tr></thead>
              <tbody>
                {topArticles.map(([name, qty]) => (
                  <tr key={name}>
                    <td className={styles.name}>{name}</td>
                    <td><Badge variant="primary">{qty}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Articles stock bas */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}><MdWarning className={styles.warnIcon} /> Articles en stock bas</h3>
          {(articles.low_stock?.length ?? 0) === 0 ? (
            <p className={styles.empty}>Tous les stocks sont au-dessus du seuil.</p>
          ) : (
            <table className={styles.table}>
              <thead><tr><th>Article</th><th>Stock</th><th>Seuil</th></tr></thead>
              <tbody>
                {articles.low_stock.slice(0, 10).map((a) => (
                  <tr key={a.id} className={styles.clickableRow} onClick={() => navigate(`/articles/${a.id}`)}>
                    <td className={styles.name}>{a.designation}</td>
                    <td className={styles.stockLow}>{a.stock_actuel}</td>
                    <td className={styles.muted}>{a.seuil_alerte}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
