import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { getAffectation, updateAffectationEtat } from '../../api/affectations'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Affectations.module.css'

const ETAT_VARIANT = { en_service: 'success', en_panne: 'danger', en_reparation: 'warning', hors_service: 'neutral' }
const ETAT_LABEL = { en_service: 'En service', en_panne: 'En panne', en_reparation: 'En réparation', hors_service: 'Hors service' }

// Transitions autorisées par rôle
const TRANSITIONS_ADMIN = {
  en_service: ['en_panne'],
  en_panne: ['en_reparation', 'hors_service'],
  en_reparation: ['en_service', 'hors_service'],
  hors_service: [],
}
const TRANSITIONS_CHEF = {
  en_service: ['en_panne'],
  en_panne: [],
  en_reparation: [],
  hors_service: [],
}

const TRANSITION_LABELS = {
  en_panne: 'Signaler une panne',
  en_reparation: 'Mettre en réparation',
  en_service: 'Remettre en service',
  hors_service: 'Mettre hors service',
}

export function AffectationShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const [affectation, setAffectation] = useState(null)
  const [flash, setFlash] = useState(null)
  const [saving, setSaving] = useState(false)

  const reload = () => getAffectation(id).then(({ data }) => setAffectation(data))
  useEffect(() => { reload() }, [id])

  const handleEtat = async (etat) => {
    setSaving(true)
    try {
      await updateAffectationEtat(id, etat)
      setFlash({ type: 'success', message: `État mis à jour : ${ETAT_LABEL[etat]}` })
      reload()
    } catch (err) {
      setFlash({ type: 'danger', message: err.response?.data?.message ?? 'Erreur.' })
    } finally { setSaving(false) }
  }

  if (!affectation) return <Spinner />

  const mapsUrl = affectation.coordonnees_gps
    ? `https://www.google.com/maps?q=${encodeURIComponent(affectation.coordonnees_gps)}`
    : null

  const transitions = hasRole('Admin')
    ? (TRANSITIONS_ADMIN[affectation.etat] ?? [])
    : (TRANSITIONS_CHEF[affectation.etat] ?? [])

  return (
    <div>
      {flash && <Alert type={flash.type} message={flash.message} onDismiss={() => setFlash(null)} />}
      <div className={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 className={styles.pageTitle}>Affectation #{affectation.id}</h2>
          <Badge variant={ETAT_VARIANT[affectation.etat]}>{ETAT_LABEL[affectation.etat]}</Badge>
        </div>
      </div>

      <div className={styles.showLayout}>
        <div className={styles.showCard}>
          <div className={styles.showGrid}>
            <div className={styles.showRow}>
              <span className={styles.showLabel}>Article</span>
              <span className={styles.showValue}>{affectation.article?.designation}</span>
            </div>
            <div className={styles.showRow}>
              <span className={styles.showLabel}>Service</span>
              <span className={styles.showValue}>{affectation.service?.nom_service}</span>
            </div>
            <div className={styles.showRow}>
              <span className={styles.showLabel}>Quantité affectée</span>
              <span className={styles.showValue}>{affectation.quantite_affectee}</span>
            </div>
            <div className={styles.showRow}>
              <span className={styles.showLabel}>Cible</span>
              <span className={styles.showValue}>{affectation.cible ?? '—'}</span>
            </div>
            <div className={styles.showRow}>
              <span className={styles.showLabel}>Date d'affectation</span>
              <span className={styles.showValue}>{new Date(affectation.date_action).toLocaleDateString('fr-FR')}</span>
            </div>
            {affectation.date_fin && (
              <div className={styles.showRow}>
                <span className={styles.showLabel}>Date de fin</span>
                <span className={styles.showValue}>{new Date(affectation.date_fin).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            {affectation.coordonnees_gps && (
              <div className={styles.showRow}>
                <span className={styles.showLabel}>GPS</span>
                <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.gpsLink}>
                  <MdLocationOn /> {affectation.coordonnees_gps}
                </a>
              </div>
            )}
          </div>

          {transitions.length > 0 && (
            <div className={styles.workflowActions}>
              {transitions.map((t) => (
                <Button
                  key={t}
                  variant={t === 'hors_service' ? 'danger' : t === 'en_panne' ? 'danger' : 'primary'}
                  disabled={saving}
                  onClick={() => handleEtat(t)}
                >
                  {TRANSITION_LABELS[t]}
                </Button>
              ))}
            </div>
          )}

          <div className={styles.showActions}>
            <Button variant="secondary" onClick={() => navigate('/affectations')}>Retour</Button>
          </div>
        </div>

        {affectation.photo_url && (
          <div className={styles.photoCard}>
            <p className={styles.photoLabel}>Photo de preuve</p>
            <img
              src={affectation.photo_url}
              alt="Preuve d'installation"
              className={styles.photoFull}
            />
          </div>
        )}
      </div>
    </div>
  )
}
