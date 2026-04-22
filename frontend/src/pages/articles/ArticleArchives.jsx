import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getArchivedArticles, restoreArticle } from '../../api/articles'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import { Pagination } from '../../components/ui/Pagination'
import styles from './Articles.module.css'

export function ArticleArchives() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [restoreTarget, setRestoreTarget] = useState(null)
  const [flash, setFlash] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getArchivedArticles({ page, search: search || undefined })
      setData(res.data.data)
      setMeta(res.data.meta)
    } finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { load() }, [load])

  const handleRestore = async () => {
    try {
      await restoreArticle(restoreTarget.id)
      setFlash({ type: 'success', message: `« ${restoreTarget.designation} » restauré dans le catalogue.` })
      setRestoreTarget(null)
      load()
    } catch {
      setFlash({ type: 'danger', message: 'Erreur lors de la restauration.' })
      setRestoreTarget(null)
    }
  }

  return (
    <div>
      {flash && <Alert type={flash.type} message={flash.message} onDismiss={() => setFlash(null)} />}

      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Articles archivés</h2>
        <Button variant="secondary" onClick={() => navigate('/articles')}>← Retour au catalogue</Button>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.search}
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      <div className={styles.card}>
        {loading ? <Spinner /> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Désignation</th>
                <th>Catégorie</th>
                <th>Stock au moment de l'archivage</th>
                <th>Archivé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={5} className={styles.empty}>Aucun article archivé.</td></tr>
              ) : data.map((a) => (
                <tr key={a.id}>
                  <td className={styles.nameCell}>{a.designation}</td>
                  <td>
                    <Badge variant={a.categorie === 'Materiel' ? 'primary' : 'accent'}>
                      {a.categorie}
                    </Badge>
                  </td>
                  <td className={styles.muted}>{a.stock_actuel}</td>
                  <td className={styles.muted}>
                    {new Date(a.deleted_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.actionLink} onClick={() => setRestoreTarget(a)}>
                      Restaurer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination meta={meta} onPageChange={setPage} />

      {restoreTarget && (
        <Modal
          title="Restaurer l'article"
          message={`Remettre « ${restoreTarget.designation} » dans le catalogue actif ?`}
          confirmLabel="Restaurer"
          onConfirm={handleRestore}
          onCancel={() => setRestoreTarget(null)}
        />
      )}
    </div>
  )
}
