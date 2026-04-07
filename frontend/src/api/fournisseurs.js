import client from './client'

export const getFournisseurs = (params) => client.get('/fournisseurs', { params })
export const getFournisseur = (id) => client.get(`/fournisseurs/${id}`)
export const createFournisseur = (data) => client.post('/fournisseurs', data)
export const updateFournisseur = (id, data) => client.put(`/fournisseurs/${id}`, data)
export const deleteFournisseur = (id) => client.delete(`/fournisseurs/${id}`)
