import client from './client'

export const getDemandes = (params) => client.get('/demandes', { params })
export const getDemande = (id) => client.get(`/demandes/${id}`)
export const createDemande = (data) => client.post('/demandes', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const updateDemandeStatut = (id, data) => {
  // Laravel doesn't parse multipart PUT — use POST with _method spoofing
  if (data instanceof FormData) {
    data.append('_method', 'PUT')
    return client.post(`/demandes/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }
  return client.put(`/demandes/${id}`, data)
}
export const deleteDemande = (id) => client.delete(`/demandes/${id}`)
