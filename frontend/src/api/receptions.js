import client from './client'

export const getReceptions = (params) => client.get('/receptions', { params })
export const getReception = (id) => client.get(`/receptions/${id}`)
export const createReception = (data) => client.post('/receptions', data)
export const deleteReception = (id) => client.delete(`/receptions/${id}`)
