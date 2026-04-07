import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getArticles, deleteArticle } from '../../api/articles'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import { Pagination } from '../../components/ui/Pagination'
import styles from './Articles.module.css'

export function ArticleList() {
  const { hasPermission } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [flash, setFlash] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getArticles({ page, search: search || undefined, categorie: categorie || undefined })
      setData(res.data.data)
      setMeta(res.data.meta)
    } catch { /* handled by interceptor */ }
    finally { setLoading(false) }
  }, [page, search, categorie])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    try {
      await deleteArticle(deleteTarget.id)
      setFlash({ type: 'success', message: 'Article supprimé.' })
      setDeleteTarget(null)
      load()
    } catch {
      setFlash({ type: 'danger', message: 'Erreur lors de la suppression.' })
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      {flash && <Alert type={flash.type} message={flash.message} onDismiss={() => setFlash(null)} />}

      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Articles</h2>
        {hasPermission('manage_items') && (
          <Button onClick={() => navigate('/articles/create')}>+ Nouvel article</Button>
        )}
      </div>

      <div className={styles.filters}>
        <input
          className={styles.search}
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
        <select
          className={styles.filterSelect}
          value={categorie}
          onChange={(e) => { setCategorie(e.target.value); setPage(1) }}
        >
          <option value="">Toutes catégories</option>
          <option value="Materiel">Matériel</option>
          <option value="Fourniture">Fourniture</option>
        </select>
      </div>

      <div className={styles.card}>
        {loading ? <Spinner /> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Désignation</th>
                <th>Catégorie</th>
                <th>Stock actuel</th>
                <th>Seuil alerte</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={5} className={styles.empty}>Aucun article trouvé.</td></tr>
              ) : data.map((a) => (
                <tr key={a.id}>
                  <td className={styles.nameCell}>
                    {a.designation}
                    {a.stock_actuel <= a.seuil_alerte && (
                      <Badge variant="danger">Stock bas</Badge>
                    )}
                  </td>
                  <td>
                    <Badge variant={a.categorie === 'Materiel' ? 'primary' : 'accent'}>
                      {a.categorie}
                    </Badge>
                  </td>
                  <td className={a.stock_actuel <= a.seuil_alerte ? styles.stockLow : ''}>
                    {a.stock_actuel}
                  </td>
                  <td>{a.seuil_alerte}</td>
                  <td className={styles.actions}>
                    <Link to={`/articles/${a.id}`} className={styles.actionLink}>Voir</Link>
                    {hasPermission('manage_items') && (
                      <>
                        <Link to={`/articles/${a.id}/edit`} className={styles.actionLink}>Modifier</Link>
                        <button className={styles.actionDanger} onClick={() => setDeleteTarget(a)}>
                          Supprimer
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination meta={meta} onPageChange={setPage} />

      {deleteTarget && (
        <Modal
          title="Supprimer l'article"
          message={`Supprimer « ${deleteTarget.designation} » ? Cette action est irréversible.`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
