import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdAdd } from 'react-icons/md'
import { getAffectations, deleteAffectation } from '../../api/affectations'
import { getServices } from '../../api/services'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import { Pagination } from '../../components/ui/Pagination'
import styles from './Affectations.module.css'

const ETAT_VARIANT = { en_service: 'success', en_panne: 'danger', en_reparation: 'warning', hors_service: 'neutral' }
const ETAT_LABEL   = { en_service: 'En service', en_panne: 'En panne', en_reparation: 'En réparation', hors_service: 'Hors service' }

export function AffectationList() {
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const isAdmin = hasRole('Admin')

  const [tab, setTab] = useState('actif') // 'actif' | 'historique'
  const [data, setData] = useState([])
  const [meta, setMeta] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [serviceFilter, setServiceFilter] = useState('')
  const [etatFilter, setEtatFilter] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    if (isAdmin) getServices().then(({ data }) => setServices(data.data))
  }, [isAdmin])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        service_id: serviceFilter || undefined,
        etat: etatFilter || undefined,
        historique: tab === 'historique' ? 1 : undefined,
      }
      const res = await getAffectations(params)
      setData(res.data.data)
      setMeta(res.data.meta)
    } finally { setLoading(false) }
  }, [page, serviceFilter, etatFilter, tab])

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

  const changeTab = (t) => { setTab(t); setPage(1); setEtatFilter('') }

  return (
    <div>
      {flash && <Alert type={flash.type} message={flash.message} onDismiss={() => setFlash(null)} />}
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Affectations</h2>
        {isAdmin && (
          <Button onClick={() => navigate('/affectations/create')}><MdAdd /> Nouvelle affectation</Button>
        )}
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'actif' ? styles.tabActive : ''}`} onClick={() => changeTab('actif')}>
          Actif
        </button>
        <button className={`${styles.tab} ${tab === 'historique' ? styles.tabActive : ''}`} onClick={() => changeTab('historique')}>
          Historique
        </button>
      </div>

      <div className={styles.filters}>
        {isAdmin && (
          <select className={styles.filterSelect} value={serviceFilter} onChange={(e) => { setServiceFilter(e.target.value); setPage(1) }}>
            <option value="">Tous les services</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.nom_service}</option>)}
          </select>
        )}
        <select className={styles.filterSelect} value={etatFilter} onChange={(e) => { setEtatFilter(e.target.value); setPage(1) }}>
          <option value="">Tous les états</option>
          {Object.entries(ETAT_LABEL).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
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
                <th>État</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={7} className={styles.empty}>Aucune affectation trouvée.</td></tr>
              ) : data.map((a) => (
                <tr key={a.id}>
                  <td className={styles.name}>{a.article?.designation}</td>
                  <td>{a.service?.nom_service}</td>
                  <td>{a.quantite_affectee}</td>
                  <td className={styles.muted}>{a.cible ?? '—'}</td>
                  <td><Badge variant={ETAT_VARIANT[a.etat] ?? 'neutral'}>{ETAT_LABEL[a.etat] ?? a.etat}</Badge></td>
                  <td className={styles.muted}>{new Date(a.date_action).toLocaleDateString('fr-FR')}</td>
                  <td className={styles.actions}>
                    <button className={styles.actionLink} onClick={() => navigate(`/affectations/${a.id}`)}>Voir</button>
                    {isAdmin && tab === 'actif' && (
                      <button className={styles.actionDanger} onClick={() => setDeleteTarget(a)}>Supprimer</button>
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
