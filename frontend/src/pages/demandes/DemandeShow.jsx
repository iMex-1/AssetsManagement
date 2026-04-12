import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MdCheckCircle, MdLocalShipping, MdUploadFile } from 'react-icons/md'
import { getDemande, updateDemandeStatut } from '../../api/demandes'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Demandes.module.css'

const STATUT_VARIANT = { En_attente: 'warning', Valide: 'info', Livre: 'success' }
const STATUT_LABEL   = { En_attente: 'En attente', Valide: 'Validé', Livre: 'Livré' }

export function DemandeShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const [demande, setDemande] = useState(null)
  const [flash, setFlash] = useState(null)
  const [saving, setSaving] = useState(false)
  const [bonFile, setBonFile] = useState(null)

  const reload = () => getDemande(id).then(({ data }) => setDemande(data))

  useEffect(() => { reload() }, [id])

  const transition = async (statut) => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('statut', statut)
      if (bonFile) fd.append('bon_scanne', bonFile)
      await updateDemandeStatut(id, fd)
      setFlash({ type: 'success', message: `Statut mis à jour : ${STATUT_LABEL[statut]}` })
      setBonFile(null)
      reload()
    } catch (err) {
      setFlash({ type: 'danger', message: err.response?.data?.message ?? 'Erreur.' })
    } finally { setSaving(false) }
  }

  if (!demande) return <Spinner />

  const canApprove = hasPermission('approve_request')

  return (
    <div>
      {flash && <Alert type={flash.type} message={flash.message} onDismiss={() => setFlash(null)} />}
      <div className={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 className={styles.pageTitle}>Demande #{demande.id}</h2>
          <Badge variant={STATUT_VARIANT[demande.statut] ?? 'neutral'}>{STATUT_LABEL[demande.statut] ?? demande.statut}</Badge>
        </div>
      </div>

      <div className={styles.showCard}>
        <div className={styles.showGrid}>
          <div className={styles.showRow}>
            <span className={styles.showLabel}>Demandeur</span>
            <span className={styles.showValue}>{demande.utilisateur?.nom_complet}</span>
          </div>
          <div className={styles.showRow}>
            <span className={styles.showLabel}>Date</span>
            <span className={styles.showValue}>{new Date(demande.date_creation).toLocaleDateString('fr-FR')}</span>
          </div>
          {demande.bon_scanne && (
            <div className={styles.showRow}>
              <span className={styles.showLabel}>Bon scanné</span>
              <a href={`/storage/${demande.bon_scanne}`} target="_blank" rel="noreferrer" className={styles.fileLink}>
                <MdUploadFile /> Voir le document
              </a>
            </div>
          )}
        </div>

        <h3 className={styles.lignesTitle} style={{ marginTop: 24 }}>Articles demandés</h3>
        <table className={styles.table}>
          <thead>
            <tr><th>Article</th><th>Quantité</th><th>Motif</th></tr>
          </thead>
          <tbody>
            {demande.lignes?.map((l) => (
              <tr key={l.id}>
                <td className={styles.name}>{l.article?.designation}</td>
                <td>{l.quantite_demandee}</td>
                <td className={styles.muted}>{l.motif ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {canApprove && demande.statut === 'En_attente' && (
          <div className={styles.workflowActions}>
            <Button onClick={() => transition('Valide')} disabled={saving}>
              <MdCheckCircle /> Valider
            </Button>
          </div>
        )}

        {canApprove && demande.statut === 'Valide' && (
          <div className={styles.workflowActions}>
            <div className={styles.livrerRow}>
              <label className={styles.fileLabel}>
                <MdUploadFile className={styles.fileIcon} />
                <span>{bonFile ? bonFile.name : 'Bon de livraison (optionnel)'}</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className={styles.fileInput} onChange={(e) => setBonFile(e.target.files[0] || null)} />
              </label>
              <Button onClick={() => transition('Livre')} disabled={saving}>
                <MdLocalShipping /> Marquer comme livré
              </Button>
            </div>
          </div>
        )}

        <div className={styles.showActions}>
          <Button variant="secondary" onClick={() => navigate('/demandes')}>Retour</Button>
        </div>
      </div>
    </div>
  )
}
