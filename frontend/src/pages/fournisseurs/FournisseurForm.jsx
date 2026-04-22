import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getFournisseur, createFournisseur, updateFournisseur } from '../../api/fournisseurs'
import { Button } from '../../components/ui/Button'
import { FormField, Input } from '../../components/ui/FormField'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Fournisseurs.module.css'

export function FournisseurForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ raison_sociale: '', telephone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getFournisseur(id).then(({ data }) => {
      setForm({ raison_sociale: data.raison_sociale, telephone: data.telephone ?? '' })
      setLoading(false)
    })
  }, [id, isEdit])

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      if (isEdit) await updateFournisseur(id, form)
      else await createFournisseur(form)
      navigate('/fournisseurs')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors ?? {})
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>{isEdit ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}</h2>
      </div>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <FormField label="Raison sociale" error={errors.raison_sociale?.[0]} required>
            <Input value={form.raison_sociale} onChange={set('raison_sociale')} error={errors.raison_sociale?.[0]} required />
          </FormField>
          <FormField label="Téléphone" error={errors.telephone?.[0]} hint="Format : 06/07XXXXXXXX ou +2126/7XXXXXXXX">
            <Input
              value={form.telephone}
              onChange={set('telephone')}
              error={errors.telephone?.[0]}
              placeholder="0612345678"
            />
          </FormField>
          <div className={styles.formActions}>
            <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/fournisseurs')}>Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
