import client from './client'

export const getRoles = () => client.get('/roles')
export const getRole = (id) => client.get(`/roles/${id}`)
export const createRole = (data) => client.post('/roles', data)
export const updateRole = (id, data) => client.put(`/roles/${id}`, data)
export const deleteRole = (id) => client.delete(`/roles/${id}`)
