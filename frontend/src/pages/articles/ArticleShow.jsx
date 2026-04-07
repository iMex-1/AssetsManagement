import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getArticle } from '../../api/articles'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Articles.module.css'

export function ArticleShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    getArticle(id).then(({ data }) => setArticle(data))
  }, [id])

  if (!article) return <Spinner />

  const isLow = article.stock_actuel <= article.seuil_alerte

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>{article.designation}</h2>
        <Badge variant={article.categorie === 'Materiel' ? 'primary' : 'accent'}>{article.categorie}</Badge>
      </div>

      {isLow && (
        <div className={styles.lowStockBanner}>
          ⚠ Stock bas — le stock actuel est en dessous du seuil d'alerte.
        </div>
      )}

      <div className={styles.showCard}>
        <div className={styles.showGrid}>
          <div className={styles.showRow}>
            <span className={styles.showLabel}>Désignation</span>
            <span className={styles.showValue}>{article.designation}</span>
          </div>
          <div className={styles.showRow}>
            <span className={styles.showLabel}>Catégorie</span>
            <span className={styles.showValue}>{article.categorie}</span>
          </div>
          <div className={styles.showRow}>
            <span className={styles.showLabel}>Stock actuel</span>
            <span className={`${styles.showValue} ${isLow ? styles.stockLow : ''}`}>{article.stock_actuel}</span>
          </div>
          <div className={styles.showRow}>
            <span className={styles.showLabel}>Seuil d'alerte</span>
            <span className={styles.showValue}>{article.seuil_alerte}</span>
          </div>
          <div className={styles.showRow}>
            <span className={styles.showLabel}>Créé le</span>
            <span className={styles.showValue}>{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        <div className={styles.showActions}>
          {hasPermission('manage_items') && (
            <Button onClick={() => navigate(`/articles/${id}/edit`)}>Modifier</Button>
          )}
          <Button variant="secondary" onClick={() => navigate('/articles')}>Retour</Button>
        </div>
      </div>
    </div>
  )
}
