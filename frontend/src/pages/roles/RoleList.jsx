import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoles, deleteRole } from '../../api/roles'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import styles from './Roles.module.css'

export function RoleList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [flash, setFlash] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getRoles()
      setData(res.data.data ?? res.data)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    try {
      await deleteRole(deleteTarget.id)
      setFlash({ type: 'success', message: 'Rôle supprimé.' })
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
        <h2 className={styles.pageTitle}>Rôles</h2>
        <Button onClick={() => navigate('/roles/create')}>+ Nouveau rôle</Button>
      </div>
      <div className={styles.card}>
        {loading ? <Spinner /> : (
          <table className={styles.table}>
            <thead>
              <tr><th>Nom</th><th>Permissions</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={3} className={styles.empty}>Aucun rôle trouvé.</td></tr>
              ) : data.map((r) => (
                <tr key={r.id}>
                  <td className={styles.name}>{r.name}</td>
                  <td><Badge variant="neutral">{r.permissions?.length ?? 0} permissions</Badge></td>
                  <td className={styles.actions}>
                    <button className={styles.actionLink} onClick={() => navigate(`/roles/${r.id}/edit`)}>Modifier</button>
                    <button className={styles.actionDanger} onClick={() => setDeleteTarget(r)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {deleteTarget && (
        <Modal
          title="Supprimer le rôle"
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
