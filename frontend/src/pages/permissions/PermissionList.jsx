import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPermissions, deletePermission } from '../../api/permissions'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import styles from './Permissions.module.css'

export function PermissionList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [flash, setFlash] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getPermissions()
      setData(res.data.data ?? res.data)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    try {
      await deletePermission(deleteTarget.id)
      setFlash({ type: 'success', message: 'Permission supprimée.' })
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
        <h2 className={styles.pageTitle}>Permissions</h2>
        <Button onClick={() => navigate('/permissions/create')}>+ Nouvelle permission</Button>
      </div>
      <div className={styles.card}>
        {loading ? <Spinner /> : (
          <table className={styles.table}>
            <thead>
              <tr><th>Nom</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={2} className={styles.empty}>Aucune permission trouvée.</td></tr>
              ) : data.map((p) => (
                <tr key={p.id}>
                  <td className={styles.name}>{p.name}</td>
                  <td className={styles.actions}>
                    <button className={styles.actionLink} onClick={() => navigate(`/permissions/${p.id}/edit`)}>Modifier</button>
                    <button className={styles.actionDanger} onClick={() => setDeleteTarget(p)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {deleteTarget && (
        <Modal
          title="Supprimer la permission"
          message={`Supprimer « ${deleteTarget.name} » ?`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
