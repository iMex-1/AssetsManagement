import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPermission, createPermission, updatePermission } from '../../api/permissions'
import { Button } from '../../components/ui/Button'
import { FormField, Input } from '../../components/ui/FormField'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Permissions.module.css'

export function PermissionForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [name, setName] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getPermission(id).then(({ data }) => {
      setName(data.name)
      setLoading(false)
    })
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      if (isEdit) await updatePermission(id, { name })
      else await createPermission({ name })
      navigate('/permissions')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors ?? {})
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>{isEdit ? 'Modifier la permission' : 'Nouvelle permission'}</h2>
      </div>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <FormField label="Nom de la permission" error={errors.name?.[0]} required hint="ex: gerer_articles, soumettre_demande">
            <Input value={name} onChange={(e) => setName(e.target.value)} error={errors.name?.[0]} required />
          </FormField>
          <div className={styles.formActions}>
            <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/permissions')}>Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
