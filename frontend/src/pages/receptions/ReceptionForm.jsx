import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdAdd, MdDelete } from 'react-icons/md'
import { createReception } from '../../api/receptions'
import { getFournisseurs } from '../../api/fournisseurs'
import { getArticles } from '../../api/articles'
import { Button } from '../../components/ui/Button'
import { FormField, Input, Select } from '../../components/ui/FormField'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Receptions.module.css'

const emptyLigne = () => ({ article_id: '', quantite_recue: 1 })

export function ReceptionForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fournisseur_id: '',
    type_doc: '',
    numero_doc: '',
    date_reception: new Date().toISOString().split('T')[0],
  })
  const [lignes, setLignes] = useState([emptyLigne()])
  const [fournisseurs, setFournisseurs] = useState([])
  const [articles, setArticles] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      getFournisseurs({ per_page: 100 }),
      getArticles({ per_page: 200 }),
    ]).then(([f, a]) => {
      setFournisseurs(f.data.data)
      setArticles(a.data.data)
      setLoading(false)
    })
  }, [])

  const setField = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const setLigne = (i, field, value) => {
    const next = [...lignes]
    next[i] = { ...next[i], [field]: value }
    setLignes(next)
  }

  const addLigne = () => setLignes([...lignes, emptyLigne()])
  const removeLigne = (i) => setLignes(lignes.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      await createReception({ ...form, lignes })
      navigate('/receptions')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors ?? {})
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Nouvelle réception</h2>
      </div>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formRow}>
              <FormField label="Fournisseur" error={errors.fournisseur_id?.[0]} required>
                <Select value={form.fournisseur_id} onChange={setField('fournisseur_id')} error={errors.fournisseur_id?.[0]} required>
                  <option value="">-- Choisir --</option>
                  {fournisseurs.map((f) => <option key={f.id} value={f.id}>{f.raison_sociale}</option>)}
                </Select>
              </FormField>
              <FormField label="Type de document" error={errors.type_doc?.[0]} required>
                <Select value={form.type_doc} onChange={setField('type_doc')} error={errors.type_doc?.[0]} required>
                  <option value="">-- Choisir --</option>
                  <option value="Marche">Marché</option>
                  <option value="Bon de Commande">Bon de Commande</option>
                </Select>
              </FormField>
            </div>
            <div className={styles.formRow}>
              <FormField label="Numéro de document" error={errors.numero_doc?.[0]} required>
                <Input value={form.numero_doc} onChange={setField('numero_doc')} error={errors.numero_doc?.[0]} required />
              </FormField>
              <FormField label="Date de réception" error={errors.date_reception?.[0]} required>
                <Input type="date" value={form.date_reception} onChange={setField('date_reception')} error={errors.date_reception?.[0]} required />
              </FormField>
            </div>
          </div>

          <div className={styles.lignesSection}>
            <div className={styles.lignesHeader}>
              <h3 className={styles.lignesTitle}>Articles reçus</h3>
              <Button type="button" variant="secondary" size="sm" onClick={addLigne}><MdAdd /> Ajouter une ligne</Button>
            </div>
            {errors['lignes'] && <p className={styles.errorMsg}>{errors['lignes'][0]}</p>}
            <table className={styles.lignesTable}>
              <thead>
                <tr><th>Article</th><th>Quantité reçue</th><th></th></tr>
              </thead>
              <tbody>
                {lignes.map((l, i) => (
                  <tr key={i}>
                    <td>
                      <Select
                        value={l.article_id}
                        onChange={(e) => setLigne(i, 'article_id', e.target.value)}
                        error={errors[`lignes.${i}.article_id`]?.[0]}
                        required
                      >
                        <option value="">-- Article --</option>
                        {articles.map((a) => <option key={a.id} value={a.id}>{a.designation}</option>)}
                      </Select>
                    </td>
                    <td>
                      <Input
                        type="number" min="1"
                        value={l.quantite_recue}
                        onChange={(e) => setLigne(i, 'quantite_recue', parseInt(e.target.value) || 1)}
                        error={errors[`lignes.${i}.quantite_recue`]?.[0]}
                        required
                      />
                    </td>
                    <td>
                      {lignes.length > 1 && (
                        <button type="button" className={styles.removeLigne} onClick={() => removeLigne(i)}>
                          <MdDelete />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.formActions}>
            <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/receptions')}>Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
