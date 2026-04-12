import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdAdd } from 'react-icons/md'
import { getDemandes, deleteDemande } from '../../api/demandes'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import { Pagination } from '../../components/ui/Pagination'
import styles from './Demandes.module.css'

const STATUT_VARIANT = { En_attente: 'warning', Valide: 'info', Livre: 'success' }
const STATUT_LABEL   = { En_attente: 'En attente', Valide: 'Validé', Livre: 'Livré' }

export function DemandeList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [statut, setStatut] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [flash, setFlash] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getDemandes({ page, statut: statut || undefined })
      setData(res.data.data)
      setMeta(res.data.meta)
    } finally { setLoading(false) }
  }, [page, statut])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    try {
      await deleteDemande(deleteTarget.id)
      setFlash({ type: 'success', message: 'Demande supprimée.' })
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
        <h2 className={styles.pageTitle}>Demandes</h2>
        <Button onClick={() => navigate('/demandes/create')}><MdAdd /> Nouvelle demande</Button>
      </div>

      <div className={styles.filters}>
        <select
          className={styles.filterSelect}
          value={statut}
          onChange={(e) => { setStatut(e.target.value); setPage(1) }}
        >
          <option value="">Tous les statuts</option>
          <option value="En_attente">En attente</option>
          <option value="Valide">Validé</option>
          <option value="Livre">Livré</option>
        </select>
      </div>

      <div className={styles.card}>
        {loading ? <Spinner /> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Demandeur</th>
                <th>Date</th>
                <th>Articles</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={6} className={styles.empty}>Aucune demande trouvée.</td></tr>
              ) : data.map((d) => (
                <tr key={d.id}>
                  <td className={styles.idCell}>#{d.id}</td>
                  <td className={styles.name}>{d.utilisateur?.nom_complet ?? '—'}</td>
                  <td className={styles.muted}>{new Date(d.date_creation).toLocaleDateString('fr-FR')}</td>
                  <td className={styles.muted}>{d.lignes?.length ?? 0} article(s)</td>
                  <td><Badge variant={STATUT_VARIANT[d.statut] ?? 'neutral'}>{STATUT_LABEL[d.statut] ?? d.statut}</Badge></td>
                  <td className={styles.actions}>
                    <button className={styles.actionLink} onClick={() => navigate(`/demandes/${d.id}`)}>Voir</button>
                    {d.statut === 'En_attente' && (
                      <button className={styles.actionDanger} onClick={() => setDeleteTarget(d)}>Supprimer</button>
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
          title="Supprimer la demande"
          message={`Supprimer la demande #${deleteTarget.id} ?`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
