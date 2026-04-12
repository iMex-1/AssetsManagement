import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getReception } from '../../api/receptions'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Receptions.module.css'

export function ReceptionShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reception, setReception] = useState(null)

  useEffect(() => {
    getReception(id).then(({ data }) => setReception(data))
  }, [id])

  if (!reception) return <Spinner />

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Réception — {reception.numero_doc}</h2>
      </div>

      <div className={styles.showCard}>
        <div className={styles.showGrid}>
          <div className={styles.showRow}>
            <span className={styles.showLabel}>Fournisseur</span>
            <span className={styles.showValue}>{reception.fournisseur?.raison_sociale}</span>
          </div>
          <div className={styles.showRow}>
            <span className={styles.showLabel}>Type de document</span>
            <span className={styles.showValue}>{reception.type_doc}</span>
          </div>
          <div className={styles.showRow}>
            <span className={styles.showLabel}>Numéro</span>
            <span className={styles.showValue}>{reception.numero_doc}</span>
          </div>
          <div className={styles.showRow}>
            <span className={styles.showLabel}>Date de réception</span>
            <span className={styles.showValue}>{new Date(reception.date_reception).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        <h3 className={styles.lignesTitle} style={{ marginTop: 24 }}>Articles reçus</h3>
        <table className={styles.table}>
          <thead>
            <tr><th>Article</th><th>Catégorie</th><th>Quantité reçue</th></tr>
          </thead>
          <tbody>
            {reception.lignes?.map((l) => (
              <tr key={l.id}>
                <td className={styles.name}>{l.article?.designation}</td>
                <td className={styles.muted}>{l.article?.categorie}</td>
                <td>{l.quantite_recue}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.showActions}>
          <Button variant="secondary" onClick={() => navigate('/receptions')}>Retour</Button>
        </div>
      </div>
    </div>
  )
}
