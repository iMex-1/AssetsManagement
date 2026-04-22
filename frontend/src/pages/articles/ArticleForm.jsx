import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getArticle, createArticle, updateArticle } from '../../api/articles'
import { Button } from '../../components/ui/Button'
import { FormField, Input, Select } from '../../components/ui/FormField'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Articles.module.css'

export function ArticleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ designation: '', categorie: '', stock_actuel: 0, seuil_alerte: 0 })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getArticle(id).then(({ data }) => {
      setForm({ designation: data.designation, categorie: data.categorie, stock_actuel: data.stock_actuel, seuil_alerte: data.seuil_alerte ?? 0 })
      setLoading(false)
    })
  }, [id, isEdit])

  const set = (field) => (e) => {
    const next = { ...form, [field]: e.target.value }
    if (field === 'categorie' && e.target.value === 'Materiel') next.seuil_alerte = 0
    setForm(next)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      if (isEdit) await updateArticle(id, form)
      else await createArticle(form)
      navigate('/articles')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors ?? {})
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>{isEdit ? 'Modifier l\'article' : 'Nouvel article'}</h2>
      </div>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <FormField label="Désignation" error={errors.designation?.[0]} required>
            <Input value={form.designation} onChange={set('designation')} error={errors.designation?.[0]} required />
          </FormField>

          <FormField label="Catégorie" error={errors.categorie?.[0]} required>
            <Select value={form.categorie} onChange={set('categorie')} error={errors.categorie?.[0]} required>
              <option value="">-- Choisir --</option>
              <option value="Materiel">Matériel</option>
              <option value="Fourniture">Fourniture</option>
            </Select>
          </FormField>

          <div className={styles.formRow}>
            <FormField label="Stock actuel" error={errors.stock_actuel?.[0]} required>
              <Input type="number" min="0" value={form.stock_actuel} onChange={set('stock_actuel')} error={errors.stock_actuel?.[0]} required />
            </FormField>
            {form.categorie !== 'Materiel' && (
              <FormField label="Seuil d'alerte" error={errors.seuil_alerte?.[0]} required>
                <Input type="number" min="0" value={form.seuil_alerte} onChange={set('seuil_alerte')} error={errors.seuil_alerte?.[0]} required />
              </FormField>
            )}
          </div>

          <div className={styles.formActions}>
            <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/articles')}>Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
