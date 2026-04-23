import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdUploadFile } from 'react-icons/md'
import { createAffectation } from '../../api/affectations'
import { getArticles } from '../../api/articles'
import { getServices } from '../../api/services'
import { Button } from '../../components/ui/Button'
import { FormField, Input, Select } from '../../components/ui/FormField'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Affectations.module.css'

export function AffectationForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    article_id: '',
    service_id: '',
    quantite_affectee: 1,
    cible: '',
    coordonnees_gps: '',
    date_action: new Date().toISOString().split('T')[0],
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [articles, setArticles] = useState([])
  const [services, setServices] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      getArticles({ per_page: 200 }),
      getServices(),
    ]).then(([a, s]) => {
      setArticles(a.data.data)
      setServices(s.data.data)
      setLoading(false)
    })
  }, [])

  const setField = (f) => (e) => {
    const val = e.target.value
    setForm((prev) => ({ ...prev, [f]: val }))
    if (f === 'article_id') {
      setSelectedArticle(articles.find((a) => String(a.id) === String(val)) ?? null)
    }
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v) })
      if (photoFile) fd.append('photo_jointe', photoFile)
      await createAffectation(fd)
      navigate('/affectations')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors ?? {})
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Nouvelle affectation</h2>
      </div>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formRow}>
            <FormField label="Article" error={errors.article_id?.[0]} required>
              <Select value={form.article_id} onChange={setField('article_id')} error={errors.article_id?.[0]} required>
                <option value="">-- Choisir --</option>
                {articles.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.designation} (stock: {a.stock_actuel})
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Service destinataire" error={errors.service_id?.[0]} required>
              <Select value={form.service_id} onChange={setField('service_id')} error={errors.service_id?.[0]} required>
                <option value="">-- Choisir --</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.nom_service}</option>)}
              </Select>
            </FormField>
          </div>

          {selectedArticle && selectedArticle.stock_actuel <= selectedArticle.seuil_alerte && (
            <div className={styles.stockWarning}>
              Stock bas — disponible : {selectedArticle.stock_actuel}
            </div>
          )}

          <div className={styles.formRow}>
            <FormField label="Quantité affectée" error={errors.quantite_affectee?.[0]} required>
              <Input type="number" min="1" value={form.quantite_affectee} onChange={setField('quantite_affectee')} error={errors.quantite_affectee?.[0]} required />
            </FormField>
            <FormField label="Date d'action" error={errors.date_action?.[0]} required>
              <Input type="date" value={form.date_action} onChange={setField('date_action')} error={errors.date_action?.[0]} required />
            </FormField>
          </div>

          <FormField label="Cible" error={errors.cible?.[0]} hint="Ex: Bureau 204, Véhicule AB-123-CD, Poteau 45">
            <Input value={form.cible} onChange={setField('cible')} error={errors.cible?.[0]} />
          </FormField>

          <FormField label="Coordonnées GPS" error={errors.coordonnees_gps?.[0]} hint="Optionnel — ex: 36.7372, 3.0865">
            <Input value={form.coordonnees_gps} onChange={setField('coordonnees_gps')} error={errors.coordonnees_gps?.[0]} placeholder="lat, lng" />
          </FormField>

          <FormField label="Photo jointe (preuve)" error={errors.photo_jointe?.[0]} hint="JPG/PNG/WebP — max 5 Mo">
            <label className={styles.fileLabel}>
              <MdUploadFile className={styles.fileIcon} />
              <span>{photoFile ? photoFile.name : 'Choisir une photo…'}</span>
              <input type="file" accept=".jpg,.jpeg,.png,.webp" className={styles.fileInput} onChange={handlePhoto} />
            </label>
            {photoPreview && <img src={photoPreview} alt="Aperçu" className={styles.photoPreview} />}
          </FormField>

          <div className={styles.formActions}>
            <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/affectations')}>Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
