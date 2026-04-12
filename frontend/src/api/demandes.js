import client from './client'

export const getDemandes = (params) => client.get('/demandes', { params })
export const getDemande = (id) => client.get(`/demandes/${id}`)
export const createDemande = (data) => client.post('/demandes', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const updateDemandeStatut = (id, data) => client.put(`/demandes/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const deleteDemande = (id) => client.delete(`/demandes/${id}`)
