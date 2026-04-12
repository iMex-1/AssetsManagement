import client from './client'

export const getAffectations = (params) => client.get('/affectations', { params })
export const getAffectation = (id) => client.get(`/affectations/${id}`)
export const createAffectation = (data) => client.post('/affectations', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const deleteAffectation = (id) => client.delete(`/affectations/${id}`)
