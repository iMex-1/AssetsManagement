import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdWarning } from 'react-icons/md'
import { getArticles } from '../../api/articles'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Dashboard.module.css'

function StatCard({ label, value, variant = 'default', onClick }) {
  return (
    <div className={`${styles.statCard} ${styles[variant]} ${onClick ? styles.clickable : ''}`} onClick={onClick}>
      <span className={styles.statValue}>{value ?? '—'}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getArticles({ per_page: 100 }).then(({ data }) => {
      setArticles(data.data ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const lowStock = articles.filter((a) => a.stock_actuel <= a.seuil_alerte)
  const materiel = articles.filter((a) => a.categorie === 'Materiel')
  const fourniture = articles.filter((a) => a.categorie === 'Fourniture')

  return (
    <div>
      <p className={styles.welcome}>Bonjour, <strong>{user?.nom_complet}</strong></p>

      {loading ? <Spinner /> : (
        <>
          <div className={styles.statsRow}>
            <StatCard label="Total articles" value={articles.length} onClick={() => navigate('/articles')} />
            <StatCard label="Matériel" value={materiel.length} variant="info" onClick={() => navigate('/articles?categorie=Materiel')} />
            <StatCard label="Fournitures" value={fourniture.length} variant="accent" onClick={() => navigate('/articles?categorie=Fourniture')} />
            <StatCard label="Stock bas" value={lowStock.length} variant={lowStock.length > 0 ? 'danger' : 'default'} onClick={() => navigate('/articles')} />
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
        </>
      )}
    </div>
  )
}
