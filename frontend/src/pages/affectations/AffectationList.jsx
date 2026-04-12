import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdAdd } from 'react-icons/md'
import { getAffectations, deleteAffectation } from '../../api/affectations'
import { getServices } from '../../api/services'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import { Pagination } from '../../components/ui/Pagination'
import styles from './Affectations.module.css'

export function AffectationList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [meta, setMeta] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [serviceFilter, setServiceFilter] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    getServices().then(({ data }) => setServices(data.data))
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAffectations({ page, service_id: serviceFilter || undefined })
      setData(res.data.data)
      setMeta(res.data.meta)
    } finally { setLoading(false) }
  }, [page, serviceFilter])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    try {
      await deleteAffectation(deleteTarget.id)
      setFlash({ type: 'success', message: 'Affectation supprimée. Stock restauré.' })
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
        <h2 className={styles.pageTitle}>Affectations</h2>
        <Button onClick={() => navigate('/affectations/create')}><MdAdd /> Nouvelle affectation</Button>
      </div>

      <div className={styles.filters}>
        <select
          className={styles.filterSelect}
          value={serviceFilter}
          onChange={(e) => { setServiceFilter(e.target.value); setPage(1) }}
        >
          <option value="">Tous les services</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.nom_service}</option>)}
        </select>
      </div>

      <div className={styles.card}>
        {loading ? <Spinner /> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Article</th>
                <th>Service</th>
                <th>Quantité</th>
                <th>Cible</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={6} className={styles.empty}>Aucune affectation trouvée.</td></tr>
              ) : data.map((a) => (
                <tr key={a.id}>
                  <td className={styles.name}>{a.article?.designation}</td>
                  <td>{a.service?.nom_service}</td>
                  <td>{a.quantite_affectee}</td>
                  <td className={styles.muted}>{a.cible ?? '—'}</td>
                  <td className={styles.muted}>{new Date(a.date_action).toLocaleDateString('fr-FR')}</td>
                  <td className={styles.actions}>
                    <button className={styles.actionLink} onClick={() => navigate(`/affectations/${a.id}`)}>Voir</button>
                    <button className={styles.actionDanger} onClick={() => setDeleteTarget(a)}>Supprimer</button>
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
          title="Supprimer l'affectation"
          message={`Supprimer cette affectation ? Le stock de « ${deleteTarget.article?.designation} » sera restauré.`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
