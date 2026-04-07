import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getRole, createRole, updateRole } from '../../api/roles'
import { getPermissions } from '../../api/permissions'
import { Button } from '../../components/ui/Button'
import { FormField, Input } from '../../components/ui/FormField'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Roles.module.css'

export function RoleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ name: '', permissions: [] })
  const [allPerms, setAllPerms] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const init = async () => {
      const permsRes = await getPermissions()
      setAllPerms(permsRes.data.data ?? permsRes.data)
      if (isEdit) {
        const roleRes = await getRole(id)
        const r = roleRes.data
        setForm({ name: r.name, permissions: r.permissions?.map((p) => p.name ?? p) ?? [] })
      }
      setLoading(false)
    }
    init()
  }, [id, isEdit])

  const togglePerm = (name) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(name)
        ? prev.permissions.filter((p) => p !== name)
        : [...prev.permissions, name],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      if (isEdit) await updateRole(id, form)
      else await createRole(form)
      navigate('/roles')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors ?? {})
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>{isEdit ? 'Modifier le rôle' : 'Nouveau rôle'}</h2>
      </div>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <FormField label="Nom du rôle" error={errors.name?.[0]} required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name?.[0]} required />
          </FormField>
          <FormField label="Permissions">
            <div className={styles.permGrid}>
              {allPerms.map((p) => (
                <label key={p.id ?? p.name} className={styles.checkboxLabel}>
                  <input type="checkbox" checked={form.permissions.includes(p.name)} onChange={() => togglePerm(p.name)} />
                  {p.name}
                </label>
              ))}
            </div>
          </FormField>
          <div className={styles.formActions}>
            <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/roles')}>Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
