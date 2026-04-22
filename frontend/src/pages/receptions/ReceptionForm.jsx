import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MdAdd, MdDelete } from 'react-icons/md'
import { createReception } from '../../api/receptions'
import { getFournisseurs } from '../../api/fournisseurs'
import { getArticles } from '../../api/articles'
import { Button } from '../../components/ui/Button'
import { FormField, Input, Select } from '../../components/ui/FormField'
import { Spinner } from '../../components/ui/Spinner'
import styles from './Receptions.module.css'

const emptyLigne = (articleId = '') => ({
  mode: articleId ? 'existing' : 'existing', // 'existing' | 'new'
  article_id: articleId,
  quantite_recue: 1,
  article_data: { designation: '', categorie: '', seuil_alerte: 0 },
})

export function ReceptionForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const prefilledArticleId = searchParams.get('article_id') ?? ''

  const [form, setForm] = useState({
    fournisseur_id: '',
    type_doc: '',
    date_reception: new Date().toISOString().split('T')[0],
  })
  const [lignes, setLignes] = useState([emptyLigne(prefilledArticleId)])
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

  const setLigneArticleData = (i, field, value) => {
    const next = [...lignes]
    next[i] = {
      ...next[i],
      article_data: { ...next[i].article_data, [field]: value },
    }
    // Reset seuil_alerte when switching to Materiel
    if (field === 'categorie' && value === 'Materiel') {
      next[i].article_data.seuil_alerte = 0
    }
    setLignes(next)
  }

  const toggleMode = (i, mode) => {
    const next = [...lignes]
    next[i] = { ...next[i], mode, article_id: '', article_data: { designation: '', categorie: '', seuil_alerte: 0 } }
    setLignes(next)
  }

  const addLigne = () => setLignes([...lignes, emptyLigne()])
  const removeLigne = (i) => setLignes(lignes.filter((_, idx) => idx !== i))

  const buildPayload = () => {
    return lignes.map((l) => {
      if (l.mode === 'existing') {
        return { article_id: l.article_id, quantite_recue: l.quantite_recue }
      }
      return { article_data: l.article_data, quantite_recue: l.quantite_recue }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      await createReception({ ...form, lignes: buildPayload() })
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

            <div className={styles.lignesRows}>
              {lignes.map((l, i) => (
                <div key={i} className={styles.ligneCard}>
                  {/* Mode toggle */}
                  <div className={styles.modeToggle}>
                    <button
                      type="button"
                      className={`${styles.modeBtn} ${l.mode === 'existing' ? styles.modeBtnActive : ''}`}
                      onClick={() => toggleMode(i, 'existing')}
                    >
                      Article existant
                    </button>
                    <button
                      type="button"
                      className={`${styles.modeBtn} ${l.mode === 'new' ? styles.modeBtnActive : ''}`}
                      onClick={() => toggleMode(i, 'new')}
                    >
                      + Nouvel article
                    </button>
                  </div>

                  <div className={styles.ligneFields}>
                    {l.mode === 'existing' ? (
                      <FormField label="Article" error={errors[`lignes.${i}.article_id`]?.[0]} required>
                        <Select
                          value={l.article_id}
                          onChange={(e) => setLigne(i, 'article_id', e.target.value)}
                          error={errors[`lignes.${i}.article_id`]?.[0]}
                          required
                        >
                          <option value="">-- Choisir un article --</option>
                          {articles.map((a) => (
                            <option key={a.id} value={a.id}>{a.designation} ({a.categorie})</option>
                          ))}
                        </Select>
                      </FormField>
                    ) : (
                      <div className={styles.newArticleFields}>
                        <FormField label="Désignation" error={errors[`lignes.${i}.article_data.designation`]?.[0]} required>
                          <Input
                            value={l.article_data.designation}
                            onChange={(e) => setLigneArticleData(i, 'designation', e.target.value)}
                            error={errors[`lignes.${i}.article_data.designation`]?.[0]}
                            placeholder="Nom de l'article"
                            required
                          />
                        </FormField>
                        <FormField label="Catégorie" error={errors[`lignes.${i}.article_data.categorie`]?.[0]} required>
                          <Select
                            value={l.article_data.categorie}
                            onChange={(e) => setLigneArticleData(i, 'categorie', e.target.value)}
                            error={errors[`lignes.${i}.article_data.categorie`]?.[0]}
                            required
                          >
                            <option value="">-- Catégorie --</option>
                            <option value="Materiel">Matériel</option>
                            <option value="Fourniture">Fourniture</option>
                          </Select>
                        </FormField>
                        {l.article_data.categorie === 'Fourniture' && (
                          <FormField label="Seuil d'alerte" error={errors[`lignes.${i}.article_data.seuil_alerte`]?.[0]}>
                            <Input
                              type="number" min="0"
                              value={l.article_data.seuil_alerte}
                              onChange={(e) => setLigneArticleData(i, 'seuil_alerte', parseInt(e.target.value) || 0)}
                              error={errors[`lignes.${i}.article_data.seuil_alerte`]?.[0]}
                            />
                          </FormField>
                        )}
                      </div>
                    )}

                    <FormField label="Quantité reçue" error={errors[`lignes.${i}.quantite_recue`]?.[0]} required>
                      <Input
                        type="number" min="1"
                        value={l.quantite_recue}
                        onFocus={(e) => { e.target.select(); setLigne(i, 'quantite_recue', '') }}
                        onBlur={(e) => {
                          const v = parseInt(e.target.value)
                          setLigne(i, 'quantite_recue', isNaN(v) || v < 1 ? 1 : v)
                        }}
                        onChange={(e) => setLigne(i, 'quantite_recue', e.target.value)}
                        error={errors[`lignes.${i}.quantite_recue`]?.[0]}
                        required
                      />
                    </FormField>
                  </div>

                  {lignes.length > 1 && (
                    <button type="button" className={styles.removeLigneCard} onClick={() => removeLigne(i)}>
                      <MdDelete />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
