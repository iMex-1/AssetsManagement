import client from './client'

export const getAffectations = (params) => client.get('/affectations', { params })
export const getAffectation = (id) => client.get(`/affectations/${id}`)
export const createAffectation = (data) => client.post('/affectations', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const updateAffectationEtat = (id, etat) => client.patch(`/affectations/${id}/etat`, { etat })
export const deleteAffectation = (id) => client.delete(`/affectations/${id}`)
