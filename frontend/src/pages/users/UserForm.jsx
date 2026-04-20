import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, createUser, updateUser } from '../../api/users'
import { getRoles } from '../../api/roles'
import { getServices } from '../../api/services'
import { Button } from '../../components/ui/Button'
import { FormField, Input, Select } from '../../components/ui/FormField'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Users.module.css'

export function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ nom_complet: '', email: '', password: '', password_confirmation: '', service_id: '', roles: [] })
  const [allRoles, setAllRoles] = useState([])
  const [allServices, setAllServices] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const init = async () => {
      const [rolesRes, servicesRes] = await Promise.all([getRoles(), getServices()])
      setAllRoles(rolesRes.data.data ?? rolesRes.data)
      setAllServices(servicesRes.data.data ?? [])
      if (isEdit) {
        const userRes = await getUser(id)
        const u = userRes.data
        setForm({ nom_complet: u.nom_complet, email: u.email, password: '', password_confirmation: '', service_id: u.service_id ?? '', roles: u.roles ?? [] })
      }
      setLoading(false)
    }
    init()
  }, [id, isEdit])

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const toggleRole = (name) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(name) ? prev.roles.filter((r) => r !== name) : [...prev.roles, name],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    const payload = { ...form, service_id: form.service_id || null }
    if (isEdit && !payload.password) { delete payload.password; delete payload.password_confirmation }
    try {
      if (isEdit) await updateUser(id, payload)
      else await createUser(payload)
      navigate('/users')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors ?? {})
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>{isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</h2>
      </div>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <FormField label="Nom complet" error={errors.nom_complet?.[0]} required>
            <Input value={form.nom_complet} onChange={set('nom_complet')} error={errors.nom_complet?.[0]} required />
          </FormField>
          <FormField label="Email" error={errors.email?.[0]} required>
            <Input type="email" value={form.email} onChange={set('email')} error={errors.email?.[0]} required />
          </FormField>
          <FormField label="Service" error={errors.service_id?.[0]} hint="Optionnel">
            <Select value={form.service_id} onChange={set('service_id')} error={errors.service_id?.[0]}>
              <option value="">-- Aucun service --</option>
              {allServices.map((s) => <option key={s.id} value={s.id}>{s.nom_service}</option>)}
            </Select>
          </FormField>
          <div className={styles.formRow}>
            <FormField label={isEdit ? 'Nouveau mot de passe' : 'Mot de passe'} error={errors.password?.[0]} required={!isEdit}>
              <Input type="password" value={form.password} onChange={set('password')} error={errors.password?.[0]} required={!isEdit} />
            </FormField>
            <FormField label="Confirmation" error={errors.password_confirmation?.[0]}>
              <Input type="password" value={form.password_confirmation} onChange={set('password_confirmation')} />
            </FormField>
          </div>
          <FormField label="Rôles">
            <div className={styles.checkboxGroup}>
              {allRoles.map((r) => (
                <label key={r.id ?? r.name} className={styles.checkboxLabel}>
                  <input type="checkbox" checked={form.roles.includes(r.name)} onChange={() => toggleRole(r.name)} />
                  {r.name}
                </label>
              ))}
            </div>
          </FormField>
          <div className={styles.formActions}>
            <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/users')}>Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
