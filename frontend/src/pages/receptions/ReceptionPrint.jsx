import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getReception } from '../../api/receptions'
import { Spinner } from '../../components/ui/Spinner'
import styles from './ReceptionPrint.module.css'

export function ReceptionPrint() {
  const { id } = useParams()
  const [reception, setReception] = useState(null)

  useEffect(() => {
    getReception(id).then(({ data }) => {
      setReception(data)
    })
  }, [id])

  useEffect(() => {
    if (reception) {
      setTimeout(() => window.print(), 300)
    }
  }, [reception])

  if (!reception) return <Spinner />

  const total = reception.lignes?.reduce((sum, l) => sum + l.quantite_recue, 0) ?? 0

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Bon de Réception</h1>
          <p className={styles.docNum}>{reception.numero_doc}</p>
        </div>
        <div className={styles.meta}>
          <p><strong>Date :</strong> {new Date(reception.date_reception).toLocaleDateString('fr-FR')}</p>
          <p><strong>Type :</strong> {reception.type_doc}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Fournisseur</h2>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <td className={styles.infoLabel}>Raison sociale</td>
              <td>{reception.fournisseur?.raison_sociale ?? '—'}</td>
            </tr>
            {reception.fournisseur?.telephone && (
              <tr>
                <td className={styles.infoLabel}>Téléphone</td>
                <td>{reception.fournisseur.telephone}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Articles reçus</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Désignation</th>
              <th>Catégorie</th>
              <th>Quantité reçue</th>
            </tr>
          </thead>
          <tbody>
            {reception.lignes?.map((l, i) => (
              <tr key={l.id}>
                <td>{i + 1}</td>
                <td>{l.article?.designation}</td>
                <td>{l.article?.categorie}</td>
                <td className={styles.qty}>{l.quantite_recue}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className={styles.totalLabel}>Total articles reçus</td>
              <td className={styles.totalValue}>{total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={styles.signatures}>
        <div className={styles.sigBlock}>
          <p className={styles.sigTitle}>Responsable réception</p>
          <div className={styles.sigLine} />
          <p className={styles.sigName}>Nom &amp; Signature</p>
        </div>
        <div className={styles.sigBlock}>
          <p className={styles.sigTitle}>Fournisseur / Livreur</p>
          <div className={styles.sigLine} />
          <p className={styles.sigName}>Nom &amp; Signature</p>
        </div>
        <div className={styles.sigBlock}>
          <p className={styles.sigTitle}>Validé par</p>
          <div className={styles.sigLine} />
          <p className={styles.sigName}>Nom &amp; Signature</p>
        </div>
      </div>

      <p className={styles.footer}>
        Document généré le {new Date().toLocaleDateString('fr-FR')} — PublicAsset OS
      </p>
    </div>
  )
}
