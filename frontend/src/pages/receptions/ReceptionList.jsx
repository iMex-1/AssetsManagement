import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdAdd } from 'react-icons/md'
import { getReceptions, deleteReception } from '../../api/receptions'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import { Pagination } from '../../components/ui/Pagination'
import styles from './Receptions.module.css'

export function ReceptionList() {
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
      const res = await getReceptions({ page })
      setData(res.data.data)
      setMeta(res.data.meta)
    } finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    try {
      await deleteReception(deleteTarget.id)
      setFlash({ type: 'success', message: 'Réception supprimée.' })
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
        <h2 className={styles.pageTitle}>Réceptions</h2>
        <Button onClick={() => navigate('/receptions/create')}><MdAdd /> Nouvelle réception</Button>
      </div>
      <div className={styles.card}>
        {loading ? <Spinner /> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>N° Document</th>
                <th>Type</th>
                <th>Fournisseur</th>
                <th>Date</th>
                <th>Articles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={6} className={styles.empty}>Aucune réception trouvée.</td></tr>
              ) : data.map((r) => (
                <tr key={r.id}>
                  <td className={styles.docNum}>{r.numero_doc}</td>
                  <td><span className={styles.typeTag}>{r.type_doc}</span></td>
                  <td>{r.fournisseur?.raison_sociale ?? '—'}</td>
                  <td className={styles.muted}>{new Date(r.date_reception).toLocaleDateString('fr-FR')}</td>
                  <td className={styles.muted}>{r.lignes?.length ?? 0} article(s)</td>
                  <td className={styles.actions}>
                    <button className={styles.actionLink} onClick={() => navigate(`/receptions/${r.id}`)}>Voir</button>
                    <button className={styles.actionDanger} onClick={() => setDeleteTarget(r)}>Supprimer</button>
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
          title="Supprimer la réception"
          message={`Supprimer la réception « ${deleteTarget.numero_doc} » ? Le stock ne sera pas recalculé.`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
