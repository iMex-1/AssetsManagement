import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { getAffectation } from '../../api/affectations'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Affectations.module.css'

export function AffectationShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [affectation, setAffectation] = useState(null)

  useEffect(() => {
    getAffectation(id).then(({ data }) => setAffectation(data))
  }, [id])

  if (!affectation) return <Spinner />

  const mapsUrl = affectation.coordonnees_gps
    ? `https://www.google.com/maps?q=${encodeURIComponent(affectation.coordonnees_gps)}`
    : null

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Affectation #{affectation.id}</h2>
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
              <span className={styles.showLabel}>Date</span>
              <span className={styles.showValue}>{new Date(affectation.date_action).toLocaleDateString('fr-FR')}</span>
            </div>
            {affectation.coordonnees_gps && (
              <div className={styles.showRow}>
                <span className={styles.showLabel}>GPS</span>
                <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.gpsLink}>
                  <MdLocationOn /> {affectation.coordonnees_gps}
                </a>
              </div>
            )}
          </div>

          <div className={styles.showActions}>
            <Button variant="secondary" onClick={() => navigate('/affectations')}>Retour</Button>
          </div>
        </div>

        {affectation.photo_jointe && (
          <div className={styles.photoCard}>
            <p className={styles.photoLabel}>Photo de preuve</p>
            <img
              src={`/storage/${affectation.photo_jointe}`}
              alt="Preuve d'installation"
              className={styles.photoFull}
            />
          </div>
        )}
      </div>
    </div>
  )
}
