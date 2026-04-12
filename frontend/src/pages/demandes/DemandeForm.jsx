import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdAdd, MdDelete, MdUploadFile } from 'react-icons/md'
import { createDemande } from '../../api/demandes'
import { getArticles } from '../../api/articles'
import { Button } from '../../components/ui/Button'
import { FormField, Input, Select, Textarea } from '../../components/ui/FormField'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Demandes.module.css'

const emptyLigne = () => ({ article_id: '', quantite_demandee: 1, motif: '' })

export function DemandeForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ date_creation: new Date().toISOString().split('T')[0] })
  const [lignes, setLignes] = useState([emptyLigne()])
  const [bonFile, setBonFile] = useState(null)
  const [articles, setArticles] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getArticles({ per_page: 200 }).then(({ data }) => {
      setArticles(data.data)
      setLoading(false)
    })
  }, [])

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
      const fd = new FormData()
      fd.append('date_creation', form.date_creation)
      lignes.forEach((l, i) => {
        fd.append(`lignes[${i}][article_id]`, l.article_id)
        fd.append(`lignes[${i}][quantite_demandee]`, l.quantite_demandee)
        if (l.motif) fd.append(`lignes[${i}][motif]`, l.motif)
      })
      if (bonFile) fd.append('bon_scanne', bonFile)
      await createDemande(fd)
      navigate('/demandes')
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors ?? {})
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Nouvelle demande</h2>
      </div>
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <FormField label="Date de la demande" error={errors.date_creation?.[0]} required>
              <Input type="date" value={form.date_creation} onChange={(e) => setForm({ ...form, date_creation: e.target.value })} required />
            </FormField>
            <FormField label="Bon scanné (PDF/image)" error={errors.bon_scanne?.[0]} hint="Optionnel — max 5 Mo">
              <label className={styles.fileLabel}>
                <MdUploadFile className={styles.fileIcon} />
                <span>{bonFile ? bonFile.name : 'Choisir un fichier…'}</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className={styles.fileInput} onChange={(e) => setBonFile(e.target.files[0] || null)} />
              </label>
            </FormField>
          </div>

          <div className={styles.lignesSection}>
            <div className={styles.lignesHeader}>
              <h3 className={styles.lignesTitle}>Articles demandés</h3>
              <Button type="button" variant="secondary" size="sm" onClick={addLigne}><MdAdd /> Ajouter</Button>
            </div>
            {errors['lignes'] && <p className={styles.errorMsg}>{errors['lignes'][0]}</p>}
            <table className={styles.lignesTable}>
              <thead>
                <tr><th>Article</th><th>Quantité</th><th>Motif</th><th></th></tr>
              </thead>
              <tbody>
                {lignes.map((l, i) => (
                  <tr key={i}>
                    <td>
                      <Select value={l.article_id} onChange={(e) => setLigne(i, 'article_id', e.target.value)} required>
                        <option value="">-- Article --</option>
                        {articles.map((a) => <option key={a.id} value={a.id}>{a.designation} (stock: {a.stock_actuel})</option>)}
                      </Select>
                    </td>
                    <td>
                      <Input type="number" min="1" value={l.quantite_demandee} onChange={(e) => setLigne(i, 'quantite_demandee', parseInt(e.target.value) || 1)} required />
                    </td>
                    <td>
                      <Input value={l.motif} onChange={(e) => setLigne(i, 'motif', e.target.value)} placeholder="Motif (optionnel)" />
                    </td>
                    <td>
                      {lignes.length > 1 && (
                        <button type="button" className={styles.removeLigne} onClick={() => removeLigne(i)}><MdDelete /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.formActions}>
            <Button type="submit" disabled={saving}>{saving ? 'Envoi…' : 'Soumettre la demande'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/demandes')}>Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
