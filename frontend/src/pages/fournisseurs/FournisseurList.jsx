import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFournisseurs, deleteFournisseur } from '../../api/fournisseurs'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import { Pagination } from '../../components/ui/Pagination'
import styles from './Fournisseurs.module.css'

export function FournisseurList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [flash, setFlash] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getFournisseurs({ page })
      setData(res.data.data)
      setMeta(res.data.meta)
    } finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    try {
      await deleteFournisseur(deleteTarget.id)
      setFlash({ type: 'success', message: 'Fournisseur supprimé.' })
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
        <h2 className={styles.pageTitle}>Fournisseurs</h2>
        <Button onClick={() => navigate('/fournisseurs/create')}>+ Nouveau fournisseur</Button>
      </div>
      <div className={styles.card}>
        {loading ? <Spinner /> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Raison sociale</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={3} className={styles.empty}>Aucun fournisseur trouvé.</td></tr>
              ) : data.map((f) => (
                <tr key={f.id}>
                  <td className={styles.name}>{f.raison_sociale}</td>
                  <td>{f.telephone ?? '—'}</td>
                  <td className={styles.actions}>
                    <button className={styles.actionLink} onClick={() => navigate(`/fournisseurs/${f.id}/edit`)}>Modifier</button>
                    <button className={styles.actionDanger} onClick={() => setDeleteTarget(f)}>Supprimer</button>
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
          title="Supprimer le fournisseur"
          message={`Supprimer « ${deleteTarget.raison_sociale} » ?`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
