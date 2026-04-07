import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, deleteUser } from '../../api/users'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import { Pagination } from '../../components/ui/Pagination'
import styles from './Users.module.css'

export function UserList() {
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
      const res = await getUsers({ page })
      setData(res.data.data)
      setMeta(res.data.meta)
    } finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    try {
      await deleteUser(deleteTarget.id)
      setFlash({ type: 'success', message: 'Utilisateur supprimé.' })
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
        <h2 className={styles.pageTitle}>Utilisateurs</h2>
        <Button onClick={() => navigate('/users/create')}>+ Nouvel utilisateur</Button>
      </div>
      <div className={styles.card}>
        {loading ? <Spinner /> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Rôle(s)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={4} className={styles.empty}>Aucun utilisateur trouvé.</td></tr>
              ) : data.map((u) => (
                <tr key={u.id}>
                  <td className={styles.name}>{u.nom_complet}</td>
                  <td className={styles.muted}>{u.email}</td>
                  <td>
                    <div className={styles.badges}>
                      {u.roles?.map((r) => <Badge key={r} variant="primary">{r}</Badge>)}
                    </div>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.actionLink} onClick={() => navigate(`/users/${u.id}/edit`)}>Modifier</button>
                    <button className={styles.actionDanger} onClick={() => setDeleteTarget(u)}>Supprimer</button>
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
          title="Supprimer l'utilisateur"
          message={`Supprimer « ${deleteTarget.nom_complet} » ?`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
